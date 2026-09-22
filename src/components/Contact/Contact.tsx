import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Copy, Check, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PORTFOLIO_DATA.personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || `Inquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Hi Vigneshwaran,\n\n${formData.message}\n\nFrom: ${formData.name} (${formData.email})`
    );
    window.location.href = `mailto:${PORTFOLIO_DATA.personal.email}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-xs tracking-widest uppercase mb-3">
            <span>07. GET IN TOUCH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight text-[#F5F5F5] uppercase">
            Let's build something great.
          </h2>
          <p className="mt-3 text-[#A1A1AA] text-base sm:text-lg max-w-2xl font-sans">
            Have an opportunity, collaboration or interesting problem in mind? Let's connect.
          </p>
        </div>

        {/* Two-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contact Information (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Email Card with Copy button */}
            <div className="p-6 rounded-2xl bg-[#111111]/80 border border-white/[0.08] backdrop-blur-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                  Direct Email
                </span>
                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              <a
                href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                className="text-base sm:text-lg font-bold text-[#F5F5F5] hover:text-blue-400 transition-colors break-all flex items-center gap-2"
              >
                <Mail size={18} className="text-blue-400 shrink-0" />
                <span>{PORTFOLIO_DATA.personal.email}</span>
              </a>
            </div>

            {/* Phone Card */}
            <div className="p-6 rounded-2xl bg-[#111111]/80 border border-white/[0.08] backdrop-blur-md">
              <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-2">
                Phone Contact
              </span>
              <a
                href={`tel:${PORTFOLIO_DATA.personal.phone}`}
                className="text-base sm:text-lg font-bold text-[#F5F5F5] hover:text-blue-400 transition-colors flex items-center gap-2"
              >
                <Phone size={18} className="text-cyan-400 shrink-0" />
                <span>+91 {PORTFOLIO_DATA.personal.phone}</span>
              </a>
            </div>

            {/* Location & GitHub */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#111111]/80 border border-white/[0.08] backdrop-blur-md">
                <span className="block text-[11px] font-mono text-[#71717A] uppercase tracking-wider mb-1.5">
                  Location
                </span>
                <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5F5]">
                  <MapPin size={16} className="text-emerald-400 shrink-0" />
                  <span>{PORTFOLIO_DATA.personal.location}</span>
                </div>
              </div>

              <a
                href={PORTFOLIO_DATA.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-[#111111]/80 hover:bg-[#161616] border border-white/[0.08] hover:border-blue-500/40 transition-all backdrop-blur-md group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-[#71717A] uppercase tracking-wider">
                    GitHub
                  </span>
                  <ArrowUpRight size={14} className="text-[#71717A] group-hover:text-blue-400 transition-colors" />
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#F5F5F5] group-hover:text-blue-300 transition-colors">
                  <GithubIcon size={16} className="text-blue-400 shrink-0" />
                  <span>vignesh45-eng</span>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 cols) */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-[#111111]/80 border border-white/[0.08] backdrop-blur-md space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08] focus:border-blue-500 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08] focus:border-blue-500 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g. Software Development Project Collaboration"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08] focus:border-blue-500 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project, question, or opportunity..."
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/[0.08] focus:border-blue-500 text-sm text-[#F5F5F5] placeholder-[#555] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
                >
                  <span>SEND MESSAGE</span>
                  <Send size={15} />
                </button>

                <span className="text-[11px] font-mono text-[#71717A] text-center sm:text-right">
                  Opens default email client with formatted message
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
