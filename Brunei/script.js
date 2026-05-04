document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const heroImg = document.getElementById('heroImg');
  const toast = document.getElementById('toast');
  const revealItems = document.querySelectorAll('.reveal-up, .reveal-scale');

  /* ── CUSTOM CURSOR ── */
  const createCursorLayer = () => {
    if ('matchMedia' in window && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';

    document.body.append(dot, ring);

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const updatePosition = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
      ring.style.left = `${currentX}px`;
      ring.style.top = `${currentY}px`;

      window.requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    });

    window.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.querySelectorAll('a, button, input, select, .gallery-item, .tl-card, .pkg-tab').forEach((element) => {
      element.addEventListener('mouseenter', () => ring.classList.add('hover'));
      element.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    updatePosition();
  };

  /* ── IMAGE FALLBACKS ── */
  const createFallbackDataUri = (label) => {
    const safeLabel = (label || 'Image').trim().slice(0, 30) || 'Image';
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#111111"/>
            <stop offset="100%" stop-color="#2b2111"/>
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill="url(#g)"/>
        <circle cx="640" cy="120" r="100" fill="#c9a84c" opacity="0.18"/>
        <circle cx="160" cy="470" r="140" fill="#c9a84c" opacity="0.12"/>
        <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" fill="#f5f0e8" font-family="Georgia, serif" font-size="34" letter-spacing="4">${safeLabel.replace(/&/g, '&amp;')}</text>
        <text x="50%" y="58%" dominant-baseline="middle" text-anchor="middle" fill="#c9a84c" font-family="Arial, sans-serif" font-size="14" letter-spacing="3">IMAGE UNAVAILABLE</text>
      </svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const wireImageFallbacks = () => {
    const replaceBrokenImage = (img) => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.src = createFallbackDataUri(img.alt || 'Travel image');
    };

    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => replaceBrokenImage(img));
      if (img.complete && img.naturalWidth === 0) replaceBrokenImage(img);
    });

    window.setTimeout(() => {
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth === 0) replaceBrokenImage(img);
      });
    }, 1000);
  };

  createCursorLayer();
  wireImageFallbacks();

  /* ── TOAST ── */
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.hideTimer);
    showToast.hideTimer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  /* ── PRELOADER ── */
  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('done');
    window.setTimeout(() => preloader.remove(), 700);
  };
  window.setTimeout(hidePreloader, 1200);
  window.addEventListener('load', hidePreloader);

  /* ── MOBILE MENU ── */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  /* ── NAV SCROLL ── */
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    if (heroImg) heroImg.classList.toggle('zoomed', window.scrollY > 30);
  }, { passive: true });

  /* ── SCROLL REVEAL ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));

  /* ── ITINERARY TOGGLE ── */
  window.toggleDay = (card) => {
    const item = card.closest('.tl-item');
    if (!item) return;
    item.classList.toggle('open');
  };

  /* ── DYNAMIC PRICING DATA ── */
  const PRICING_DATA = {

  '2n3d': {
    cards: [
      {
        label: '2N / 3D · Solo Traveller',
        oldPrice: '₹24,999',
        price: '₹17,999',
        discount: '28% OFF',
        featured: false,
        popular: false,
        perks: [
          'Bandar Seri Begawan luxury stay',
          'Sultan Omar Ali Saifuddien Mosque visit',
          'Kampong Ayer water village tour',
          'River sunset experience',
          'All transfers & guided tours',
        ],
        btnLabel: 'Reserve 2N/3D Solo',
        pkgName: '2N/3D Brunei – Solo',
      },
      {
        label: '2N / 3D · Couple',
        oldPrice: '₹44,999',
        price: '₹29,999',
        discount: '33% OFF',
        featured: true,
        popular: 'Most Popular',
        perks: [
          'Premium hotel stay with river view',
          'Romantic dinner experience',
          'Kampong Ayer boat tour',
          'Sunset cruise & city exploration',
          'All transfers & guided tours',
        ],
        btnLabel: 'Reserve 2N/3D Couple',
        pkgName: '2N/3D Brunei – Couple',
      },
      {
        label: '2N / 3D · Group (4+)',
        oldPrice: '₹79,999',
        price: '₹49,999',
        discount: '38% OFF',
        featured: false,
        popular: false,
        perks: [
          'Luxury group hotel stay',
          'City + water village tours',
          'Private transport',
          'Group discounts on activities',
          'Meals as per itinerary',
        ],
        btnLabel: 'Reserve 2N/3D Group',
        pkgName: '2N/3D Brunei – Group',
      },
    ],
    perperson: {
      solo: '₹17,999+',
      couple: '₹14,999+',
      group: '₹12,999+',
    },
  },

  '3n4d': {
    cards: [
      {
        label: '3N / 4D · Solo Traveller',
        oldPrice: '₹29,999',
        price: '₹21,999',
        discount: '27% OFF',
        featured: false,
        popular: false,
        perks: [
          'Bandar Seri Begawan luxury stay',
          'Kampong Ayer water village tour',
          'Ulu Temburong rainforest experience',
          'Mosque & cultural city tour',
          'All transfers & guided tours',
        ],
        btnLabel: 'Reserve 3N/4D Solo',
        pkgName: '3N/4D Brunei – Solo',
      },
      {
        label: '3N / 4D · Couple',
        oldPrice: '₹54,999',
        price: '₹36,999',
        discount: '33% OFF',
        featured: true,
        popular: 'Most Popular',
        perks: [
          'Premium hotel with scenic views',
          'Romantic dinner & sunset cruise',
          'Kampong Ayer + rainforest tour',
          'Cultural experiences & city tour',
          'All transfers & concierge support',
        ],
        btnLabel: 'Reserve 3N/4D Couple',
        pkgName: '3N/4D Brunei – Couple',
      },
      {
        label: '3N / 4D · Group (4+)',
        oldPrice: '₹1,09,999',
        price: '₹64,999',
        discount: '40% OFF',
        featured: false,
        popular: false,
        perks: [
          'Luxury group accommodation',
          'Rainforest + cultural tours',
          'Private group transport',
          'Discounted activities',
          'Meals as per itinerary',
        ],
        btnLabel: 'Reserve 3N/4D Group',
        pkgName: '3N/4D Brunei – Group',
      },
    ],
    perperson: {
      solo: '₹21,999+',
      couple: '₹18,499+',
      group: '₹15,999+',
    },
  },

};
  /* ── UPDATE PRICING CARDS ── */
  const animateValue = (el, newText) => {
    el.classList.add('price-animating');
    setTimeout(() => {
      el.textContent = newText;
      el.classList.remove('price-animating');
    }, 225);
  };

  window.updatePricingSection = (pkgKey) => {
    const data = PRICING_DATA[pkgKey];
    if (!data) return;

    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach((card, i) => {
      const cardData = data.cards[i];
      if (!cardData) return;

      // featured class
      card.classList.toggle('featured', !!cardData.featured);

      // popular badge
      const popularBadge = card.querySelector('.pc-popular');
      if (cardData.popular) {
        if (popularBadge) { popularBadge.textContent = cardData.popular; popularBadge.style.display = ''; }
      } else {
        if (popularBadge) popularBadge.style.display = 'none';
      }

      // label
      const labelEl = card.querySelector('.pc-label');
      if (labelEl) labelEl.textContent = cardData.label;

      // old price
      const oldEl = card.querySelector('.pc-old');
      if (oldEl) animateValue(oldEl, cardData.oldPrice);

      // price
      const priceEl = card.querySelector('.pc-price');
      if (priceEl) animateValue(priceEl, cardData.price);

      // discount badge
      const badgeEl = card.querySelector('.pc-badge');
      if (badgeEl) badgeEl.textContent = cardData.discount;

      // perks
      const perksEl = card.querySelector('.pc-perks');
      if (perksEl) {
        perksEl.innerHTML = cardData.perks.map(p => `<li>${p}</li>`).join('');
      }

      // button
      const btnEl = card.querySelector('.btn-primary.full-btn');
      if (btnEl) {
        btnEl.textContent = cardData.btnLabel;
        btnEl.setAttribute('onclick', `selectPackage('${cardData.pkgName}')`);
      }
    });

    // per-person note
    const ppnVals = document.querySelectorAll('.ppn-val');
    if (ppnVals[0]) animateValue(ppnVals[0], data.perperson.solo);
    if (ppnVals[1]) animateValue(ppnVals[1], data.perperson.couple);
    if (ppnVals[2]) animateValue(ppnVals[2], data.perperson.group);

    // section label at top of pricing
    const priceSectionLabel = document.querySelector('.pricing .section-label');
    const labels = { '3n4d': '3N/4D · Quick Escape', '4n5d': '4N/5D · Classic Journey', '6n7d': '6N/7D · Grand Explorer' };
    if (priceSectionLabel) priceSectionLabel.textContent = labels[pkgKey] || 'Transparent Pricing';
  };

  /* ── PACKAGE SWITCHER ── */
  const pkgSections = document.querySelectorAll('.pkg-itinerary');

  window.switchPackage = (pkgKey, tabEl) => {
    // Update tabs
    document.querySelectorAll('.pkg-tab').forEach((tab) => tab.classList.remove('active'));
    if (tabEl) tabEl.classList.add('active');

    // Hide all itinerary sections, show matching one
    pkgSections.forEach((section) => {
      if (section.dataset.pkgSection === pkgKey) {
        section.style.display = 'block';
        section.classList.add('active');
        section.querySelectorAll('.reveal-up, .reveal-scale').forEach((el) => {
          el.classList.remove('visible');
        });
        window.setTimeout(() => {
          section.querySelectorAll('.reveal-up, .reveal-scale').forEach((el) => {
            revealObserver.observe(el);
          });
        }, 60);
      } else {
        section.style.display = 'none';
        section.classList.remove('active');
      }
    });

    // Update pricing section dynamically
    window.updatePricingSection(pkgKey);

    // Show toast with package name
    const names = { '3n4d': '3N/4D Quick Escape', '4n5d': '4N/5D Classic Journey', '6n7d': '6N/7D Grand Explorer' };
    showToast(`Viewing ${names[pkgKey] || pkgKey} itinerary & pricing`);

    // Smooth scroll to itinerary section
    const activeSection = document.querySelector(`.pkg-itinerary[data-pkg-section="${pkgKey}"]`);
    if (activeSection) {
      window.setTimeout(() => {
        activeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  /* ── SELECT PACKAGE FROM PRICING ── */
  window.selectPackage = (pkgName) => {
    const formPkg = document.getElementById('formPkg');
    if (formPkg) {
      for (let i = 0; i < formPkg.options.length; i++) {
        if (formPkg.options[i].text === pkgName || formPkg.options[i].text.startsWith(pkgName.split('·')[0].trim())) {
          formPkg.selectedIndex = i;
          break;
        }
      }
    }
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    showToast(`${pkgName} selected — fill in your details below`);
  };

  /* ── ENQUIRY FORM ── */
  window.submitEnquiry = () => {
    const name = document.getElementById('formName');
    const phone = document.getElementById('formPhone');
    const pkg = document.getElementById('formPkg');

    const cleanName = name ? name.value.trim() : '';
    const cleanPhone = phone ? phone.value.trim() : '';
    const cleanPkg = pkg ? pkg.value.trim() : '';

    if (!cleanName || !cleanPhone || !cleanPkg) {
      showToast('Please fill in your name, phone number, and package.');
      return;
    }

    showToast(`Thanks ${cleanName}! We'll contact you shortly about ${cleanPkg}.`);

    if (name) name.value = '';
    if (phone) phone.value = '';
    if (pkg) pkg.value = '';
  };

  /* ── GALLERY LIGHTBOX ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lbImg');
  const lightboxClose = document.getElementById('lbClose');
  const lightboxPrev = document.getElementById('lbPrev');
  const lightboxNext = document.getElementById('lbNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item[data-src]'));
  let activeGalleryIndex = 0;

  if (lightboxImg && (!lightboxImg.getAttribute('src') || lightboxImg.getAttribute('src') === '')) {
    lightboxImg.src = createFallbackDataUri('Preview');
  }

  const openLightbox = (index) => {
    const galleryItem = galleryItems[index];
    if (!lightbox || !lightboxImg || !galleryItem) return;
    activeGalleryIndex = index;
    lightboxImg.src = galleryItem.dataset.src || galleryItem.querySelector('img')?.src || '';
    lightboxImg.alt = galleryItem.querySelector('img')?.alt || '';
    lightbox.classList.add('open');
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('open');
  };

  const stepLightbox = (direction) => {
    if (!galleryItems.length) return;
    activeGalleryIndex = (activeGalleryIndex + direction + galleryItems.length) % galleryItems.length;
    openLightbox(activeGalleryIndex);
  };

  galleryItems.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => stepLightbox(1));
  if (lightbox) {
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener('keydown', (event) => {
    if (!lightbox || !lightbox.classList.contains('open')) return;
    if (event.key === 'Escape') closeLightbox();
    if (event.key === 'ArrowLeft') stepLightbox(-1);
    if (event.key === 'ArrowRight') stepLightbox(1);
  });

  /* ── TESTIMONIALS SLIDER ── */
  const testimonialTrack = document.getElementById('testiTrack');
  const testimonialPrev = document.getElementById('tcPrev');
  const testimonialNext = document.getElementById('tcNext');
  const testimonialDots = document.getElementById('tcDots');
  const testimonialCards = testimonialTrack ? Array.from(testimonialTrack.children) : [];
  let testimonialIndex = 0;

  const renderTestimonials = () => {
    if (!testimonialTrack || !testimonialCards.length) return;
    const offset = -testimonialIndex * 100;
    testimonialTrack.style.transform = `translateX(${offset}%)`;
    if (testimonialDots) {
      testimonialDots.innerHTML = '';
      testimonialCards.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = index === testimonialIndex ? 'tc-dot active' : 'tc-dot';
        dot.addEventListener('click', () => {
          testimonialIndex = index;
          renderTestimonials();
        });
        testimonialDots.appendChild(dot);
      });
    }
  };

  const stepTestimonials = (direction) => {
    if (!testimonialCards.length) return;
    testimonialIndex = (testimonialIndex + direction + testimonialCards.length) % testimonialCards.length;
    renderTestimonials();
  };

  if (testimonialPrev) testimonialPrev.addEventListener('click', () => stepTestimonials(-1));
  if (testimonialNext) testimonialNext.addEventListener('click', () => stepTestimonials(1));
  renderTestimonials();

  window.setInterval(() => stepTestimonials(1), 5000);
});

// Shared mobile menu package group switch (Domestic / International)
document.addEventListener('DOMContentLoaded', () => {
  const menuTabs = document.querySelectorAll('.mobile-menu-tab');
  const domesticGroup = document.getElementById('mobileDomestic');
  const internationalGroup = document.getElementById('mobileInternational');

  const setMenuGroup = (target) => {
    const showDomestic = target === 'domestic';
    if (domesticGroup) domesticGroup.classList.toggle('active', showDomestic);
    if (internationalGroup) internationalGroup.classList.toggle('active', !showDomestic);

    menuTabs.forEach((tab) => {
      const selected = tab.dataset.menuTarget === target;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
  };

  if (menuTabs.length && domesticGroup && internationalGroup) {
    menuTabs.forEach((tab) => {
      tab.addEventListener('click', () => setMenuGroup(tab.dataset.menuTarget));
    });
    setMenuGroup('domestic');
  }
});