import React from 'react';
import { motion, useTransform } from 'framer-motion';

export const Header = ({ onLinkClick, scrollYProgress, logoUrl, docked = false }) => {
  // Reveal header earlier so it appears immediately as the logo moves
  const headerOpacity = useTransform(scrollYProgress, [0.02, 0.04], [0, 1]);
  const headerY = useTransform(scrollYProgress, [0.02, 0.04], [-100, 0]);

  return (
    <motion.header
      style={{
        opacity: headerOpacity,
        y: headerY,
      }}
      className="fixed top-0 left-0 w-full z-40"
    >
      <div className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <motion.div 
            id="header-logo-anchor"
            className="w-24"
            whileHover={{ scale: 1.05 }}
            layoutId={docked ? 'kaagaz-logo' : undefined}
          >
            <motion.img src={logoUrl} alt="Kaagaz Logo" className="w-full h-auto" layoutId={docked ? 'kaagaz-logo-img' : undefined} />
          </motion.div>
          <nav className="flex items-center space-x-8">
            <button onClick={() => onLinkClick('portfolio')} className="text-foreground hover:text-kaagaz-red transition-colors duration-300 font-medium">Portfolio</button>
            <button 
              onClick={() => onLinkClick('contact')} 
              className="bg-kaagaz-red text-white px-6 py-2 rounded-md hover:bg-kaagaz-red/90 transition-colors duration-300 font-semibold"
            >
              Let's Talk
            </button>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};