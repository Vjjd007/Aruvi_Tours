// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Close menu on link click (mobile)
document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('open');
  });
});

// Mobile dropdown toggle
const hasDropdown = document.querySelector('.has-dropdown');
if (hasDropdown) {
  const toggle = hasDropdown.querySelector('.dropdown-toggle');
  toggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      hasDropdown.classList.toggle('open');
    }
  });
}

// ===========================
// HERO SLIDER
// ===========================
const heroSlides = document.querySelectorAll('.hero-slide');
const heroDotsCont = document.getElementById('heroDots');
let currentSlide = 0;
let heroTimer;

// Create dots
heroSlides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('hero-dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(i));
  heroDotsCont.appendChild(dot);
});

function goToSlide(index) {
  heroSlides[currentSlide].classList.remove('active');
  document.querySelectorAll('.hero-dot')[currentSlide].classList.remove('active');
  currentSlide = index;
  heroSlides[currentSlide].classList.add('active');
  document.querySelectorAll('.hero-dot')[currentSlide].classList.add('active');
}

function nextSlide() {
  const next = (currentSlide + 1) % heroSlides.length;
  goToSlide(next);
}

heroTimer = setInterval(nextSlide, 5000);

// ===========================
// ACCORDION TOGGLE
// ===========================
function toggleAccordion(id) {
  const acc = document.getElementById(id);
  const btn = acc.previousElementSibling.querySelector('.pkg-toggle') ||
              acc.closest('.pkg-card').querySelector('.pkg-toggle');
  acc.classList.toggle('open');
  btn.classList.toggle('open');
}

// ===========================
// CAROUSEL
// ===========================
function initCarousel(trackId, prevId, nextId, slideWidth, autoPlay) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  // slides will be queried dynamically to support filtering
  function allSlides() { return track.querySelectorAll('.pkg-slide'); }
  function visibleSlides() { return Array.from(allSlides()).filter(s => !s.classList.contains('filtered-hidden')); }
  let currentIndex = 0;
  let autoTimer;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  }

  function getSlideWidth() {
    const visible = getVisibleCount();
    const container = track.parentElement;
    const gap = 20;
    return (container.offsetWidth - gap * (visible - 1)) / visible;
  }

  function updateSlideWidths() {
    const w = getSlideWidth();
    allSlides().forEach(s => { s.style.minWidth = w + 'px'; });
  }

  function getMaxIndex() {
    return Math.max(0, visibleSlides().length - getVisibleCount());
  }

  function updateTrack(animate = true) {
    const w = getSlideWidth();
    const gap = 20;
    // limit currentIndex
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    if (currentIndex < 0) currentIndex = 0;
    const offset = -(currentIndex * (w + gap));
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = `translateX(${offset}px)`;
  }

  function goNext() {
    if (currentIndex >= getMaxIndex()) currentIndex = 0; else currentIndex++;
    updateTrack();
  }

  function goPrev() {
    if (currentIndex <= 0) currentIndex = getMaxIndex(); else currentIndex--;
    updateTrack();
  }

  nextBtn.addEventListener('click', () => { goNext(); resetAuto(); });
  prevBtn.addEventListener('click', () => { goPrev(); resetAuto(); });

  function startAuto() {
    if (!autoPlay) return;
    autoTimer = setInterval(goNext, 3000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  // Pause on hover
  if (autoPlay) {
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.parentElement.addEventListener('mouseleave', startAuto);
  }

  window.addEventListener('resize', () => {
    updateSlideWidths();
    if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
    updateTrack(false);
  });

  updateSlideWidths();
  updateTrack(false);
  startAuto();

  // expose a refresh function so filtering outside can trigger recalculation
  window.carousels = window.carousels || {};
  window.carousels[trackId] = {
    refresh: () => {
      // when filter changes, reset index and recompute sizes
      currentIndex = 0;
      updateSlideWidths();
      if (currentIndex > getMaxIndex()) currentIndex = getMaxIndex();
      updateTrack(false);
      resetAuto();
    }
  };
}

// Static grid initializer for fixed 4-column display (no sliding)
function initStaticGrid(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  if (!track) return;
  if (prevBtn) prevBtn.style.display = 'none';
  if (nextBtn) nextBtn.style.display = 'none';

  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 480) return 1;
    if (w <= 768) return 2;
    if (w <= 1024) return 3;
    return 4;
  }

  function updateGrid() {
    const visible = getVisibleCount();
    track.style.display = 'grid';
    track.style.gridTemplateColumns = `repeat(${visible}, 1fr)`;
    track.style.gap = '20px';
  }

  function refresh() {
    updateGrid();
  }

  window.carousels = window.carousels || {};
  window.carousels[trackId] = { refresh };

  window.addEventListener('resize', updateGrid);
  updateGrid();
}

