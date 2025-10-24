import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useScroll, LayoutGroup } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/components/ui/use-toast';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Portfolio } from '@/components/sections/Portfolio';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';
import { ThemeToggle } from '@/components/ThemeToggle';

import BackgroundAudio from '@/components/BackgroundAudio';
import IntroVideoOverlay from './components/IntroVideoOverlay';
import bgmUrl from '../bgm/webaudio.mp3?url';
import { setBgMusicPlaying } from './state/audioBus';
import sideVideoUrl from '../video/kaagaz-intro.mp4?url';
import logoBeigeUrl from './assets/logo-beige.svg';
import logoRedUrl from './assets/logo-red.svg';

export function App() {
  const [theme, setTheme] = useState('dark');
  const [showIntro, setShowIntro] = useState(true);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const introPlayedRef = useRef(false);
  const [docked, setDocked] = useState(false);

  // Local logo assets: red for light mode, beige for dark mode
  const currentLogo = theme === 'dark' ? logoBeigeUrl : logoRedUrl;

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#1A1A1A' : '#FFFFFF';
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLinkClick = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
       toast({
        title: `🚧 This section isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`
      });
    }
  };

  // Ensure background is dark during intro overlay
  useEffect(() => {
    if (showIntro) {
      setBgMusicPlaying(false);
    }
  }, [showIntro]);

  // Update docked when user scrolls a bit past the hero start
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      setDocked(v > 0.045);
    });
    return () => unsub();
  }, [scrollYProgress]);

  return (
    <LayoutGroup>
      <Helmet>
        <title>Kaagaz Studios</title>
        <meta name="description" content="Kaagaz Studios: Visual branding, websites, campaigns and content with a desi-retro soul." />
        <meta property="og:title" content="Kaagaz Studios" />
        <meta property="og:description" content="Visual branding, websites, campaigns and content with a desi-retro soul." />
      </Helmet>

      {/* Fullscreen intro overlay */}
  <IntroVideoOverlay
        show={showIntro}
        onEnd={() => setShowIntro(false)}
      />

      <Toaster />
      <ThemeToggle theme={theme} toggleTheme={handleThemeToggle} />
  <Header onLinkClick={handleLinkClick} scrollYProgress={scrollYProgress} logoUrl={currentLogo} docked={docked} />

  {/* Background music controller (kept available, overlay pauses it) */}
  <BackgroundAudio src={bgmUrl} />

      <main ref={containerRef} className="relative bg-background text-foreground">
  <Hero scrollYProgress={scrollYProgress} logoUrl={currentLogo} docked={docked} />
        <div id="main-content" className="relative z-10 bg-background">
          {/* Inline embedded video section (muted, looping) right after the logo section */}
          <section className="pt-4 pb-8 -mt-6">
            <div className="max-w-6xl mx-auto px-4">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                <video
                  src={sideVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </section>
          <Services />
          <Portfolio onLinkClick={handleLinkClick} />

          {/* Pre-contact quote */}
          <section className="py-16 bg-background">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-2xl md:text-3xl font-semibold gradient-text-multi leading-relaxed">
                "Ready to build a brand that gets whispered about over chai and is the main conversation at your parties?"
              </p>
            </div>
          </section>
          <Contact />
          <Footer onLinkClick={handleLinkClick} logoUrl={currentLogo} />
        </div>
      </main>
  </LayoutGroup>
  );
}