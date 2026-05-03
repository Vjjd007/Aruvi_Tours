document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const heroImg = document.getElementById('heroImg');
  const toast = document.getElementById('toast');
  const revealItems = document.querySelectorAll('.reveal-up, .reveal-scale');

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

    document.querySelectorAll('a, button, input, select, .gallery-item, .tl-card').forEach((element) => {
      element.addEventListener('mouseenter', () => ring.classList.add('hover'));
      element.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });

    updatePosition();
  };

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
      if (img.dataset.fallbackApplied === 'true') {
        return;
      }

      img.dataset.fallbackApplied = 'true';
      img.src = createFallbackDataUri(img.alt || 'Travel image');
    };

    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('error', () => {
        replaceBrokenImage(img);
      });

      if (img.complete && img.naturalWidth === 0) {
        replaceBrokenImage(img);
      }
    });

    window.setTimeout(() => {
      document.querySelectorAll('img').forEach((img) => {
        if (img.complete && img.naturalWidth === 0) {
          replaceBrokenImage(img);
        }
      });
    }, 1000);
  };

  createCursorLayer();
  wireImageFallbacks();

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.hideTimer);
    showToast.hideTimer = window.setTimeout(() => {
      toast.classList.remove('show');
    }, 2600);
  };

  const hidePreloader = () => {
    if (!preloader) return;
    preloader.classList.add('done');
    window.setTimeout(() => {
      preloader.remove();
    }, 700);
  };

  window.setTimeout(hidePreloader, 1200);
  window.addEventListener('load', hidePreloader);

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }

    if (heroImg) {
      heroImg.classList.toggle('zoomed', window.scrollY > 30);
    }
  }, { passive: true });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach((item) => revealObserver.observe(item));

  window.toggleDay = (card) => {
    const item = card.closest('.tl-item');
    if (!item) return;
    item.classList.toggle('open');
  };

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

    showToast(`Thanks ${cleanName}. We will contact you shortly about ${cleanPkg}.`);

    if (name) name.value = '';
    if (phone) phone.value = '';
    if (pkg) pkg.value = '';
  };

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

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

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
        dot.className = index === testimonialIndex ? 'dot active' : 'dot';
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
});
