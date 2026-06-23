/* =========================================================
   Abdullah Air Conditioning — main.js
   Updated: 2025 | All rights reserved
   ========================================================= */

'use strict';

/* ── Navbar scroll shadow ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile Drawer ── */
const hamburger  = document.getElementById('hamburger');
const drawer     = document.getElementById('mobileDrawer');
const backdrop   = document.getElementById('drawerBackdrop');
const closeBtn   = document.getElementById('drawerClose');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
  hamburger && hamburger.setAttribute('aria-expanded', 'true');
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  document.body.style.overflow = '';
  hamburger && hamburger.setAttribute('aria-expanded', 'false');
}

hamburger  && hamburger.addEventListener('click', openDrawer);
closeBtn   && closeBtn.addEventListener('click', closeDrawer);
backdrop   && backdrop.addEventListener('click', closeDrawer);

/* Keyboard support */
[hamburger, closeBtn].forEach(el => {
  el && el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeDrawer();
});

/* ── Intersection Observer: Animate on scroll ── */
const animEls = document.querySelectorAll('[data-animate]');
if (animEls.length && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0, 10);
        setTimeout(() => el.classList.add('animated'), delay);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => io.observe(el));
}

/* ── Count-up animation ── */
function animateCount(el, target, suffix, decimals) {
  const duration = 1800;
  const start = performance.now();
  const isFloat = decimals > 0;

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = isFloat ? (target * ease).toFixed(decimals) : Math.floor(target * ease);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = (isFloat ? target.toFixed(decimals) : target) + suffix;
  }
  requestAnimationFrame(update);
}

function initCounters(parent) {
  (parent || document).querySelectorAll('[data-count]').forEach(el => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimal || 0, 10);
    animateCount(el, target, suffix, decimals);
  });
}

/* Trigger counters when trust strip / stats enter viewport */
const counterSections = document.querySelectorAll('.trust-strip, .stats-section');
if (counterSections.length && 'IntersectionObserver' in window) {
  const co = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initCounters(entry.target);
        co.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counterSections.forEach(s => co.observe(s));
}

/* ── Stat bar animation ── */
const statBars = document.querySelectorAll('.stat-bar-fill');
if (statBars.length && 'IntersectionObserver' in window) {
  const bo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = 'var(--w)';
        bo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statBars.forEach(b => bo.observe(b));
}

/* ── FAQ accordion ── */
window.toggleFaq = function(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-a');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = item.classList.contains('open');

  /* Close all open items */
  document.querySelectorAll('.faq-item.open').forEach(openItem => {
    openItem.classList.remove('open');
    const a = openItem.querySelector('.faq-a');
    const ic = openItem.querySelector('.faq-icon');
    if (a) a.style.maxHeight = '0';
    if (ic) ic.textContent = '+';
    openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
  });

  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    icon.textContent = '−';
    btn.setAttribute('aria-expanded', 'true');
  }
};

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Newsletter subscribe (placeholder) ── */
document.querySelectorAll('.nl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.nl-row, .nl-section')?.querySelector('.nl-input');
    if (!input) return;
    const email = input.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.style.borderColor = '#E85D04';
      input.placeholder = 'أدخل بريداً إلكترونياً صحيحاً';
      return;
    }
    input.style.borderColor = '#00C2B5';
    input.value = '';
    btn.textContent = '✅ تم!';
    setTimeout(() => { btn.textContent = 'اشترك'; }, 3000);
  });
});

/* ── Active nav link highlight ── */
(function setActiveLink() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-link, .drawer-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
})();

/* ── Simple performance: preload WhatsApp link on hover ── */
const waLinks = document.querySelectorAll('a[href^="https://wa.me"]');
waLinks.forEach(link => {
  link.addEventListener('mouseover', () => {
    const rel = link.rel || '';
    if (!rel.includes('prefetch')) {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = link.href;
      document.head.appendChild(prefetch);
    }
  }, { once: true });
});
