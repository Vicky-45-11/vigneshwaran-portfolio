import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Loader2, Mail, Phone, Send } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { GithubIcon } from '../icons/GithubIcon';
import { personal } from '../../data/portfolio';

type Field = 'name' | 'email' | 'subject' | 'message';
type FormState = Record<Field, string>;
type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY: FormState = { name: '', email: '', subject: '', message: '' };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(values: FormState): Partial<Record<Field, string>> {
  const errors: Partial<Record<Field, string>> = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim()) errors.subject = 'Please add a subject.';
  if (!values.message.trim()) errors.message = 'Please write a message.';
  return errors;
}

const channels = [
  { label: 'Email', value: personal.email, href: `mailto:${personal.email}`, icon: Mail, external: false },
  { label: 'Phone', value: personal.phone, href: `tel:+91${personal.phone}`, icon: Phone, external: false },
  { label: 'GitHub', value: `github.com/${personal.githubHandle}`, href: personal.github, icon: GithubIcon, external: true },
];

export function Contact() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverError, setServerError] = useState('');
  const [trap, setTrap] = useState('');
  const [copied, setCopied] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field;
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
    if (status === 'sent' || status === 'error') setStatus('idle');
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }

    setStatus('sending');
    setServerError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, company: trap }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        setServerError(data?.error ?? '');
        setStatus('error');
        return;
      }
      setValues(EMPTY);
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the address is still visible and selectable.
    }
  };

  const fieldClass = (field: Field) =>
    `mt-2 w-full border-[3px] bg-black px-4 py-3 text-base text-white placeholder:text-mist-dim transition-colors duration-200 focus:outline-none focus-visible:border-white focus-visible:outline-none ${
      errors[field] ? 'border-red-500' : 'border-[#a0a0a0] hover:border-[#d0d0d0]'
    }`;

  const renderField = (field: Field, label: string, type: 'text' | 'email' | 'textarea', autoComplete?: string) => (
    <div className={field === 'message' ? 'sm:col-span-2' : undefined}>
      <label htmlFor={`contact-${field}`} className="label-mono text-mist-muted">
        {label} <span aria-hidden="true" className="text-accent-light">*</span>
      </label>
      {type === 'textarea' ? (
        <textarea
          id={`contact-${field}`}
          name={field}
          rows={6}
          required
          maxLength={5000}
          value={values[field]}
          onChange={onChange}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `contact-${field}-error` : undefined}
          className={`${fieldClass(field)} resize-y`}
        />
      ) : (
        <input
          id={`contact-${field}`}
          name={field}
          type={type}
          required
          maxLength={200}
          autoComplete={autoComplete}
          value={values[field]}
          onChange={onChange}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `contact-${field}-error` : undefined}
          className={fieldClass(field)}
        />
      )}
      {errors[field] && (
        <p id={`contact-${field}-error`} className="mt-2 text-sm text-red-300">
          {errors[field]}
        </p>
      )}
    </div>
  );

  const sending = status === 'sending';

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-24 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(160,90,255,0.16),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container-editorial relative">
        <FadeIn y={12} duration={0.5}>
          <p className="label-mono flex items-center gap-3 text-white [text-shadow:2px_2px_0_#000]">
            <span className="text-[#ffff55]">08</span>
            <span className="h-[3px] w-10 bg-white/40" aria-hidden="true" />
            Contact
          </p>
        </FadeIn>
        <FadeIn y={40} duration={0.9}>
          <h2
            id="contact-title"
            className="hero-heading hero-heading--end mt-6 text-[clamp(2.4rem,8.5vw,8.5rem)] font-bold uppercase leading-[0.92]"
          >
            Let's build something great.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} className="mc-card mt-8 max-w-xl p-5 text-lg text-white sm:text-xl">
          Have an idea, project, or opportunity? Let's connect.
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <ul className="mc-card px-5">
              {channels.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label} className="border-b-[3px] border-black/60 last:border-b-0">
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-4 py-6"
                  >
                    <span className="mc-slot flex h-11 w-11 shrink-0 items-center justify-center text-accent-cyan">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="label-mono block text-mist-dim">{label}</span>
                      <span className="mt-1 block break-all text-base text-mist transition-colors group-hover:text-white sm:text-lg">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight size={20} aria-hidden="true" className="shrink-0 text-mist-dim transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-mist" />
                    {external && <span className="sr-only">(opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={copyEmail}
              className="mc-btn mt-6 inline-flex min-h-11 items-center gap-2 px-4 text-base"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? 'Email copied' : 'Copy email'}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard.' : ''}
            </span>
            <p className="label-mono mt-8 text-white/70">{personal.location}</p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <form noValidate onSubmit={onSubmit} className="mc-card grid gap-5 p-5 sm:grid-cols-2 sm:p-7" aria-describedby="contact-form-note">
              {renderField('name', 'Name', 'text', 'name')}
              {renderField('email', 'Email', 'email', 'email')}
              <div className="sm:col-span-2">{renderField('subject', 'Subject', 'text')}</div>
              {renderField('message', 'Message', 'textarea')}

              {/* Honeypot: hidden from people and assistive tech, bots tend to fill it in. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={trap}
                  onChange={(e) => setTrap(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p id="contact-form-note" className="max-w-sm text-sm leading-relaxed text-mist-muted">
                  Your message goes straight to my inbox and I will reply to the email address you enter.
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="mc-btn mc-btn--green group inline-flex min-h-12 items-center justify-center gap-3 px-7 py-3 text-lg disabled:cursor-wait disabled:opacity-70"
                >
                  <span>{sending ? 'SENDING...' : 'SEND MESSAGE'}</span>
                  {sending ? (
                    <Loader2 size={18} aria-hidden="true" className="animate-spin" />
                  ) : (
                    <Send size={18} aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </button>
              </div>
              <div className="sm:col-span-2" aria-live="polite" role="status">
                {status === 'sent' && (
                  <p className="mc-slot flex items-center gap-2 px-4 py-3 text-sm text-accent-light">
                    <Check size={16} aria-hidden="true" />
                    Message sent. Thank you, I will get back to you soon.
                  </p>
                )}
                {status === 'error' && (
                  <p className="border-[3px] border-red-500 bg-black px-4 py-3 text-sm text-red-300">
                    {serverError || 'Something went wrong.'} Please try again, or write to {personal.email} directly.
                  </p>
                )}
              </div>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
