import { useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import { IntroScreen } from './components/Intro/IntroScreen';
import { Navbar } from './components/Navbar/Navbar';
import { Hero } from './components/Hero/Hero';
import { TechMarquee } from './components/Marquee/TechMarquee';
import { About } from './components/About/About';
import { TechnicalFocus } from './components/Focus/TechnicalFocus';
import { Skills } from './components/Skills/Skills';
import { SkillTree } from './components/Extras/SkillTree';
import { ResumeChest } from './components/Extras/ResumeChest';
import { VillagerGuide } from './components/Extras/VillagerGuide';
import { BlockPlayground } from './components/Extras/BlockPlayground';
import { Projects } from './components/Projects/Projects';
import { Experience } from './components/Experience/Experience';
import { Education } from './components/Education/Education';
import { Certifications } from './components/Certifications/Certifications';
import { Contact } from './components/Contact/Contact';
import { Footer } from './components/Footer/Footer';
import { sectionIds } from './data/portfolio';
import { useScrollProgress } from './hooks/useScrollProgress';
import { BlockBreak } from './components/World/BlockBreak';
import { Hud } from './components/World/Hud';
import { WorldBackground } from './components/World/WorldBackground';
import { SnowOverlay } from './components/World/SnowOverlay';
import { ChatConsole } from './components/World/ChatConsole';
import { GameSettingsProvider } from './components/World/GameSettings';
import { useGame } from './components/World/gameContext';

const INTRO_KEY = 'vs_intro_seen';

/** Show the intro once per browser session, and never over a deep link. */
function shouldShowIntro(): boolean {
  if (window.location.hash) return false;
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'true';
  } catch {
    return true;
  }
}

export function App() {
  return (
    <GameSettingsProvider>
      <Portfolio />
    </GameSettingsProvider>
  );
}

function Portfolio() {
  const [introOpen, setIntroOpen] = useState(shouldShowIntro);
  const [introSkipped, setIntroSkipped] = useState(false);
  const { night, weather } = useGame();
  const { progress, activeSection } = useScrollProgress(sectionIds);

  const finishIntro = useCallback((skipped: boolean) => {
    try {
      sessionStorage.setItem(INTRO_KEY, 'true');
    } catch {
      // Storage can be unavailable (private mode); the intro just shows again next visit.
    }
    setIntroSkipped(skipped);
    setIntroOpen(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="label-mono fixed left-4 top-4 z-[70] -translate-y-24 bg-mist px-4 py-3 text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>

      <WorldBackground night={night} weather={weather} />
      {!introOpen && <BlockBreak />}
      <SnowOverlay active={weather === 'snow' && !introOpen} />
      <Hud activeSection={activeSection} progress={progress} visible={!introOpen} />
      <ChatConsole visible={!introOpen} />

      <AnimatePresence custom={introSkipped}>
        {introOpen && <IntroScreen onFinish={finishIntro} />}
      </AnimatePresence>

      <div className="relative min-h-screen overflow-x-clip pb-24 text-mist sm:pb-28" inert={introOpen}>
        <Navbar activeSection={activeSection} ready={!introOpen} />
        <main id="main">
          <Hero ready={!introOpen} />
          <TechMarquee />
          <About />
          <TechnicalFocus />
          <Skills />
          <SkillTree />
          <Projects />
          <Experience />
          <Education />
          <Certifications />
          <ResumeChest />
          <VillagerGuide />
          <BlockPlayground />
          <Contact />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default App;
