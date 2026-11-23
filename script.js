/* ════════════════════════════════════════════
  ENGR.Md.Oleullah (Oli) — PERSONAL BRANDING WEBSITE
   script.js
   ════════════════════════════════════════════ */

'use strict';

/* ── PARTICLE BACKGROUND ── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.innerWidth < 768;
  const CONNECT_DIST = 140;
  let W, H, particles = [], running = true;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.6,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  function fill() {
    const target = isMobile() ? 30 : 70;
    while (particles.length < target) particles.push(createParticle());
    particles.length = Math.min(particles.length, target);
  }
  fill();

  // Mobile browsers fire "resize" whenever the address bar shows/hides.
  // Ignore those small height-only changes so the canvas doesn't flicker.
  let lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', () => {
    const w = window.innerWidth, h = window.innerHeight;
    if (w === lastW && Math.abs(h - lastH) < 150) return;
    lastW = w; lastH = h;
    resize();
    fill();
  });

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, W, H);
    const connect = !isMobile();

    particles.forEach(p => {
      if (!reduceMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 166, 255, ${p.alpha})`;
      ctx.fill();
    });

    if (connect) {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(77, 166, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
    if (reduceMotion) { running = false; return; }   // draw one static frame only
    requestAnimationFrame(draw);
  }
  draw();

  // Save battery: stop animating when the tab is in the background
  document.addEventListener('visibilitychange', () => {
    if (reduceMotion) return;
    if (document.hidden) { running = false; }
    else if (!running) { running = true; requestAnimationFrame(draw); }
  });
})();

/* ── TYPING ANIMATION ── */
(function initTyping() {
  const el = document.getElementById('typed');
  if (!el) return;
  const words = [
    'an Electrical Engineer',
    'a Cyber Security Expert',
    'a Web Developer',
    'a Researcher',
    'an Entrepreneur',
    'a Managing Director',
    'a Publisher'
  ];
  let wi = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 40, PAUSE = 1800;

  function tick() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) {
        deleting = true;
        setTimeout(tick, PAUSE);
        return;
      }
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
      }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  tick();
})();

/* ── NAVBAR SCROLL BEHAVIOR ── */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });
})();

/* ── MOBILE HAMBURGER ── */
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  const nav = document.getElementById('navbar');
  if (!btn || !links) return;

  function setOpen(open) {
    links.classList.toggle('open', open);
    btn.classList.toggle('open', open);
    if (nav) nav.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => {
    if (links.classList.contains('open') && !links.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 900) setOpen(false); });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  if (!('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });
  items.forEach(el => obs.observe(el));
})();

/* ── SKILL BARS ── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const w = e.target.getAttribute('data-width');
        e.target.style.width = w + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
})();

/* ── COUNTERS ── */
(function initCounters() {
  const nums = document.querySelectorAll('.counter-num');
  if (!nums.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.getAttribute('data-target'), 10);
      const duration = 1800;
      const step = 16;
      const steps = duration / step;
      let current = 0;
      const inc = target / steps;
      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          e.target.textContent = target;
          clearInterval(timer);
        } else {
          e.target.textContent = Math.floor(current);
        }
      }, step);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });
  nums.forEach(n => obs.observe(n));
})();

/* ── PROJECT FILTERS ── */
(function initFilters() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-cat');
        const show = filter === 'all' || cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'fadeIn 0.3s ease forwards';
        }
      });
    });
  });
})();

/* ── BACK TO TOP ── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── ACTIVE NAV HIGHLIGHT ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  if (!sections.length || !links.length) return;
  let ticking = false;

  function update() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.style.color = href === current ? 'var(--blue-lt)' : '';
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

/* ── CONTACT FORM ── */
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Sending…';
    btn.disabled = true;

    // Simulate send (replace with your backend / EmailJS / Formspree integration)
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = 'linear-gradient(135deg, #4ade80, #16a34a)';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3500);
    }, 1400);
  });
})();

/* ── SMOOTH ANCHOR SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') { e.preventDefault(); return; }   // placeholder link
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── GALLERY LIGHTBOX ── */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.setAttribute('role', 'dialog');
  lb.setAttribute('aria-modal', 'true');
  lb.style.cssText = `
    display:none;position:fixed;inset:0;z-index:9000;
    background:rgba(10,25,47,0.96);backdrop-filter:blur(10px);
    align-items:center;justify-content:center;cursor:zoom-out;padding:16px;
  `;
  const img = document.createElement('img');
  img.style.cssText = 'max-width:100%;max-height:88vh;border-radius:10px;object-fit:contain;';
  const close = document.createElement('button');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '✕';
  close.style.cssText = `
    position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;
    background:rgba(17,34,64,0.9);color:#fff;font-size:1.1rem;border:1px solid rgba(77,166,255,0.3);
  `;
  lb.appendChild(img);
  lb.appendChild(close);
  document.body.appendChild(lb);

  function hide() { lb.style.display = 'none'; document.body.style.overflow = ''; }

  items.forEach(item => {
    const thumb = item.querySelector('img');
    item.style.cursor = 'zoom-in';
    item.addEventListener('click', () => {
      if (!thumb || !thumb.complete || thumb.naturalWidth === 0) return;  // skip placeholders
      img.src = thumb.currentSrc || thumb.src;
      img.alt = thumb.alt;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
  lb.addEventListener('click', hide);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
})();

/* ── RESEARCH "READ MORE" (mobile only; button is hidden by CSS on desktop) ── */
(function initReadMore() {
  document.querySelectorAll('.research-abstract').forEach(p => {
    p.classList.add('is-clamped');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'read-more';
    btn.textContent = 'Read more ↓';
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', () => {
      const clamped = p.classList.toggle('is-clamped');
      btn.textContent = clamped ? 'Read more ↓' : 'Show less ↑';
      btn.setAttribute('aria-expanded', String(!clamped));
    });
    p.insertAdjacentElement('afterend', btn);
  });
})();
