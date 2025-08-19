// Optimized marketing interactions using IntersectionObserver
(function() {
  const state = {
    cards: [],
    visible: new Set(),
    progressDots: [],
    progressText: null,
  };

  function cacheDom() {
    state.cards = Array.from(document.querySelectorAll('.service-card'));
    state.progressDots = Array.from(document.querySelectorAll('.progress-dot'));
    state.progressText = document.getElementById('progressText');
  }

  function addCardAnimationDelays() {
    state.cards.forEach((card, index) => {
      card.style.transitionDelay = `${Math.min(index, 10) * 0.08}s`;
    });
  }

  function setupCtaHandlers() {
    document.querySelectorAll('.cta-button, .footer-button').forEach(button => {
      button.addEventListener('click', () => {
        alert('Contact form would open here!');
      });
    });
  }

  function updateProgressIndicator() {
    const visibleCount = state.visible.size;
    if (state.progressText) {
      if (visibleCount === 0) {
        state.progressText.textContent = 'Discovering our services...';
      } else if (visibleCount < state.cards.length) {
        state.progressText.textContent = 'Continue exploring...';
      } else {
        state.progressText.textContent = 'Ready to get started?';
      }
    }
    state.progressDots.forEach((dot, idx) => {
      if (idx < visibleCount) dot.classList.add('active');
      else dot.classList.remove('active');
    });
  }

  function setupIntersection() {
    // Reveal cards as they enter the viewport for smooth progressive load
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const idx = state.cards.indexOf(entry.target);
        if (idx === -1) continue;
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          state.visible.add(idx);
        } else {
          // allow hiding when scrolled far away to keep progress responsive
          entry.target.classList.remove('visible');
          state.visible.delete(idx);
        }
      }
      updateProgressIndicator();
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15,
    });

    state.cards.forEach(card => io.observe(card));
  }

  function revealMarketingWrapper() {
    document.body.classList.add('show-marketing');
  }

  function init() {
    cacheDom();

    // Remove helper text and per-card CTA buttons
    const helper = document.querySelector('.helper');
    if (helper) helper.remove();
    document.querySelectorAll('.card-cta').forEach(el => el.remove());

    addCardAnimationDelays();
    setupIntersection();
    setupCtaHandlers();

    // Reveal with a slight delay to avoid style thrash after initial overlay
    setTimeout(revealMarketingWrapper, 250);
  }

  window.addEventListener('load', init, { once: true });
})();
