
/* Navbar behavior */
const navbar = document.getElementById('navbar') || document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuTabs = document.querySelectorAll('.mobile-menu-tab');
const mobileDomestic = document.getElementById('mobileDomestic');
const mobileInternational = document.getElementById('mobileInternational');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('active');

    if (mobileMenu) {
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      return;
    }

    if (navMenu) {
      navMenu.classList.toggle('open', isOpen);
    }
  });
}

document.querySelectorAll('.mm-link, #mobileMenu a').forEach((link) => {
  link.addEventListener('click', () => {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (navMenu) navMenu.classList.remove('open');
  });
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (navMenu) navMenu.classList.remove('open');
  }
});

function setMobileMenuGroup(target) {
  const showDomestic = target === 'domestic';
  if (mobileDomestic) mobileDomestic.classList.toggle('active', showDomestic);
  if (mobileInternational) mobileInternational.classList.toggle('active', !showDomestic);

  mobileMenuTabs.forEach((tab) => {
    const selected = tab.dataset.menuTarget === target;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
}

if (mobileMenuTabs.length && mobileDomestic && mobileInternational) {
  mobileMenuTabs.forEach((tab) => {
    tab.addEventListener('click', () => setMobileMenuGroup(tab.dataset.menuTarget));
  });
  setMobileMenuGroup('domestic');
}

/* Intersection Observer — scroll reveal */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));