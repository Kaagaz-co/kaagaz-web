import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, Maximize2, X } from 'lucide-react';

// Utility to format titles from file names
const formatTitle = (path) => {
  const name = path.split('/').pop().replace(/\.[^.]+$/, '');
  return name.replace(/[\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
};

// Load portfolio assets from the new location
const portfolioAssets = import.meta.glob('../../../assets/portfolio/portfolio/*.{mp4,MP4,jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}', { 
  eager: true, 
  as: 'url' 
});

// Get video dimensions
const getVideoDimensions = (url) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight
      });
    };
    video.onerror = () => resolve({ width: 0, height: 0, aspectRatio: 1 });
  });
};

// Get image dimensions
const getImageDimensions = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
    img.onerror = () => resolve({ width: 0, height: 0, aspectRatio: 1 });
  });
};

// Categorize media by type and get dimensions
const categorizeMedia = async () => {
  const items = [];
  
  for (const [path, url] of Object.entries(portfolioAssets)) {
    const fileName = path.split('/').pop().toLowerCase();
    const title = formatTitle(path);
    
    // Determine media type
    let type = 'image';
    let category = 'Static';
    
    if (fileName.endsWith('.mp4')) {
      type = 'video';
      category = 'Video';
    } else if (fileName.endsWith('.gif')) {
      type = 'gif';
      category = 'Animation';
    }
    
    items.push({
      type,
      category,
      src: url,
      title,
      alt: title,
      fileName
    });
  }
  
  // Get dimensions for all items
  const itemsWithDimensions = await Promise.all(
    items.map(async (item) => {
      let dimensions;
      if (item.type === 'video') {
        dimensions = await getVideoDimensions(item.src);
      } else {
        dimensions = await getImageDimensions(item.src);
      }
      return { ...item, ...dimensions };
    })
  );
  
  return itemsWithDimensions;
};

// Assign grid spans based on actual aspect ratio
const assignGridSpans = (items) => {
  return items.map((item, idx) => {
    const aspectRatio = item.aspectRatio || 1;
    let span = 'col-span-1 row-span-1';
    
    // Portrait (taller than wide) - aspectRatio < 0.75
    if (aspectRatio < 0.75) {
      span = 'col-span-1 row-span-2';
    }
    // Very portrait (very tall) - aspectRatio < 0.6
    else if (aspectRatio < 0.6) {
      span = 'col-span-1 row-span-3';
    }
    // Landscape (wider than tall) - aspectRatio > 1.3
    else if (aspectRatio > 1.3) {
      span = 'col-span-2 row-span-1';
    }
    // Very landscape (very wide) - aspectRatio > 2
    else if (aspectRatio > 2) {
      span = 'col-span-3 row-span-1';
    }
    // Square-ish (0.75 to 1.3)
    else {
      // Vary sizes for visual interest
      const patterns = [
        'col-span-1 row-span-1',
        'col-span-2 row-span-2',
        'col-span-1 row-span-1',
      ];
      span = patterns[idx % patterns.length];
    }
    
    return { ...item, span };
  });
};

// Video item with play on scroll
const VideoItem = ({ item, index, onOpen }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { 
    amount: 0.3,
    once: false 
  });
  
  useEffect(() => {
    if (videoRef.current) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView]);
  
  // Determine object-fit based on aspect ratio
  const objectFit = item.aspectRatio < 0.75 || item.aspectRatio > 1.3 ? 'object-contain' : 'object-cover';
  
  return (
    <motion.div
      ref={containerRef}
      className={`group relative overflow-hidden rounded-lg bg-black cursor-pointer ${item.span}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.3, delay: index * 0.01 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onOpen(item)}
    >
      <video
        ref={videoRef}
        className={`w-full h-full ${objectFit}`}
        src={item.src}
        muted
        loop
        playsInline
        preload="metadata"
      />
      
      {/* Play indicator */}
      {!isInView && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="text-kaagaz-red ml-1" size={20} fill="currentColor" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Image/GIF item
const ImageItem = ({ item, index, onOpen }) => {
  // Determine object-fit based on aspect ratio
  const objectFit = item.aspectRatio < 0.75 || item.aspectRatio > 1.3 ? 'object-contain' : 'object-cover';
  
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-lg bg-black cursor-pointer ${item.span}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.3, delay: index * 0.01 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onOpen(item)}
    >
      <img
        className={`w-full h-full ${objectFit} transition-transform duration-500 group-hover:scale-110`}
        alt={item.alt}
        src={item.src}
        loading="lazy"
      />
    </motion.div>
  );
};

// Lightbox modal
const Lightbox = ({ item, onClose }) => {
  const videoRef = useRef(null);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  useEffect(() => {
    if (videoRef.current && item.type === 'video') {
      videoRef.current.play().catch(() => {});
    }
  }, [item]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[10000] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="relative w-full max-w-7xl"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            className="w-full max-h-[90vh] rounded-lg shadow-2xl mx-auto"
            src={item.src}
            controls
            playsInline
            loop
          />
        ) : (
          <img
            src={item.src}
            alt={item.alt}
            className="w-full max-h-[90vh] object-contain rounded-lg shadow-2xl mx-auto"
          />
        )}
        
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
          <p className="text-white text-lg font-medium">{item.title}</p>
          <p className="text-white/60 text-sm mt-1">{item.category}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Portfolio = () => {
  const [items, setItems] = useState([]);
  const [activeItem, setActiveItem] = useState(null);
  
  useEffect(() => {
    const loadPortfolio = async () => {
      const categorized = await categorizeMedia();
      const withSpans = assignGridSpans(categorized);
      setItems(withSpans);
    };
    loadPortfolio();
  }, []);
  
  if (items.length === 0) {
    return (
      <section id="portfolio" className="py-24 bg-background">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </section>
    );
  }
  
  return (
    <section id="portfolio" className="py-24 bg-background relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-kaagaz-red/5 to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.h2 
            className="text-5xl md:text-7xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Our <span className="gradient-text">Work</span>
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl max-w-3xl mx-auto text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Where creativity meets strategy. Each piece tells a story, sparks emotion, and leaves a mark.
          </motion.p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 auto-rows-[140px] gap-2 md:gap-3">
          {items.map((item, index) => (
            item.type === 'video' ? (
              <VideoItem 
                key={index} 
                item={item} 
                index={index} 
                onOpen={setActiveItem}
              />
            ) : (
              <ImageItem 
                key={index} 
                item={item} 
                index={index} 
                onOpen={setActiveItem}
              />
            )
          ))}
        </div>
      </div>
      
      {/* Lightbox */}
      {activeItem && (
        <Lightbox item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </section>
  );
};
