import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music2 } from 'lucide-react';
import { setBgMusicPlaying, subscribeBgMusic } from '@/state/audioBus';

// Background audio play/mute button fixed bottom-left (opposite ThemeToggle)
export default function BackgroundAudio({ src = '/audio/track.mp3', disabled = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.6;
    return () => {};
  }, []);

  // React to global bus requests: pause when someone sets playing to false
  useEffect(() => {
    const unsub = subscribeBgMusic((shouldPlay) => {
      if (!audioRef.current) return;
      if (!shouldPlay && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      // Do not auto-play on true to avoid unexpected starts
    });
    return () => unsub();
  }, []);

  // If disabled, ensure paused
  useEffect(() => {
    if (disabled && audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [disabled]);

  const toggle = async () => {
    if (!audioRef.current) return;
    try {
      const isPaused = audioRef.current.paused;
      if (isPaused) {
        await audioRef.current.play();
        setPlaying(true);
        setBgMusicPlaying(true);
      } else {
        audioRef.current.pause();
        setPlaying(false);
        setBgMusicPlaying(false);
      }
    } catch (e) {
      // If blocked by autoplay policy, ignore; user can tap again
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
  onPlay={() => { setPlaying(true); setBgMusicPlaying(true); }}
  onPause={() => { setPlaying(false); setBgMusicPlaying(false); }}
      />
      <motion.button
        onClick={toggle}
        className="fixed bottom-5 left-5 bg-kaagaz-red/80 backdrop-blur-sm text-white w-14 h-14 rounded-full flex items-center justify-center z-50 shadow-lg overflow-hidden"
        whileHover={{ scale: 1.1, rotate: -15 }}
        whileTap={{ scale: 0.9, rotate: 15 }}
        aria-label={playing ? 'Mute background music' : 'Play background music'}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={playing ? 'on' : 'off'}
            initial={{ y: -30, opacity: 0, rotate: -90 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 30, opacity: 0, rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            {playing ? <Volume2 size={28} /> : <Music2 size={28} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </>
  );
}
