import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../../data/portfolio';
import { GithubIcon } from '../icons/GithubIcon';

interface NavbarProps {
  activeSection: string;
  scrollProgress: number;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, scrollProgress }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#hero', id: 'hero' },
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Projects', href: '#projects', id: 'projects' },
    { label: 'Experience', href: '#experience', id: 'experience' },
    { label: 'Education', href: '#education', id: 'education' },
    { label: 'Certifications', href: '#certifications', id: 'certifications' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-xl shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="group flex items-center gap-3 text-white no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          aria-label="Vigneshwaran S Homepage"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center font-mono font-bold text-sm text-white shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
            {PORTFOLIO_DATA.personal.shortName}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight text-[#F5F5F5] group-hover:text-blue-400 transition-colors">
              Vigneshwaran<span className="text-blue-400">.dev</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A] tracking-wider uppercase -mt-0.5">
              AI / Software Dev
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`relative px-3 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? 'text-white bg-white/[0.08] font-semibold'
                    : 'text-[#A1A1AA] hover:text-[#F5F5F5] hover:bg-white/[0.03]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-[2px] bg-blue-400 rounded-full shadow-sm shadow-blue-400"
                    aria-hidden="true"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right CTA / GitHub */}
        <div className="hidden sm:flex items-center gap-3">
          <a
            href={PORTFOLIO_DATA.personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#A1A1AA] hover:text-white border border-white/10 hover:border-blue-500/40 bg-white/[0.02] hover:bg-blue-600/10 transition-all duration-200"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
            <ArrowUpRight size={12} className="text-blue-400" />
          </a>

          <a
            href="#contact"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 transition-all duration-200"
          >
            Get In Touch
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#050505]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'text-blue-400 bg-blue-500/10 font-semibold'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            );
          })}

          <div className="pt-4 mt-2 border-t border-white/10 flex items-center gap-3">
            <a
              href={PORTFOLIO_DATA.personal.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono border border-white/10 text-white bg-white/5"
            >
              <GithubIcon size={14} />
              <span>GitHub</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-medium bg-blue-600 text-white"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