// Initialize package displays and behaviors
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousels to show 4 slides and auto-slide one-by-one
  initCarousel('domTrack', 'domPrev', 'domNext', 260, true);
  initCarousel('intTrack', 'intPrev', 'intNext', 260, true);
  initTestimonials();
  initCounters();

  // per-section filtering
  function filterTrack(trackId, query) {
    const q = String(query || '').trim().toLowerCase();
    const track = document.getElementById(trackId);
    if (!track) return;
    track.querySelectorAll('.pkg-slide').forEach(s => {
      const titleEl = s.querySelector('.slide-info h4');
      const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';
      if (q === '') s.classList.remove('filtered-hidden'); else title.includes(q) ? s.classList.remove('filtered-hidden') : s.classList.add('filtered-hidden');
    });
    if (window.carousels && window.carousels[trackId]) window.carousels[trackId].refresh();
  }

  const domSearch = document.getElementById('domSearch');
  const domClear = document.getElementById('domClear');
  if (domSearch) {
    domSearch.addEventListener('input', (e) => filterTrack('domTrack', e.target.value));
    if (domClear) domClear.addEventListener('click', () => { domSearch.value = ''; filterTrack('domTrack', ''); });
  }

  const intSearch = document.getElementById('intSearch');
  const intClear = document.getElementById('intClear');
  if (intSearch) {
    intSearch.addEventListener('input', (e) => filterTrack('intTrack', e.target.value));
    if (intClear) intClear.addEventListener('click', () => { intSearch.value = ''; filterTrack('intTrack', ''); });
  }
});

// ===========================
// TESTIMONIALS SLIDER
// ===========================
function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  const dotsCont = document.getElementById('testiDots');
  const cards = track.querySelectorAll('.testi-card');
  const total = cards.length;
  let current = 0;
  let timer;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('testi-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsCont.appendChild(dot);
  });

  function goTo(index) {
    document.querySelectorAll('.testi-dot')[current].classList.remove('active');
    current = index;
    document.querySelectorAll('.testi-dot')[current].classList.add('active');
    track.style.transform = `translateX(calc(-${current * 100}% - ${current * 24}px))`;
  }

  function goNext() { goTo((current + 1) % total); }
  function goPrev() { goTo((current - 1 + total) % total); }

  nextBtn.addEventListener('click', () => { goNext(); resetTimer(); });
  prevBtn.addEventListener('click', () => { goPrev(); resetTimer(); });

  function startTimer() { timer = setInterval(goNext, 4500); }
  function resetTimer() { clearInterval(timer); startTimer(); }

  startTimer();
}

// ===========================
// STATS COUNTER
// ===========================
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = Math.floor(current).toLocaleString();
        }, 16);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ===========================
// BOOKING MODAL
// ===========================
function openBookingModal() {
  document.getElementById('bookingModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBookingModal(e) {
  if (!e || e.target === document.getElementById('bookingModal')) {
    document.getElementById('bookingModal').classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeBookingModal();
});

// ===========================
// SMOOTH SCROLL NAV LINKS
// ===========================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    if (href === '#booking') { e.preventDefault(); openBookingModal(); return; }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===========================
// FADE IN ON SCROLL
// ===========================
const fadeElements = document.querySelectorAll('.why-card, .pkg-card, .stat-item');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, (Array.from(fadeElements).indexOf(entry.target) % 3) * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// ===========================
// ACTIVE NAV LINK ON SCROLL
// ===========================
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));
        link.classList.add('active-link');
      }
    }
  });
});