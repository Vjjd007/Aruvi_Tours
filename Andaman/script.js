/* ============================================================
   ARUVI TOURS — script.js
   All interactions, animations, switching logic
   ============================================================ */

'use strict';

// ===== PRELOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('preloader');
    if (loader) loader.classList.add('done');
  }, 1800);
});

// ===== ITINERARY STATE =====
let activeItineraryDays = 3;

function selectItineraryDays(days) {
  activeItineraryDays = days;

  document.querySelectorAll('.itinerary-tab').forEach(tab => {
    const isActive = Number(tab.dataset.days) === days;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  document.querySelectorAll('.itinerary-list').forEach(list => {
    list.classList.toggle('active', Number(list.dataset.days) === days);
  });

  updateItinerarySlider(days);
}

function updateItinerarySlider(days) {
  const tabs = Array.from(document.querySelectorAll('.itinerary-tab'));
  const slider = document.getElementById('itinerarySlider');
  const bar = document.querySelector('.itinerary-switch-inner');
  const activeTab = tabs.find(tab => Number(tab.dataset.days) === days);

  if (!activeTab || !slider || !bar) return;

  const barRect = bar.getBoundingClientRect();
  const tabRect = activeTab.getBoundingClientRect();
  slider.style.left = `${tabRect.left - barRect.left}px`;
  slider.style.width = `${tabRect.width}px`;
}

function jumpToItinerary(days) {
  selectItineraryDays(days);
  scrollToSection('itinerary');
}

document.addEventListener('DOMContentLoaded', () => {
  selectItineraryDays(3);
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar') || document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (navbar && window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else if (navbar) {
    navbar.classList.remove('scrolled');
  }

  // Show scroll-to-top
  const btn = document.getElementById('scrollTop');
  btn.classList.toggle('visible', window.scrollY > 400);
});

// ===== MOBILE MENU =====
const navBurger = document.getElementById('navBurger') || document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

if (navBurger && mobileMenu) {
navBurger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
  navBurger.querySelectorAll('span').forEach((s, i) => {
    s.style.transform = menuOpen
      ? i === 0 ? 'translateY(6.5px) rotate(45deg)'
      : i === 1 ? 'scaleX(0)'
      : 'translateY(-6.5px) rotate(-45deg)'
      : '';
  });
});
}

function closeMobile() {
  if (!navBurger || !mobileMenu) return;
  menuOpen = false;
  mobileMenu.classList.remove('open');
  navBurger.querySelectorAll('span').forEach(s => s.style.transform = '');
}

// ===== HERO PANEL hover (desktop) =====
const heroSplit = document.getElementById('heroSplit');
if (heroSplit) {
  // Initialize slider behavior: autoplay, controls, swipe
  const panels = Array.from(heroSplit.querySelectorAll('.hero-panel'));
  let heroIndex = 0;
  let heroTimer = null;
  const heroDotsContainer = document.getElementById('heroDots');

  function buildHeroDots() {
    if (!heroDotsContainer) return;
    heroDotsContainer.innerHTML = '';
    panels.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => showHero(i));
      heroDotsContainer.appendChild(d);
    });
  }

  function updateHeroClasses() {
    panels.forEach((p, i) => {
      p.classList.toggle('inactive', i !== heroIndex);
    });
  }

  function showHero(idx, noReset) {
    heroIndex = (idx + panels.length) % panels.length;
    const offset = -heroIndex * heroSplit.clientWidth;
    heroSplit.style.transform = `translateX(${offset}px)`;
    // update dots
    heroDotsContainer?.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === heroIndex));
    updateHeroClasses();
    if (!noReset) resetHeroAuto();
  }

  function heroNext() { showHero(heroIndex + 1); }
  function heroPrev() { showHero(heroIndex - 1); }

  function startHeroAuto() {
    heroTimer = setInterval(() => showHero(heroIndex + 1, true), 6000);
  }

  function resetHeroAuto() {
    clearInterval(heroTimer);
    startHeroAuto();
  }

  // expose controls to global scope for HTML onclick
  window.heroNext = heroNext;
  window.heroPrev = heroPrev;

  // Touch/swipe support
  let touchStartX = 0;
  heroSplit.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroSplit.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? heroNext() : heroPrev();
  });

  // Build and start
  buildHeroDots();
  showHero(0, true);
  startHeroAuto();
}

// ===== ITINERARY ACCORDION =====
function toggleItinerary(card) {
  const isOpen = card.classList.contains('open');
  // Close all in same list
  const parentList = card.closest('.itinerary-list');
  parentList.querySelectorAll('.itin-card.open').forEach(c => c.classList.remove('open'));
  if (!isOpen) card.classList.add('open');
}

// ===== GALLERY LIGHTBOX =====
let lbImages = [];
let lbIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // Attach click to all gallery items
  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      const grid = item.closest('.gallery-grid');
      const items = Array.from(grid.querySelectorAll('.gallery-item'));
      lbImages = items.map(it => ({
        src: it.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1'),
        cap: it.querySelector('.gallery-overlay span')?.textContent || ''
      }));
      lbIndex = items.indexOf(item);
      openLightbox();
    });
  });
});

function openLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  updateLbImage();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLbImage() {
  const img = document.getElementById('lbImg');
  const cap = document.getElementById('lbCaption');
  if (lbImages[lbIndex]) {
    img.src = lbImages[lbIndex].src;
    cap.textContent = lbImages[lbIndex].cap;
  }
}

function lbPrev() {
  lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length;
  updateLbImage();
}

function lbNext() {
  lbIndex = (lbIndex + 1) % lbImages.length;
  updateLbImage();
}

// Keyboard nav for lightbox
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') lbPrev();
  if (e.key === 'ArrowRight') lbNext();
  if (e.key === 'Escape') closeLightbox();
});

// Click outside to close
document.getElementById('lightbox')?.addEventListener('click', function(e) {
  if (e.target === this) closeLightbox();
});

// ===== TESTIMONIAL CAROUSEL =====
let testiIndex = 0;
let testiTotal = 0;
let testiPerView = 3;
let testiAutoTimer;

function getTestiPerView() {
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
}

function initTestimonials() {
  const track = document.getElementById('testiTrack');
  const dotsContainer = document.getElementById('testiDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  testiTotal = cards.length;
  testiPerView = getTestiPerView();
  testiIndex = 0;

  // Build dots
  dotsContainer.innerHTML = '';
  const numDots = Math.ceil(testiTotal / testiPerView);
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('div');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTesti(i * testiPerView));
    dotsContainer.appendChild(dot);
  }

  updateTesti();
  startTestiAuto();
}

function updateTesti() {
  const track = document.getElementById('testiTrack');
  const cards = track.querySelectorAll('.testi-card');
  testiPerView = getTestiPerView();
  const cardWidth = cards[0].offsetWidth + 32; // gap = 2rem = 32px
  track.style.transform = `translateX(-${testiIndex * cardWidth}px)`;

  // Update dots
  const dots = document.querySelectorAll('.testi-dot');
  const activeDot = Math.floor(testiIndex / testiPerView);
  dots.forEach((d, i) => d.classList.toggle('active', i === activeDot));
}

function goTesti(idx) {
  const track = document.getElementById('testiTrack');
  testiTotal = track.querySelectorAll('.testi-card').length;
  testiPerView = getTestiPerView();
  const maxIdx = Math.max(0, testiTotal - testiPerView);
  testiIndex = Math.max(0, Math.min(idx, maxIdx));
  updateTesti();
  resetTestiAuto();
}

function testiNext() {
  testiPerView = getTestiPerView();
  const track = document.getElementById('testiTrack');
  testiTotal = track.querySelectorAll('.testi-card').length;
  const maxIdx = Math.max(0, testiTotal - testiPerView);
  testiIndex = testiIndex >= maxIdx ? 0 : testiIndex + 1;
  updateTesti();
  resetTestiAuto();
}

function testiPrev() {
  testiPerView = getTestiPerView();
  const track = document.getElementById('testiTrack');
  testiTotal = track.querySelectorAll('.testi-card').length;
  const maxIdx = Math.max(0, testiTotal - testiPerView);
  testiIndex = testiIndex <= 0 ? maxIdx : testiIndex - 1;
  updateTesti();
  resetTestiAuto();
}

function startTestiAuto() {
  testiAutoTimer = setInterval(testiNext, 5000);
}

function resetTestiAuto() {
  clearInterval(testiAutoTimer);
  startTestiAuto();
}

// Touch/swipe for testimonials
let touchStartX = 0;
document.getElementById('testiTrack')?.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('testiTrack')?.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? testiNext() : testiPrev();
});

window.addEventListener('resize', () => {
  initTestimonials();
  updateItinerarySlider(activeItineraryDays);
});

document.addEventListener('DOMContentLoaded', initTestimonials);

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});

// ===== SMOOTH SCROLL HELPER =====
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const offset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

// ===== PARALLAX (subtle, CSS-based fallback) =====
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (hero) {
    const panels = hero.querySelectorAll('.hero-panel');
    const scrolled = window.scrollY;
    panels.forEach(p => {
      p.style.backgroundPositionY = `calc(50% + ${scrolled * 0.25}px)`;
    });
  }
}, { passive: true });

// ===== CURSOR GLOW (desktop only) =====
if (window.innerWidth > 768) {
  const glow = document.createElement('div');
  glow.id = 'cursorGlow';
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });

  document.addEventListener('mouseleave', () => glow.style.opacity = '0');
  document.addEventListener('mouseenter', () => glow.style.opacity = '1');
}

// ===== SECTION ACTIVE HIGHLIGHT ON SCROLL =====
const sections = ['packages', 'gallery', 'itinerary', 'comparison', 'pricing', 'testimonials'];
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });
});

// ===== GOLD SHIMMER on Price Cards =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.price-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,168,76,0.1) 0%, rgba(255,255,255,0.03) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
});

// ===== INCLUSION CARD GLOW =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.inclusion-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(201,168,76,0.12) 0%, rgba(255,255,255,0.03) 70%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
});

