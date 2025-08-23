import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 bg-kaagaz-red/80 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg overflow-hidden"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9, rotate: -15 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -30, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 30, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};