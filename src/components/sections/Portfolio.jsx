import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

// Utility to make a nice title from file names
const formatTitle = (path) => {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '');
  return name.replace(/[\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
};

// Load local assets using Vite's import.meta.glob
const reelsMap = import.meta.glob('../../../portfolio/reels/*.{mp4,MP4}', { eager: true, as: 'url' });
const videosMap = import.meta.glob('../../../portfolio/videos/*.{mp4,MP4}', { eager: true, as: 'url' });
const staticsMap = import.meta.glob('../../../portfolio/statics/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', { eager: true, as: 'url' });

const buildItems = () => {
  const photos = [];
  const reels = [];
  const videos = [];

  for (const [path, url] of Object.entries(staticsMap)) {
    const title = formatTitle(path);
    const forceHorizontal = /loved by you\.png$/i.test(path) || /loved by you$/i.test(title);
    photos.push({ type: 'image', src: url, title, category: 'Photo', alt: title, forceHorizontal });
  }
  for (const [path, url] of Object.entries(reelsMap)) {
    reels.push({ type: 'video', src: url, title: formatTitle(path), category: 'Reel', alt: formatTitle(path) });
  }
  for (const [path, url] of Object.entries(videosMap)) {
    videos.push({ type: 'video', src: url, title: formatTitle(path), category: 'Video', alt: formatTitle(path) });
  }

  // Interleave in an entertaining repeating pattern: Photo → Reel → Photo → Video
  const pattern = ['photo', 'reel', 'photo', 'video'];
  const result = [];
  let i = 0;
  const take = (kind) => {
    if (kind === 'photo' && photos.length) return photos.shift();
    if (kind === 'reel' && reels.length) return reels.shift();
    if (kind === 'video' && videos.length) return videos.shift();
    return null;
  };

  while (photos.length || reels.length || videos.length) {
    const kind = pattern[i % pattern.length];
    let picked = take(kind);
    if (!picked) picked = take('photo') || take('reel') || take('video');
    if (picked) result.push(picked);
    i++;
  }

  // Base mosaic pattern, then adjust by type to enforce orientation
  return result.map((it, idx) => {
    let span =
      idx % 6 === 0
        ? 'md:col-span-3 md:row-span-2'
        : idx % 6 === 1
        ? 'md:col-span-3 md:row-span-2'
        : idx % 6 === 2
        ? 'md:col-span-2 md:row-span-2'
        : 'md:col-span-2 md:row-span-1';

    // Enforce orientation per type without discarding the mosaic feel
    if (it.category === 'Reel') {
      // Taller than wide
      span = 'md:col-span-2 md:row-span-3';
    } else if (it.category === 'Video') {
      // Wider than tall
      span = 'md:col-span-3 md:row-span-2';
    } else if (it.category === 'Photo') {
      // Roughly square
      span = 'md:col-span-2 md:row-span-2';
      if (it.forceHorizontal) {
        // Special-case for "loved by you.png" to force a horizontal tile
        span = 'md:col-span-3 md:row-span-2';
      }
    }

    return { ...it, span };
  });
};

const CollageItem = ({ item, index, onOpen }) => {
  const videoRef = useRef(null);
  return (
    <motion.button
      type="button"
      key={index}
      onClick={() => onOpen(item)}
  className={`group relative overflow-hidden rounded-xl border border-border bg-background text-left ${item.span}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: index * 0.03 }}
    >
  <div className={"relative h-full " + (item.category === 'Reel' ? 'bg-black' : item.category === 'Video' ? 'bg-black' : 'bg-black')}>
        {item.type === 'image' ? (
          <img
    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            alt={item.alt}
            src={item.src}
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        ) : (
          <video
            ref={videoRef}
    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            src={item.src}
            muted
            loop
            playsInline
            preload="metadata"
            onMouseEnter={() => videoRef.current && videoRef.current.play()}
            onMouseLeave={() => {
              if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
              }
            }}
          />
        )}
  {/* Removed text overlays (category/title) per request */}
      </div>
    </motion.button>
  );
};

export const Portfolio = ({ onLinkClick }) => {
  const items = useMemo(buildItems, []);
  const [active, setActive] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setActive(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Our <span className="gradient-text">Creations</span>
          </h2>
          <p className="text-lg max-w-3xl mx-auto gradient-text-multi">
            This isn't a portfolio it's a collection of stories. These are the brands we've helped find their soul, the ideas we've brought to life and the work we put everything into.
          </p>
        </motion.div>

  <div className="grid grid-cols-2 md:grid-cols-6 auto-rows-[10rem] md:auto-rows-[12rem] gap-4 md:gap-5">
          {items.map((item, index) => (
            <CollageItem key={index} item={item} index={index} onOpen={setActive} />
          ))}
        </div>

  {/* Removed Full Portfolio button as requested */}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button near the media (top-right inside container) */}
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute top-3 right-3 z-[1100] rounded-md bg-white/15 text-white hover:bg-white/25 px-3 py-1.5 backdrop-blur-sm"
            >
              ✕
            </button>
            {active.type === 'image' ? (
              <img
                src={active.src}
                alt={active.alt}
                className="block mx-auto max-w-full max-h-[calc(100vh-4rem)] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <VideoPlayer src={active.src} />
            )}
          </div>
        </div>
      )}
    </section>
  );
};

const VideoPlayer = ({ src }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.muted = false;
      ref.current.play().catch(() => {
        // In case autoplay with sound is blocked, show controls for manual play
        ref.current.setAttribute('controls', '');
      });
    }
  }, []);
  return (
    <video
      ref={ref}
      className="w-full max-h-[calc(100vh-8rem)] rounded-lg shadow-2xl"
      src={src}
      controls
      playsInline
    />
  );
};