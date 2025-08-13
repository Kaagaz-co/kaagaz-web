document.addEventListener('DOMContentLoaded', () => {
  // Show overlay 2 seconds after page load
  const overlay = document.getElementById('overlay');
  const container = document.querySelector('.video-container');
  const bgVideo = document.getElementById('bg-video') || document.querySelector('.video-container video');
  const csVideo = document.getElementById('coming-soon-video');
  const bgAmbient = document.getElementById('bg-ambient');
  const csAmbient = document.getElementById('cs-ambient');

  // Match coming-soon scale to landing video (static, no animation)
  const updateCSScale = () => {
    if (!bgVideo || !csVideo) return;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const bgw = bgVideo.videoWidth;
    const bgh = bgVideo.videoHeight;
    const csw = csVideo.videoWidth;
    const csh = csVideo.videoHeight;
    if (!bgw || !bgh || !csw || !csh) return;
    const bgScale = Math.max(vw / bgw, vh / bgh);
    const csScale = Math.max(vw / csw, vh / csh);
    const ratio = (bgScale && csScale) ? (bgScale / csScale) : 1;
    // reduce CS perceived size slightly
    const ADJUST = 0.94;
    csVideo.style.transform = 'scale(' + (ratio * ADJUST) + ')';
    csVideo.style.transformOrigin = 'center center';
  };

  if (bgVideo) bgVideo.addEventListener('loadedmetadata', updateCSScale);
  if (csVideo) csVideo.addEventListener('loadedmetadata', updateCSScale);
  window.addEventListener('resize', () => {
    clearTimeout(window.__csScaleTimer);
    window.__csScaleTimer = setTimeout(updateCSScale, 100);
  });
  // Show overlay immediately to avoid initial poster/logo flash
  if (overlay) overlay.classList.add('active');

  // One-time swap from logo to "Coming Soon" text on first scroll/gesture
  const handleSwap = (e) => {
    if (!overlay) return;

    const isScrollEvent = e && (e.type === 'scroll' || e.type === 'wheel' || e.type === 'mousewheel');
    const isTouchGesture = e && (e.type === 'touchstart' || e.type === 'touchmove');
    const isKeyScroll = e && (e.type === 'keydown' && ['ArrowDown','PageDown','Space',' '].includes(e.key));

    // Trigger when there's scroll delta or relevant gesture/keys
    if (window.scrollY > 0 || isScrollEvent || isTouchGesture || isKeyScroll) {
      // Ensure overlay shows at least once
      if (!overlay.classList.contains('active')) {
        overlay.classList.add('active');
      }

      // Crossfade to Coming Soon video
      if (container) container.classList.add('play-coming-soon');

      // Start ambient CS glow
      if (csAmbient) {
        try {
          csAmbient.muted = true;
          const pA = csAmbient.play();
          if (pA && typeof pA.then === 'function') pA.catch(() => {});
        } catch(_) {}
      }

      if (csVideo) {
        try {
          csVideo.muted = true; // reliable autoplay on user gesture
          csVideo.loop = false;
          const p2 = csVideo.play();
          if (p2 && typeof p2.then === 'function') p2.catch(() => {});
        } catch (_) {}
      }

      // Keep bg video (and ambient) running during fade, then pause
      const stopDelay = 1050; // align with CSS transition ~1.0-1.2s
      if (bgVideo) {
        setTimeout(() => {
          try { bgVideo.pause(); } catch(_) {}
        }, stopDelay);
      }
      if (bgAmbient) {
        setTimeout(() => {
          try { bgAmbient.pause(); } catch(_) {}
        }, stopDelay);
      }

      // Fade overlay out smoothly
      overlay.classList.add('swap');
      setTimeout(() => overlay.classList.add('fade-out'), 200);

      // Clean up listeners
      window.removeEventListener('scroll', handleSwap);
      window.removeEventListener('wheel', handleSwap);
      window.removeEventListener('mousewheel', handleSwap);
      window.removeEventListener('touchstart', handleSwap);
      window.removeEventListener('touchmove', handleSwap);
      window.removeEventListener('keydown', handleSwap);
    }
  };
  window.addEventListener('scroll', handleSwap, { passive: true });
  window.addEventListener('wheel', handleSwap, { passive: true });
  window.addEventListener('mousewheel', handleSwap, { passive: true });
  window.addEventListener('touchstart', handleSwap, { passive: true });
  window.addEventListener('touchmove', handleSwap, { passive: true });
  window.addEventListener('keydown', handleSwap);

  // Ensure background and coming-soon videos have correct attributes
  if (bgVideo) {
    bgVideo.setAttribute('playsinline', '');
    bgVideo.setAttribute('webkit-playsinline', '');
    bgVideo.setAttribute('muted', '');
    bgVideo.muted = true;
    bgVideo.loop = true;
    bgVideo.autoplay = true;
    bgVideo.playsInline = true;
  }
  if (csVideo) {
    csVideo.setAttribute('playsinline', '');
    csVideo.setAttribute('webkit-playsinline', '');
    csVideo.setAttribute('muted', '');
    csVideo.muted = true;
    csVideo.loop = false;
    csVideo.autoplay = false;
    csVideo.playsInline = true;
    try { csVideo.pause(); } catch(_) {}
  }

  // Ambient layers attributes
  if (bgAmbient) {
    bgAmbient.setAttribute('playsinline', '');
    bgAmbient.setAttribute('webkit-playsinline', '');
    bgAmbient.setAttribute('muted', '');
    bgAmbient.muted = true;
    bgAmbient.loop = true;
    bgAmbient.autoplay = true;
    bgAmbient.playsInline = true;
  }
  if (csAmbient) {
    csAmbient.setAttribute('playsinline', '');
    csAmbient.setAttribute('webkit-playsinline', '');
    csAmbient.setAttribute('muted', '');
    csAmbient.muted = true;
    csAmbient.loop = true; // glow layer can loop
    csAmbient.autoplay = false;
    csAmbient.playsInline = true;
    try { csAmbient.pause(); } catch(_) {}
  }

  // Background video source fallback + autoplay helpers
  if (bgVideo) {
    const sources = [
      'assets/videos/landing-video.mp4',
      'landing-video.mp4'
    ];

    let currentSourceIndex = 0;
    let triedOnce = false;

    const setSource = (src) => {
      // only switch if not already set to this src
      if (bgVideo.src && bgVideo.src.endsWith(src)) return;
      bgVideo.src = src;
      bgVideo.load();
    };

    const tryPlay = () => {
      try {
        const p = bgVideo.play();
        if (p && typeof p.then === 'function') p.catch(() => {});
      } catch (_) {}
    };

    const tryNextSource = () => {
      if (currentSourceIndex < sources.length - 1) {
        currentSourceIndex += 1;
        setSource(sources[currentSourceIndex]);
        tryPlay();
      }
    };

    // Load initial source and try playing
    setSource(sources[currentSourceIndex]);
    tryPlay();

    // Retry on common loading/playback issues
    bgVideo.addEventListener('error', tryNextSource);
    bgVideo.addEventListener('stalled', tryNextSource);
    bgVideo.addEventListener('emptied', tryNextSource);

    // If it takes too long to become ready, attempt fallback once
    setTimeout(() => {
      if (bgVideo.readyState < 2 && !triedOnce) {
        triedOnce = true;
        tryNextSource();
      }
    }, 1500);

    // Start playback on first user interaction if blocked
    const resumeOnInteraction = () => {
      tryPlay();
      window.removeEventListener('click', resumeOnInteraction);
      window.removeEventListener('touchstart', resumeOnInteraction);
      window.removeEventListener('keydown', resumeOnInteraction);
    };
    window.addEventListener('click', resumeOnInteraction, { once: true });
    window.addEventListener('touchstart', resumeOnInteraction, { once: true });
    window.addEventListener('keydown', resumeOnInteraction, { once: true });

    // Maintain looping and resume playback if it ends or tab becomes visible
    bgVideo.addEventListener('ended', () => {
      bgVideo.currentTime = 0;
      tryPlay();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') tryPlay();
    });
  }
});
