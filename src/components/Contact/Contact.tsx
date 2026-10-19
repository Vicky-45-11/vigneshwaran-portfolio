import { useState, type ChangeEvent, type FormEvent } from 'react';
import { ArrowUpRight, Check, Copy, Mail, Phone } from 'lucide-react';
import { FadeIn } from '../animations/FadeIn';
import { ContactButton } from '../ui/ContactButton';
import { GithubIcon } from '../icons/GithubIcon';
import { personal } from '../../data/portfolio';

type Field = 'name' | 'email' | 'subject' | 'message';
type FormState = Record<Field, string>;

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

/** Builds a mailto: URL with every user-supplied value percent-encoded. */
function buildMailto(values: FormState): string {
  const subject = encodeURIComponent(values.subject.trim());
  const body = encodeURIComponent(
    `${values.message.trim()}\n\n— ${values.name.trim()}\n${values.email.trim()}`,
  );
  return `mailto:${personal.email}?subject=${subject}&body=${body}`;
}

const channels = [
  { label: 'Email', value: personal.email, href: `mailto:${personal.email}`, icon: Mail, external: false },
  { label: 'Phone', value: personal.phone, href: `tel:+91${personal.phone}`, icon: Phone, external: false },
  { label: 'GitHub', value: `github.com/${personal.githubHandle}`, href: personal.github, icon: GithubIcon, external: true },
];

export function Contact() {
  const [values, setValues] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as Field;
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`)?.focus();
      return;
    }
    window.location.href = buildMailto(values);
    setOpened(true);
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
    `mt-2 w-full rounded-2xl border bg-ink-800 px-4 py-3.5 text-base text-mist placeholder:text-mist-dim transition-colors duration-200 focus:outline-none focus-visible:border-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
      errors[field] ? 'border-red-400/70' : 'border-line hover:border-line-strong'
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

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-24 sm:py-36">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.18),transparent_60%)]"
        aria-hidden="true"
      />
      <div className="container-editorial relative">
        <FadeIn y={12} duration={0.5}>
          <p className="label-mono flex items-center gap-3 text-mist-muted">
            <span className="text-accent-light">08</span>
            <span className="h-px w-10 bg-white/20" aria-hidden="true" />
            Contact
          </p>
        </FadeIn>
        <FadeIn y={40} duration={0.9}>
          <h2
            id="contact-title"
            className="hero-heading mt-6 text-[clamp(2.75rem,10vw,10rem)] font-black uppercase leading-[0.86] tracking-[-0.035em]"
          >
            Let's build something great.
          </h2>
        </FadeIn>
        <FadeIn delay={0.1} className="mt-8 max-w-xl text-lg text-mist sm:text-xl">
          Have an idea, project, or opportunity? Let's connect.
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12">
          <FadeIn className="lg:col-span-5">
            <ul className="border-t border-line">
              {channels.map(({ label, value, href, icon: Icon, external }) => (
                <li key={label} className="border-b border-line">
                  <a
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-4 py-6"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-accent-light">
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
              className="label-mono mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-mist-muted transition-colors hover:border-line-strong hover:text-mist"
            >
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? 'Email copied' : 'Copy email'}
            </button>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied to clipboard.' : ''}
            </span>
            <p className="label-mono mt-8 text-mist-dim">{personal.location}</p>
          </FadeIn>

          <FadeIn delay={0.1} className="lg:col-span-7">
            <form noValidate onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" aria-describedby="contact-form-note">
              {renderField('name', 'Name', 'text', 'name')}
              {renderField('email', 'Email', 'email', 'email')}
              <div className="sm:col-span-2">{renderField('subject', 'Subject', 'text')}</div>
              {renderField('message', 'Message', 'textarea')}

              <div className="flex flex-col gap-5 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <p id="contact-form-note" className="max-w-sm text-sm leading-relaxed text-mist-muted">
                  This site has no mail server. Submitting opens your email app with the message filled in, ready for you to send.
                </p>
                <ContactButton type="submit" />
              </div>
              <p className="text-sm text-accent-light sm:col-span-2" aria-live="polite">
                {opened
                  ? `Your email app should now be open. If nothing happened, write to ${personal.email} directly.`
                  : ''}
              </p>
            </form>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
