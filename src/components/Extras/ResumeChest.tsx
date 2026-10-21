import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Download, GraduationCap, Mail, MapPin } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { certifications, education, personal } from '../../data/portfolio';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// A chest that opens to the quick facts a recruiter looks for. Everything comes
// from the portfolio data, and the resume PDF is served from public/.
const RESUME_URL = '/Vigneshwaran_S_Resume.pdf';

export function ResumeChest() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const primary = education.find((e) => e.primary) ?? education[0];

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(personal.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${personal.email}`;
    }
  };

  const items = [
    { icon: <GraduationCap size={18} />, title: primary.qualification, sub: `${primary.institution} · ${primary.period}${primary.cgpa ? ` · CGPA ${primary.cgpa}` : ''}` },
    { icon: <MapPin size={18} />, title: personal.location, sub: personal.headline },
    { icon: <Check size={18} />, title: `${certifications.length} certifications`, sub: [...new Set(certifications.map((c) => c.area))].join(' · ') },
  ];

  return (
    <section aria-labelledby="chest-title" className="relative z-10 pb-24 sm:pb-32">
      <div className="container-editorial">
        <SectionHeading index="08.5" label="Quick facts" title="Resume chest" id="chest-title" size="lg" />

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-[18rem_1fr]">
          <button
            type="button"
            aria-expanded={open}
            aria-controls="chest-loot"
            onClick={() => setOpen((o) => !o)}
            className="group mx-auto flex w-60 flex-col items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <span className="relative block h-40 w-56 [perspective:600px]">
              {/* Lid */}
              <motion.span
                className="absolute left-0 right-0 top-0 z-10 block h-[38%] origin-top border-[4px] border-[#1a0f05] bg-[#8b5a2b] shadow-[inset_0_-6px_0_#6b4220,inset_0_4px_0_#a8733a]"
                animate={{ rotateX: open ? -110 : 0 }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 160, damping: 14 }}
              />
              {/* Body */}
              <span className="absolute bottom-0 left-0 right-0 block h-[66%] border-[4px] border-[#1a0f05] bg-[#7a4e24] shadow-[inset_0_-6px_0_#5a3818]">
                <span className="absolute left-1/2 top-0 h-6 w-5 -translate-x-1/2 border-[3px] border-[#1a0f05] bg-[#c9c9c9]" />
              </span>
              {/* Glow from inside */}
              <span className={`absolute inset-x-6 top-[30%] z-0 h-6 bg-accent-light blur-xl transition-opacity duration-500 ${open ? 'opacity-70' : 'opacity-0'}`} aria-hidden="true" />
            </span>
            <span className="label-mono text-white transition-colors group-hover:text-[#ffff55]">{open ? 'Close chest' : 'Open chest'}</span>
          </button>

          <div id="chest-loot" className="min-h-[15rem]">
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  key="loot"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.35 }}
                  className="flex flex-col gap-3"
                >
                  {items.map((it, i) => (
                    <motion.li
                      key={it.title}
                      initial={reduce ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.12 * i, duration: 0.3 }}
                      className="mc-card flex items-start gap-3 p-4"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center bg-accent text-ink">{it.icon}</span>
                      <span className="min-w-0">
                        <span className="block font-pixel text-base text-white sm:text-lg">{it.title}</span>
                        <span className="block font-mono text-[1.05rem] leading-tight text-mist-muted">{it.sub}</span>
                      </span>
                    </motion.li>
                  ))}
                  <li className="flex flex-wrap gap-3">
                    <button type="button" onClick={copyEmail} className="mc-btn inline-flex min-h-11 items-center gap-2 px-4 text-sm">
                      {copied ? <Check size={16} /> : <Mail size={16} />}
                      {copied ? 'Email copied' : personal.email}
                      {!copied && <Copy size={14} aria-hidden="true" />}
                    </button>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
            {!open && <p className="label-mono text-mist-muted">Click the chest to see the loot.</p>}
            <a
              href={RESUME_URL}
              download
              className="mc-btn mt-5 inline-flex min-h-11 items-center gap-2 px-4 text-sm"
            >
              <Download size={16} aria-hidden="true" />
              Download resume (PDF)
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
