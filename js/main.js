// ============================================
// Portfolio — main.js
// ============================================

// ---------- Loader ----------
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('hidden'), 350);
});

// ---------- Theme toggle ----------
(function () {
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    const icon = btn.querySelector('i');
    if (icon) icon.className = next === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  });
  const icon = document.querySelector('[data-theme-toggle] i');
  if (icon && root.getAttribute('data-theme') === 'dark') icon.className = 'fa-solid fa-sun';
})();

// ---------- Mobile nav ----------
document.addEventListener('click', (e) => {
  const burger = e.target.closest('.burger');
  if (burger) document.querySelector('.nav-links')?.classList.toggle('open');
  if (e.target.closest('.nav-links a')) document.querySelector('.nav-links')?.classList.remove('open');
});

// ---------- Sticky nav shadow ----------
const nav = document.querySelector('.nav');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 12);
  if (toTop) toTop.classList.toggle('show', window.scrollY > 400);
});
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Active nav link ----------
(function () {
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });
})();

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Typing effect ----------
(function () {
  const el = document.querySelector('[data-typed]');
  if (!el) return;
  const words = JSON.parse(el.dataset.typed);
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const w = words[wi];
    el.textContent = w.slice(0, ci);
    if (!deleting && ci < w.length) ci++;
    else if (deleting && ci > 0) ci--;
    else { deleting = !deleting; if (!deleting) wi = (wi + 1) % words.length; setTimeout(tick, 900); return; }
    setTimeout(tick, deleting ? 40 : 75);
  }
  tick();
})();

// ---------- Counters ----------
const counterIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target;
    const target = +el.dataset.count;
    const dur = 1400; const start = performance.now();
    function step(t) {
      const p = Math.min((t - start) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
    counterIO.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

// ---------- Skill bars ----------
const barIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.querySelectorAll('.bar > i').forEach(b => { b.style.width = b.dataset.w + '%'; });
    barIO.unobserve(en.target);
  });
}, { threshold: 0.25 });
document.querySelectorAll('[data-skills]').forEach(el => barIO.observe(el));

// ---------- Project filter + search ----------
(function () {
  const grid = document.querySelector('.projects-grid');
  if (!grid) return;
  const cards = [...grid.querySelectorAll('.project')];
  const buttons = document.querySelectorAll('.filter-bar button');
  const search = document.getElementById('projSearch');
  let cat = 'all';
  function apply() {
    const q = (search?.value || '').toLowerCase().trim();
    cards.forEach(c => {
      const okC = cat === 'all' || c.dataset.cat === cat;
      const okS = !q || c.textContent.toLowerCase().includes(q);
      c.style.display = (okC && okS) ? '' : 'none';
    });
  }
  buttons.forEach(b => b.addEventListener('click', () => {
    buttons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    cat = b.dataset.filter;
    apply();
  }));
  search?.addEventListener('input', apply);
})();

// ---------- Contact form ----------
document.querySelector('.contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fa-solid fa-check"></i> Message sent';
  btn.disabled = true;
  e.target.reset();
  setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2800);
});

// ---------- Resume download stub ----------
document.querySelector('[data-download-cv]')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.print();
});
