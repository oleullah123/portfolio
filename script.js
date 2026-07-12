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
  let W, H, particles = [];
  const PARTICLE_COUNT = 70;
  const CONNECT_DIST = 140;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
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

  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(createParticle());

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(77, 166, 255, ${p.alpha})`;
      ctx.fill();
    });

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
    requestAnimationFrame(draw);
  }
  draw();
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
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      const spans = btn.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
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

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute('id');
      }
    });
    links.forEach(a => {
      const href = a.getAttribute('href').replace('#', '');
      a.style.color = href === current ? 'var(--blue-lt)' : '';
    });
  }, { passive: true });
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
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 68;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── GALLERY LIGHTBOX ── */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item img');
  if (!items.length) return;

  const lb = document.createElement('div');
  lb.style.cssText = `
    display:none;position:fixed;inset:0;z-index:9000;
    background:rgba(10,25,47,0.96);backdrop-filter:blur(10px);
    align-items:center;justify-content:center;cursor:zoom-out;
  `;
  const img = document.createElement('img');
  img.style.cssText = 'max-width:88vw;max-height:88vh;border-radius:10px;object-fit:contain;';
  lb.appendChild(img);
  document.body.appendChild(lb);

  items.forEach(i => {
    i.style.cursor = 'zoom-in';
    i.addEventListener('click', () => {
      img.src = i.src;
      lb.style.display = 'flex';
    });
  });
  lb.addEventListener('click', () => { lb.style.display = 'none'; });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.style.display = 'none'; });
})();
