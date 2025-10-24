import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero = ({ scrollYProgress, logoUrl, docked = false }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);

  // New animation: large logo occupies top half, gently scales & fades out as user starts scrolling
  // Enlarged to cover more of the top half
  const scale = useTransform(scrollYProgress, [0, 0.08], [2.5, 0.55]);
  const opacity = useTransform(scrollYProgress, [0.07, 0.14], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.015, 0.08], [1, 1, 0]);

  return (
    <section id="hero" className="h-[100vh] relative">
      <div
        ref={containerRef}
        className="sticky top-0 h-screen bg-background overflow-hidden"
      >
        <motion.div
          ref={logoRef}
          style={{ scale, opacity }}
          className="absolute top-0 left-0 w-full h-[60vh] flex items-center justify-center pt-4 md:pt-6"
          layoutId={docked ? 'kaagaz-logo' : undefined}
        >
          <motion.img
            src={logoUrl}
            alt="Kaagaz Logo"
            className="h-full w-auto max-w-none select-none"
            layoutId={docked ? 'kaagaz-logo-img' : undefined}
            draggable={false}
          />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center text-muted-foreground"
          style={{ opacity: indicatorOpacity }}
          transition={{ duration: 0.25 }}
        >
          <span className="text-sm tracking-wide uppercase">Scroll to discover</span>
          <ArrowDown className="animate-bounce mt-2" />
        </motion.div>
      </div>
    </section>
  );
};