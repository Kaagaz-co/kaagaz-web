import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero = ({ scrollYProgress, logoUrl, docked = false }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const [target, setTarget] = useState({ dx: -50, dy: -50, s: 0.08 });

  // Measure the target position of the header logo and compute delta from center
  useLayoutEffect(() => {
    const compute = () => {
      const headerEl = document.getElementById('header-logo-anchor');
      const heroEl = logoRef.current;
      if (!headerEl || !heroEl) return;
      const headerRect = headerEl.getBoundingClientRect();
      const heroRect = heroEl.getBoundingClientRect();
      // Compute center of hero logo and top-left of header anchor
      const heroCx = heroRect.left + heroRect.width / 2;
      const heroCy = heroRect.top + heroRect.height / 2;
      const headerX = headerRect.left + headerRect.width / 2; // center for smoother match
      const headerY = headerRect.top + headerRect.height / 2;
      const dx = headerX - heroCx;
      const dy = headerY - heroCy;
      // Scale factor to roughly match header width (24 -> 96px approx) vs hero width
      const desiredHeaderWidth = headerRect.width || 96;
      const s = desiredHeaderWidth / heroRect.width;
      setTarget({ dx, dy, s });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Move straight up: no left translation, small scale-down, quick fade
  const scale = useTransform(scrollYProgress, [0, 0.05], [1.2, 0.5]);
  const x = useTransform(scrollYProgress, [0, 0.05], ['0px', '0px']);
  const y = useTransform(scrollYProgress, [0, 0.05], ['0px', '-55vh']);
  const opacity = useTransform(scrollYProgress, [0.04, 0.06], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.005, 0.02], [1, 1, 0]);

  return (
    <section id="hero" className="h-[100vh] relative">
      <div ref={containerRef} className="sticky top-0 h-screen bg-background flex items-center justify-center overflow-hidden">
        <motion.div
          ref={logoRef}
          style={{ scale, y, x, opacity }}
          className="w-3/4 sm:w-2/3 md:w-1/2 lg:w-1/3 xl:w-1/4"
          layoutId={docked ? 'kaagaz-logo' : undefined}
        >
          <motion.img src={logoUrl} alt="Kaagaz Logo" className="w-full h-auto" layoutId={docked ? 'kaagaz-logo-img' : undefined} />
        </motion.div>
        <motion.div 
          className="absolute bottom-10 flex flex-col items-center text-muted-foreground"
          style={{ opacity: indicatorOpacity }}
          transition={{ duration: 0.2 }}
        >
          <span>Scroll to discover</span>
          <ArrowDown className="animate-bounce mt-2" />
        </motion.div>
      </div>
    </section>
  );
};