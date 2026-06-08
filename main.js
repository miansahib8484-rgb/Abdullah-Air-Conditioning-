/* ═══════════════════════════════════════
   ABDULLAH AIR CONDITIONING — main.js
═══════════════════════════════════════ */

/* ── Navbar scroll shadow ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── Mobile drawer ── */
(function () {
  const burger  = document.getElementById('hamburger');
  const drawer  = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerClose');
  if (!burger || !drawer) return;

  function open() {
    drawer.classList.add('open');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    drawer.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => drawer.classList.contains('open') ? close() : open());
  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => e.key === 'Escape' && close());
})();

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const d = parseInt(e.target.dataset.delay) || 0;
    setTimeout(() => e.target.classList.add('in-view'), d);
    revealObs.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-animate]').forEach(el => revealObs.observe(el));

/* ── Count-up helper ── */
function countUp(el, target, suffix, decimal) {
  const steps = 60, dur = 2000;
  let cur = 0;
  const inc = target / steps;
  const t = setInterval(() => {
    cur = Math.min(cur + inc, target);
    el.textContent = (decimal ? cur.toFixed(decimal) : Math.floor(cur).toLocaleString()) + suffix;
    if (cur >= target) clearInterval(t);
  }, dur / steps);
}

/* ── Trust strip count-up ── */
const trustEl = document.querySelector('.trust-strip-inner');
if (trustEl) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    trustEl.querySelectorAll('.trust-item').forEach(item => {
      const el = item.querySelector('.count-up');
      if (el) countUp(el, parseFloat(item.dataset.count || 0), item.dataset.suffix || '', parseInt(item.dataset.decimal || 0));
    });
  }, { threshold: 0.4 }).observe(trustEl);
}

/* ── Stats count-up + bars ── */
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    statsGrid.querySelectorAll('.stat-num[data-count]').forEach(el => {
      countUp(el, parseFloat(el.dataset.count), el.dataset.suffix || '', parseInt(el.dataset.decimal || 0));
    });
    setTimeout(() => {
      statsGrid.querySelectorAll('.stat-bar-fill').forEach(b => b.classList.add('animated'));
    }, 300);
  }, { threshold: 0.2 }).observe(statsGrid);
}

/* ── FAQ accordion ── */
function toggleFaq(el) {
  const item = el.closest('.faq-item');
  const open = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!open) item.classList.add('open');
}

/* ── Blog filter ── */
function filterCat(el, cat) {
  document.querySelectorAll('.bcat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#blogGrid .blog-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}
const bsearch = document.getElementById('blogSearch');
if (bsearch) bsearch.addEventListener('input', function () {
  const q = this.value.toLowerCase();
  document.querySelectorAll('#blogGrid .blog-card').forEach(c => {
    c.style.display = c.textContent.toLowerCase().includes(q) ? '' : 'none';
  });
});

/* ── Contact form → WhatsApp ── */
function submitContactForm(e) {
  e.preventDefault();
  const f = e.target;
  const g = n => (f.querySelector(`[name="${n}"]`) || {}).value || '';
  const msg =
    `Hello Abdullah Air Conditioning!\n\n*New Service Booking*\n\n` +
    `Name: ${g('name')}\nPhone: ${g('phone')}\nService: ${g('service')}\n` +
    `Date: ${g('date') || 'Flexible'}\nTime: ${g('time')}\n` +
    `District: ${g('district')}\nAddress: ${g('address')}\nDetails: ${g('message') || 'N/A'}\n\nPlease confirm. Thank you!`;
  const url = `https://wa.me/966598938818?text=${encodeURIComponent(msg)}`;
  const btn = document.getElementById('waSubmitBtn');
  if (btn) btn.href = url;
  window.open(url, '_blank');
  const box = document.getElementById('success-box');
  if (box) { box.style.display = 'block'; setTimeout(() => (box.style.display = 'none'), 7000); }
}

/* ── Hero parallax ── */
const heroBg = document.querySelector('.hero-bg-img img');
if (heroBg) {
  window.addEventListener('scroll', () => {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }, { passive: true });
}

/* ── Float WA hide near footer ── */
const floatWa = document.querySelector('.float-wa');
const footerEl = document.querySelector('footer');
if (floatWa && footerEl) {
  new IntersectionObserver(([e]) => {
    floatWa.style.opacity = e.isIntersecting ? '0' : '1';
    floatWa.style.pointerEvents = e.isIntersecting ? 'none' : 'auto';
  }).observe(footerEl);
}

/* ── Mark active nav link ── */
const pg = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link, .drawer-link').forEach(a => {
  const h = a.getAttribute('href') || '';
  if (h === pg || (pg === '' && h === 'index.html') || (pg === 'index.html' && h === 'index.html'))
    a.classList.add('active');
  else a.classList.remove('active');
});