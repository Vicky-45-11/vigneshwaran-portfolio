import { useState } from 'react';
import { BackgroundCanvas } from './components/3d/BackgroundCanvas';
import { CustomCursor } from './components/Cursor/CustomCursor';
import { IntroScreen } from './components/Intro/IntroScreen';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { About } from './components/About/About';
import { Skills } from './components/Skills/Skills';
import { Projects } from './components/Projects/Projects';
import { Experience } from './components/Experience/Experience';
import { Education } from './components/Education/Education';
import { Certifications } from './components/Certifications/Certifications';
import { CurrentlyBuilding } from './components/Creative/CurrentlyBuilding';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { useScrollProgress } from './hooks/useScrollProgress';

export function App() {
  const [introFinished, setIntroFinished] = useState(() => {
    return sessionStorage.getItem('vs_intro_seen') === 'true';
  });

  const { scrollProgress, activeSection } = useScrollProgress();

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-blue-600/30 selection:text-blue-200 relative overflow-x-hidden font-sans">
      {/* Interactive Custom Cursor on Desktop */}
      <CustomCursor />

      {/* Ambient Neural Particle Background */}
      <BackgroundCanvas />

      {/* Landing Intro Modal (if not yet entered) */}
      {!introFinished && (
        <IntroScreen onEnter={() => setIntroFinished(true)} />
      )}

      {/* Fixed Navigation Bar */}
      <Navbar activeSection={activeSection} scrollProgress={scrollProgress} />

      {/* Main Sections */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certifications />
        <CurrentlyBuilding />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
