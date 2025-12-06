import React, { useRef, useState, useEffect } from 'react';
import { motion, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero = ({ scrollYProgress, logoUrl, docked = false }) => {
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const [showTagline, setShowTagline] = useState(true);

  // Hide tagline after 3.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTagline(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

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

        {/* Animated Tagline */}
        <AnimatePresence>
          {showTagline && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex items-center justify-center overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 1 }}
              transition={{ 
                initial: { duration: 0.8, ease: "easeOut" }
              }}
            >
              <motion.h2 
                className="text-sm tracking-wide uppercase text-muted-foreground text-center whitespace-nowrap"
                initial={{ x: 0, opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ 
                  exit: { duration: 0.8, ease: "easeInOut" }
                }}
              >
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  A brand that
                </motion.span>
                {' '}
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                >
                  builds brands
                </motion.span>
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Indicator - Matches tagline fade style */}
        <AnimatePresence>
          {!showTagline && (
            <motion.div
              className="absolute bottom-10 left-0 right-0 flex flex-col items-center text-muted-foreground overflow-hidden"
              style={{ opacity: indicatorOpacity }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="text-sm tracking-wide uppercase">Scroll to discover</span>
              <ArrowDown className="animate-bounce mt-2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};