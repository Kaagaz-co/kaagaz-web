import React from 'react';
import { motion, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export const Hero = ({ scrollYProgress, logoUrl }) => {
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.1]);
  const y = useTransform(scrollYProgress, [0, 0.1], ['0vh', '-45vh']);
  const x = useTransform(scrollYProgress, [0, 0.1], ['0vw', '-42vw']);
  const opacity = useTransform(scrollYProgress, [0.09, 0.1], [1, 0]);

  return (
    <section id="hero" className="h-[110vh] relative">
      <div className="sticky top-0 h-screen bg-background flex items-center justify-center overflow-hidden">
        <motion.div
          style={{ scale, y, x, opacity }}
          className="w-1/2 md:w-1/3 lg:w-1/4"
        >
          <img src={logoUrl} alt="Kaagaz Logo" className="w-full h-auto" />
        </motion.div>
        <motion.div 
          className="absolute bottom-10 flex flex-col items-center text-muted-foreground"
          initial={{ opacity: 1 }}
          animate={{ opacity: scrollYProgress.get() > 0.01 ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span>Scroll to discover</span>
          <ArrowDown className="animate-bounce mt-2" />
        </motion.div>
      </div>
    </section>
  );
};