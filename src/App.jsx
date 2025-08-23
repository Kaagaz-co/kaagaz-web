import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useScroll } from 'framer-motion';
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
import bgmUrl from '../bgm/webaudio.mp3?url';

export function App() {
  const [theme, setTheme] = useState('dark');
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });

  // Original logo assets
  const whiteLogoUrl = "https://horizons-cdn.hostinger.com/ea4a0944-c125-4cee-b05d-173d6af0abc9/870850d9c0845479e374ac68bb031de4.png";
  const blackLogoUrl = "https://horizons-cdn.hostinger.com/ea4a0944-c125-4cee-b05d-173d6af0abc9/7135189e6127c43c5f180675693db8e4.png";
  const currentLogo = theme === 'dark' ? whiteLogoUrl : blackLogoUrl;

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

  return (
    <>
      <Helmet>
        <title>Kaagaz Studios</title>
        <meta name="description" content="Kaagaz Studios: Visual branding, websites, campaigns and content with a desi-retro soul." />
        <meta property="og:title" content="Kaagaz Studios" />
        <meta property="og:description" content="Visual branding, websites, campaigns and content with a desi-retro soul." />
      </Helmet>
      
      <Toaster />
  <ThemeToggle theme={theme} toggleTheme={handleThemeToggle} />
      <Header onLinkClick={handleLinkClick} scrollYProgress={scrollYProgress} logoUrl={currentLogo} />

  {/* Background audio control (requires user interaction to start) */}
  <BackgroundAudio src={bgmUrl} />

      <main ref={containerRef} className="relative bg-background text-foreground">
        <Hero scrollYProgress={scrollYProgress} logoUrl={currentLogo} />
        <div id="main-content" className="relative z-10 bg-background">
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
    </>
  );
}