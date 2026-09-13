/* CHLOE Peluquería y Estética Unisex — front-end logic
   Renders CMS-managed content (content/*.json), tabs, portfolio filter,
   mobile menu, scroll reveal. Degrades gracefully if fetch fails. */

(function () {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  async function loadJSON(path) {
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (e) {
      console.warn('No se pudo cargar', path, e);
      return null;
    }
  }

  function initialsFallback(name) {
    const t = (name || '?').trim().charAt(0).toUpperCase();
    const el = document.createElement('div');
    el.className = 'img-fallback';
    el.textContent = t;
    return el;
  }

  /* Image with graceful fallback */
  function imageEl(src, alt, name) {
    const wrap = document.createElement('div');
    wrap.style.width = '100%';
    wrap.style.height = '100%';
    if (!src) { wrap.appendChild(initialsFallback(name || alt)); return wrap; }
    const img = new Image();
    img.src = src;
    img.alt = alt || '';
    img.loading = 'lazy';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onerror = () => { wrap.innerHTML = ''; wrap.appendChild(initialsFallback(name || alt)); };
    wrap.appendChild(img);
    return wrap;
  }

  /* ---------- header + nav ---------- */
  function initHeader() {
    const header = $('#site-header');
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const toggle = $('#menu-toggle');
    const menu = $('#mobile-menu');
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('hidden') === false;
        toggle.setAttribute('aria-expanded', String(open));
      });
      $$('#mobile-menu a').forEach((a) =>
        a.addEventListener('click', () => menu.classList.add('hidden'))
      );
    }
    const y = $('#year');
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- settings (hero, hours, phone, links) ---------- */
  async function initSettings() {
    const s = await loadJSON('/content/settings.json');
    if (!s) return;

    if (s.hero_image) {
      const bg = $('.hero-bg');
      if (bg) { bg.style.setProperty('--hero-image', `url("${s.hero_image}")`); bg.classList.add('has-image'); }
    }

    // Hours
    const hoursList = $('#hours-list');
    if (hoursList && Array.isArray(s.hours)) {
      hoursList.innerHTML = s.hours.map((h) =>
        `<div class="flex justify-between gap-4"><span>${esc(h.day)}</span><span class="text-ink">${esc(h.time)}</span></div>`
      ).join('');
    }

    // Phone (only if provided)
    const phoneBox = $('#contact-phone');
    if (phoneBox && s.phone) {
      const tel = String(s.phone).replace(/\s+/g, '');
      phoneBox.innerHTML = `<a href="tel:${esc(tel)}" class="text-gold hover:underline">${esc(s.phone_label || 'Teléfono')}: ${esc(s.phone)}</a>`;
      const heroPhone = $('#hero-phone');
      if (heroPhone) { heroPhone.href = `tel:${esc(tel)}`; heroPhone.textContent = 'Llamar ahora'; }
    }

    // External links (in case they change in CMS)
    if (s.booksy_url) $$('a[href*="booksy.com"]').forEach((a) => (a.href = s.booksy_url));
    if (s.instagram_url) $$('a[href*="instagram.com"]').forEach((a) => (a.href = s.instagram_url));
  }

  /* ---------- services (tabs) ---------- */
  async function initServices() {
    const data = await loadJSON('/content/services.json');
    const tabsEl = $('#service-tabs');
    const panelsEl = $('#service-panels');
    const introEl = $('#services-intro');
    if (!data || !tabsEl || !panelsEl) return;

    if (introEl && data.intro) introEl.textContent = data.intro;
    const cats = data.categories || [];

    tabsEl.innerHTML = cats.map((c, i) =>
      `<button class="tab-btn ${i === 0 ? 'active' : ''}" role="tab" data-target="${esc(c.id)}" aria-selected="${i === 0}">${esc(c.name)}</button>`
    ).join('');

    panelsEl.innerHTML = cats.map((c, i) => {
      const cards = (c.items || []).map((it) => `
        <article class="relative bg-white/70 border ${it.featured ? 'border-gold' : 'border-sand'} rounded-2xl p-6 flex flex-col justify-between transition-shadow hover:shadow-md">
          ${it.featured ? '<span class="absolute -top-3 left-6 bg-gold text-cream text-[0.65rem] uppercase tracking-widest px-3 py-1 rounded-full">Destacado</span>' : ''}
          <div>
            <h3 class="font-display text-xl text-ink">${esc(it.name)}</h3>
            <p class="mt-2 text-mocha text-sm leading-relaxed">${esc(it.description || '')}</p>
          </div>
          <p class="mt-5 font-display text-2xl text-gold">${esc(it.price || '')}</p>
        </article>`).join('');
      return `
        <div class="service-panel ${i === 0 ? '' : 'hidden'}" data-panel="${esc(c.id)}">
          ${c.description ? `<p class="text-center text-mocha font-serif text-lg mb-8">${esc(c.description)}</p>` : ''}
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
        </div>`;
    }).join('');

    tabsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      $$('.tab-btn', tabsEl).forEach((b) => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      const target = btn.dataset.target;
      $$('.service-panel', panelsEl).forEach((p) => p.classList.toggle('hidden', p.dataset.panel !== target));
    });
  }

  /* ---------- portfolio (filter) ---------- */
  async function initPortfolio() {
    const data = await loadJSON('/content/portfolio.json');
    const grid = $('#portfolio-grid');
    const filters = $('#portfolio-filters');
    if (!data || !grid) return;
    const items = data.items || [];
    const cats = ['Todos', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];

    if (filters) {
      filters.innerHTML = cats.map((c, i) =>
        `<button class="filter-btn ${i === 0 ? 'active' : ''}" data-filter="${esc(c)}">${esc(c)}</button>`
      ).join('');
    }

    function render(filter) {
      grid.innerHTML = '';
      items
        .filter((it) => filter === 'Todos' || it.category === filter)
        .forEach((it) => {
          const card = document.createElement('article');
          card.className = 'portfolio-card reveal';
          card.appendChild(imageEl(it.image, it.alt || it.title, it.title));
          const overlay = document.createElement('div');
          overlay.className = 'overlay';
          overlay.innerHTML = `<div><p class="text-cream/70 text-[0.7rem] uppercase tracking-widest">${esc(it.category || '')}</p><p class="text-cream font-display text-lg leading-tight">${esc(it.title || '')}</p></div>`;
          card.appendChild(overlay);
          grid.appendChild(card);
        });
      observeReveal();
    }

    render('Todos');
    if (filters) {
      filters.addEventListener('click', (e) => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        $$('.filter-btn', filters).forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.filter);
      });
    }
  }

  /* ---------- team ---------- */
  async function initTeam() {
    const data = await loadJSON('/content/team.json');
    const grid = $('#team-grid');
    if (!data || !grid) return;
    grid.innerHTML = '';
    (data.members || []).forEach((m) => {
      const card = document.createElement('article');
      card.className = 'text-center reveal';
      const photo = document.createElement('div');
      photo.className = 'mx-auto w-40 h-40 rounded-full overflow-hidden border border-sand shadow-sm';
      photo.appendChild(imageEl(m.photo, m.name, m.name));
      card.appendChild(photo);
      const info = document.createElement('div');
      info.innerHTML = `
        <h3 class="mt-5 font-display text-2xl text-ink">${esc(m.name)}</h3>
        <p class="text-gold uppercase tracking-widest text-xs mt-1">${esc(m.role || '')}</p>
        <p class="mt-3 text-mocha text-sm leading-relaxed max-w-xs mx-auto">${esc(m.bio || '')}</p>`;
      card.appendChild(info);
      grid.appendChild(card);
    });
    observeReveal();
  }

  /* ---------- testimonials ---------- */
  async function initTestimonials() {
    const data = await loadJSON('/content/testimonials.json');
    const grid = $('#testimonials-grid');
    const introEl = $('#testimonials-intro');
    if (!data || !grid) return;
    if (introEl && data.intro) introEl.textContent = data.intro;
    grid.innerHTML = (data.items || []).map((t) => {
      const stars = '★'.repeat(Math.max(0, Math.min(5, Number(t.rating) || 5)));
      return `
        <blockquote class="bg-cream/5 border border-cream/15 rounded-2xl p-7 reveal">
          <p class="text-gold text-lg tracking-tight mb-3">${stars}</p>
          <p class="font-serif text-xl leading-relaxed text-cream/90">“${esc(t.quote)}”</p>
          <footer class="mt-5 text-sm text-cream/60">
            <span class="text-cream">${esc(t.name)}</span>${t.service ? ' · ' + esc(t.service) : ''}
          </footer>
        </blockquote>`;
    }).join('');
    observeReveal();
  }

  /* ---------- scroll reveal ---------- */
  let revealObserver;
  function observeReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); revealObserver.unobserve(en.target); }
        });
      }, { threshold: 0.12 });
    }
    $$('.reveal:not(.is-visible)').forEach((el) => revealObserver.observe(el));
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initHeader();
    initSettings();
    initServices();
    initPortfolio();
    initTeam();
    initTestimonials();
    observeReveal();
  });
})();
