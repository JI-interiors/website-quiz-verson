(() => {
  /* Lead-form consent: require affirmative consent and record the submission time. */
  document.querySelectorAll('form[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', () => {
      const timestamp = form.querySelector('input[name="consent_timestamp"]');
      if (timestamp) timestamp.value = new Date().toISOString();
    });
  });

  const menuBtn = document.getElementById('menuBtn');
  const menu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');

  if (!menuBtn || !menu) return;

  const isMobile = () => window.matchMedia('(max-width: 759px)').matches;

  const setMenu = (open) => {
    /* Desktop has no drawer state. */
    if (!isMobile()) {
      menu.classList.remove('open');
      backdrop?.classList.remove('open');
      document.body.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Open menu');
      return;
    }

    menu.classList.toggle('open', open);
    backdrop?.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    backdrop?.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('menu-open', open);
  };

  const closeMenu = () => setMenu(false);

  /* Hamburger is a mobile-only control. */
  menuBtn.addEventListener('click', (event) => {
    if (!isMobile()) return;
    event.preventDefault();
    event.stopPropagation();
    setMenu(!menu.classList.contains('open'));
  });

  backdrop?.addEventListener('click', () => {
    if (isMobile()) closeMenu();
  });

  menu.addEventListener('click', (event) => {
    if (!isMobile()) return;
    event.stopPropagation();
    const link = event.target.closest('a');
    if (link) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!isMobile() || !menu.classList.contains('open')) return;
    if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
      closeMenu();
    }
  }, true);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isMobile()) {
      closeMenu();
      menuBtn.focus();
    }
  });

  const syncViewport = () => {
    if (!isMobile()) closeMenu();
  };

  window.addEventListener('resize', syncViewport);
  window.addEventListener('orientationchange', syncViewport);
  syncViewport();

  /* Mobile design-image carousel for every Design Ideas category page. */
  const initDesignCarousels = () => {
    document.querySelectorAll('.design-gallery').forEach((gallery) => {
      if (gallery.dataset.carouselReady === 'true') return;
      const cards = [...gallery.querySelectorAll('.gallery-card')];
      if (cards.length < 2) return;

      gallery.dataset.carouselReady = 'true';
      gallery.setAttribute('role', 'region');
      gallery.setAttribute('aria-label', 'Design image carousel');

      const ui = document.createElement('div');
      ui.className = 'gallery-carousel-ui';
      const dots = document.createElement('div');
      dots.className = 'gallery-carousel-dots';
      dots.setAttribute('aria-label', 'Choose design image');
      const arrows = document.createElement('div');
      arrows.className = 'gallery-carousel-arrows';

      const makeArrow = (label, symbol) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-carousel-arrow';
        button.setAttribute('aria-label', label);
        button.innerHTML = symbol;
        return button;
      };
      const prev = makeArrow('Previous design image', '&#8592;');
      const next = makeArrow('Next design image', '&#8594;');
      arrows.append(prev, next);
      ui.append(dots, arrows);
      gallery.insertAdjacentElement('afterend', ui);

      const dotButtons = cards.map((card, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'gallery-carousel-dot';
        dot.setAttribute('aria-label', `Show design image ${index + 1}`);
        dot.addEventListener('click', () => card.scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'}));
        dots.appendChild(dot);
        return dot;
      });

      const getActiveIndex = () => {
        const left = gallery.scrollLeft;
        return cards.reduce((best, card, i) => Math.abs(card.offsetLeft-left) < Math.abs(cards[best].offsetLeft-left) ? i : best, 0);
      };
      const setActive = (index) => {
        dotButtons.forEach((dot, i) => {
          dot.classList.toggle('active', i === index);
          dot.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
        prev.disabled = index === 0;
        next.disabled = index === cards.length - 1;
      };
      const goTo = (index) => {
        const safe = Math.max(0, Math.min(cards.length - 1, index));
        cards[safe].scrollIntoView({behavior:'smooth', block:'nearest', inline:'start'});
        setActive(safe);
      };

      prev.addEventListener('click', () => goTo(getActiveIndex() - 1));
      next.addEventListener('click', () => goTo(getActiveIndex() + 1));
      let ticking = false;
      gallery.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { setActive(getActiveIndex()); ticking = false; });
      }, {passive:true});
      setActive(0);
    });
  };
  initDesignCarousels();
})();
