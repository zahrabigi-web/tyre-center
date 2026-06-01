// Tyre Center — Professional Script

// ── 1. Mobile nav ──────────────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const siteNav   = document.querySelector('.site-nav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.classList.toggle('is-open', open);
  });
  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
    });
  });
  document.addEventListener('click', e => {
    if (!navToggle.contains(e.target) && !siteNav.contains(e.target)) {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('is-open');
    }
  });
}

// ── 2. Header scroll shadow ────────────────────────────────────────────────
const header = document.querySelector('.site-header');
if (header) {
  const tick = () => header.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

// ── 3. Footer year ─────────────────────────────────────────────────────────
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// ── 4. Scroll-reveal ───────────────────────────────────────────────────────
const revealSelectors = [
  '.feature-card', '.quote-card', '.service-card',
  '.brand-card', '.vehicle-card', '.stat-card',
  '.section-heading', '.split-layout > *', '.contact-panel',
  '.form-panel', '.hero-card', '.info-panel',
  '.page-hero .eyebrow', '.page-hero h1',
  '.page-hero h2', '.page-hero p',
  '.steps-list li', '.tag-row',
];

revealSelectors.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
  });
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach((el, _, list) => {
  // Stagger siblings in the same parent
  const siblings = Array.from(el.parentElement.querySelectorAll('[data-reveal]'));
  const idx = siblings.indexOf(el);
  el.style.transitionDelay = `${idx * 75}ms`;
  revealObserver.observe(el);
});

// ── 5. Hero parallax ───────────────────────────────────────────────────────
const heroMedia = document.querySelector('.hero-media');
if (heroMedia) {
  window.addEventListener('scroll', () => {
    heroMedia.style.transform = `translateY(${window.scrollY * 0.22}px)`;
  }, { passive: true });
}

// ── 6. Stat counter animation ──────────────────────────────────────────────
function runCounter(el) {
  const raw = el.textContent.trim();
  // Skip anything with a slash (e.g. "24/7") — can't animate fractions
  if (raw.includes('/')) return;
  const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num > 9999) return;
  const suffix = raw.replace(/[0-9.]/g, '');
  const duration = 1100;
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * num) + suffix;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const h3 = entry.target.querySelector('h3');
      if (h3) runCounter(h3);
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-card').forEach(c => counterObs.observe(c));

// ── 7. Booking form ────────────────────────────────────────────────────────
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  const btn = bookingForm.querySelector('button[type="submit"]');
  bookingForm.addEventListener('submit', async e => {
    e.preventDefault();
    const orig = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    btn.style.opacity = '.7';
    await new Promise(r => setTimeout(r, 1200));
    btn.textContent = '✓ Request sent!';
    btn.style.background = '#16a34a';
    btn.style.opacity = '1';
    setTimeout(() => {
      bookingForm.reset();
      btn.textContent = orig;
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  });
}

// ── 8. Smooth scroll for anchor links ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
