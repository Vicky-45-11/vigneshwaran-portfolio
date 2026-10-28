/**
 * Vercel serverless function behind the Contact form.
 *
 * Required environment variables (set in the Vercel project, never in the repo):
 *   RESEND_API_KEY      API key from resend.com
 *   CONTACT_TO_EMAIL    the inbox that should receive messages
 * Optional:
 *   CONTACT_FROM_EMAIL  verified sender, e.g. "Portfolio <contact@yourdomain.com>".
 *                       Defaults to Resend's shared test sender.
 */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 100, email: 200, subject: 150, message: 5000 } as const;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Best effort only: each serverless instance keeps its own counter.
const hits = new Map<string, number[]>();

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function rateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_MAX;
}

function clean(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request): Promise<Response> {
  let data: Record<string, unknown>;
  try {
    data = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400);
  }

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (typeof data.company === 'string' && data.company.trim() !== '') {
    return json({ ok: true });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return json({ ok: false, error: 'Too many messages. Please try again later.' }, 429);
  }

  const name = clean(data.name, LIMITS.name);
  const email = clean(data.email, LIMITS.email);
  const subject = clean(data.subject, LIMITS.subject).replace(/[\r\n]+/g, ' ');
  const message = clean(data.message, LIMITS.message);

  if (!name || !subject || !message || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, error: 'Please fill in every field with valid details.' }, 400);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return json({ ok: false, error: 'Contact form is not configured yet.' }, 500);
  }

  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>';

  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
        html,
      }),
    });
    if (!res.ok) {
      return json({ ok: false, error: 'The mail service rejected the message.' }, 502);
    }
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: 'Could not reach the mail service.' }, 502);
  }
}
