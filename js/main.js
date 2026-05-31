window.addEventListener('load', function() {
let lenis;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.15,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });
  function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
  requestAnimationFrame(lenisRaf);
  if (typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.transform = 'scaleX(' + Math.min(scrolled, 1) + ')';
}
window.addEventListener('scroll', updateProgress, { passive: true });
if (lenis) lenis.on('scroll', updateProgress);
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
if (cursor && window.matchMedia('(pointer: fine)').matches) {
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    cursorDot.style.cssText  = 'left:' + mx + 'px;top:' + my + 'px';
    cursorRing.style.cssText = 'left:' + rx + 'px;top:' + ry + 'px';
    requestAnimationFrame(animCursor);
  })();
  document.querySelectorAll('a, button, .product-card, .btn-primary, .nav-cta').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const hero = canvas.closest('.hero');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const N = 70;
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.5 + 0.1
    });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,' + p.a + ')';
      ctx.fill();
    });
    particles.forEach((p, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(255,255,255,' + (0.06 * (1 - d / 90)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
})();
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach(el => {
    const dx = el.classList.contains('reveal-left') ? -40 : el.classList.contains('reveal-right') ? 40 : 0;
    gsap.fromTo(el,
      { opacity: 0, x: dx, y: dx === 0 ? 36 : 0 },
      { opacity: 1, x: 0, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true,
          onEnter: () => el.classList.add('is-visible') }
      }
    );
  });
  gsap.utils.toArray('.reveal-group').forEach(group => {
    const children = group.children;
    gsap.fromTo(children,
      { opacity: 0, y: 32 },
      { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: group, start: 'top 85%', once: true,
          onEnter: () => group.classList.add('is-visible') }
      }
    );
  });
  function splitIntoWords(el) {
    if (el.querySelector('.word-wrap')) return;
    const parts = [];
    el.childNodes.forEach(node => {
      if (node.nodeType === 3) { 
        node.textContent.split(/(\s+)/).forEach(chunk => {
          if (/^\s+$/.test(chunk) || chunk === '') { parts.push(chunk); }
          else { parts.push('<span class="word-wrap"><span class="word">' + chunk + '</span></span>'); }
        });
      } else if (node.nodeType === 1 && node.tagName !== 'BR') { 
        parts.push('<span class="word-wrap"><span class="word">' + node.outerHTML + '</span></span>');
      } else if (node.nodeType === 1) {
        parts.push(node.outerHTML); 
      }
    });
    el.innerHTML = parts.join('');
  }
  document.querySelectorAll('.section-title, .science-title, .spotlight-title').forEach(el => {
    splitIntoWords(el);
    gsap.fromTo(el.querySelectorAll('.word'),
      { y: '105%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.65, ease: 'power3.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      }
    );
  });
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    splitIntoWords(heroTitle);
    gsap.fromTo(heroTitle.querySelectorAll('.word'),
      { y: '110%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.75, ease: 'power3.out', stagger: 0.055, delay: 0.2 }
    );
  }
  gsap.utils.toArray('.ha-comparison').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', once: true,
      onEnter: () => el.querySelectorAll('.hac-bar-fill').forEach(bar => {
        bar.style.transition = 'width 1.4s cubic-bezier(0.25,0.46,0.45,0.94)';
      })
    });
  });
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true,
        onEnter: () => el.classList.add('is-counted') },
      onUpdate: () => { el.innerHTML = Math.floor(obj.val) + suffix; },
      onComplete: () => { el.innerHTML = target + suffix; }
    });
  });
  const heroShowcase = document.querySelector('.hero-showcase');
  if (heroShowcase) {
    gsap.to(heroShowcase, {
      y: 80, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  }
  const heroBgPattern = document.querySelector('.hero-bg-pattern');
  if (heroBgPattern) {
    gsap.to(heroBgPattern, {
      y: 120, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  }
  ScrollTrigger.refresh();
} else {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-group').forEach(el => revealObs.observe(el));
  document.querySelectorAll('.ha-comparison').forEach(el => {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.querySelectorAll('.hac-bar-fill').forEach(b => {
        b.style.transition = 'width 1.4s cubic-bezier(0.25,0.46,0.45,0.94)';
      });
    }, { threshold: 0.3 }).observe(el);
  });
}
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -14;
    card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
    card.style.transform = 'perspective(900px) rotateX(' + y + 'deg) rotateY(' + x + 'deg) translateY(-8px) scale(1.02)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease';
    card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateY(0) scale(1)';
  });
});
document.querySelectorAll('.btn-primary, .nav-cta, .form-submit').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) * 0.28;
    const y = (e.clientY - r.top  - r.height / 2) * 0.28;
    btn.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    btn.style.transition = 'transform 0.1s ease';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.23,1,0.32,1)';
  });
});
(function() {
  const heroLeft  = document.querySelector('.hero-left');
  const floatCards = document.querySelectorAll('.floating-card');
  document.querySelector('.hero')?.addEventListener('mousemove', e => {
    const rx = (e.clientX / window.innerWidth  - 0.5) * 12;
    const ry = (e.clientY / window.innerHeight - 0.5) * 12;
    if (heroLeft) heroLeft.style.transform = 'translate(' + rx * 0.3 + 'px,' + ry * 0.3 + 'px)';
    floatCards.forEach((fc, i) => {
      const depth = i === 0 ? 0.6 : 1;
      fc.style.transform = 'translate(' + rx * depth + 'px,' + (ry * depth - 8 * Math.sin(Date.now() / 2000 + i)) + 'px)';
    });
  });
})();
(function() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const onScroll = () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
    navLinks.forEach(a => {
      const active = a.getAttribute('href') === '#' + current;
      a.style.color = active ? '#fff' : 'rgba(255,255,255,0.7)';
      a.style.fontWeight = active ? '600' : '500';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  if (lenis) lenis.on('scroll', onScroll);
})();
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-answer').style.maxHeight = '0';
      o.querySelector('.faq-question').setAttribute('aria-expanded','false');
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded','true');
    }
  });
});
const overlay = document.getElementById('intro-overlay');
if (overlay) setTimeout(() => { overlay.style.display = 'none'; }, 500);
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  try { if (!localStorage.getItem('cookie-consent')) setTimeout(() => banner.classList.add('visible'), 3200); }
  catch(e) { setTimeout(() => banner.classList.add('visible'), 3200); }
})();
}); 
function handleCookie(decision) {
  try { localStorage.setItem('cookie-consent', decision); } catch(e) {}
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('visible');
}
function openPrivacy() {
  const modal = document.getElementById('privacy-modal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closePrivacy() {
  const modal = document.getElementById('privacy-modal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  const modal = document.getElementById('privacy-modal');
  if (modal?.classList.contains('open') && e.target === modal) closePrivacy();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePrivacy(); });
// Sticky CTA na 400px scrollen
(function(){
  var cta = document.getElementById('sticky-cta');
  if(!cta) return;
  window.addEventListener('scroll', function(){
    cta.classList.toggle('visible', window.scrollY > 400);
  }, {passive: true});
})();

// ── Service Worker registratie ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}

// ── View Transitions API (native pagina-overgangen) ──
if (!document.startViewTransition) {
  // Fallback voor browsers zonder View Transitions
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity .25s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 250);
    });
  });
}

// ── Social proof toasts ──
(function() {
  const proofs = [
    { nl: 'Dr. van den Berg — Utrecht', de: 'Dr. Müller — München', prod: 'Alpha2EQ', time: 3 },
    { nl: 'Dr. Jansen — Groningen', de: 'Dr. Wagner — Hamburg', prod: 'Gestabiliseerd HA', time: 8 },
    { nl: 'Dr. Bakker — Den Haag', de: 'Dr. Becker — Köln', prod: 'Noltrex Vet', time: 14 },
    { nl: 'Dr. de Vries — Eindhoven', de: 'Dr. Schäfer — Stuttgart', prod: 'Tildren', time: 22 },
    { nl: 'Dr. Vermeer — Arnhem', de: 'Dr. Koch — Düsseldorf', prod: 'Pentosan Evolution', time: 31 },
  ];
  const isDE = location.pathname.startsWith('/de');
  const toast = document.createElement('div');
  toast.id = 'proof-toast';
  toast.style.cssText = 'position:fixed;bottom:90px;left:24px;background:rgba(9,21,38,.96);backdrop-filter:blur(16px);border:1px solid rgba(21,96,189,.3);border-radius:12px;padding:14px 18px;z-index:800;max-width:280px;transform:translateX(-120%);transition:transform .4s cubic-bezier(.23,1,.32,1);font-size:13px;line-height:1.5;';
  document.body.appendChild(toast);

  let idx = 0;
  function showToast() {
    const p = proofs[idx % proofs.length];
    const name = isDE ? p.de : p.nl;
    const label = isDE ? 'hat gerade bestellt:' : 'bestelde zojuist:';
    toast.innerHTML = `<div style="color:rgba(255,255,255,.5);font-size:11px;margin-bottom:4px;">🟢 ${p.time} min geleden</div><div style="color:#fff;font-weight:600;">${name}</div><div style="color:rgba(255,255,255,.6);">${label} <span style="color:var(--teal-light);">${p.prod}</span></div>`;
    toast.style.transform = 'translateX(0)';
    setTimeout(() => { toast.style.transform = 'translateX(-120%)'; }, 4500);
    idx++;
  }
  setTimeout(() => { showToast(); setInterval(showToast, 18000); }, 8000);
})();

// ── Doseringsberekening modal ──
(function() {
  const isDE = location.pathname.startsWith('/de');
  const t = isDE ? {
    btn: '💊 Dosierungsrechner',
    title: 'Dosierungsberechnung Pferd',
    weight: 'Körpergewicht (kg)',
    product: 'Produkt wählen',
    calc: 'Berechnen',
    note: '⚠️ Indikativ. Tierärztliche Diagnose und Verordnung erforderlich.',
    close: 'Schließen',
    products: ['Alpha2EQ','Stabilisierte HA (Optivisc)','Noltrex Vet','Tildren (Tiludronsäure)','Osphos (Clodronsäure)','Pentosan Evolution'],
  } : {
    btn: '💊 Doseringsberekening',
    title: 'Doseringsberekening paard',
    weight: 'Lichaamsgewicht (kg)',
    product: 'Product selecteren',
    calc: 'Berekenen',
    note: '⚠️ Indicatief. Veterinaire diagnose en voorschrift vereist.',
    close: 'Sluiten',
    products: ['Alpha2EQ','Gestabiliseerd HA (Optivisc)','Noltrex Vet','Tildren (Tiludronate)','Osphos (Clodronate)','Pentosan Evolution'],
  };

  // Trigger knop
  const btn = document.createElement('button');
  btn.id = 'dose-trigger';
  btn.textContent = t.btn;
  btn.style.cssText = 'position:fixed;right:24px;bottom:90px;background:var(--teal);color:#fff;border:none;border-radius:10px;padding:12px 18px;font-size:13px;font-weight:700;cursor:pointer;z-index:800;box-shadow:0 4px 20px rgba(14,95,110,.4);transition:transform .2s,box-shadow .2s;white-space:nowrap;';
  btn.onmouseover = () => { btn.style.transform = 'translateY(-2px)'; btn.style.boxShadow = '0 8px 28px rgba(14,95,110,.5)'; };
  btn.onmouseleave = () => { btn.style.transform = ''; btn.style.boxShadow = '0 4px 20px rgba(14,95,110,.4)'; };
  document.body.appendChild(btn);

  // Modal
  const modal = document.createElement('div');
  modal.id = 'dose-modal';
  modal.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(6,15,30,.85);backdrop-filter:blur(12px);z-index:9999;align-items:center;justify-content:center;padding:24px;';
  modal.innerHTML = `
  <div style="background:#0d1b2a;border:1px solid rgba(21,96,189,.3);border-radius:20px;padding:40px;max-width:480px;width:100%;position:relative;">
    <button onclick="document.getElementById('dose-modal').style.display='none'" style="position:absolute;top:16px;right:16px;background:none;border:none;color:rgba(255,255,255,.4);font-size:20px;cursor:pointer;">✕</button>
    <h3 style="font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:#fff;margin-bottom:24px;">${t.title}</h3>
    <label style="display:block;font-size:12px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;">${t.weight}</label>
    <input id="horse-weight" type="number" min="50" max="900" placeholder="500" style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:12px 16px;color:#fff;font-size:16px;margin-bottom:20px;outline:none;box-sizing:border-box;">
    <label style="display:block;font-size:12px;color:rgba(255,255,255,.5);letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;">${t.product}</label>
    <select id="horse-product" style="width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:12px 16px;color:#fff;font-size:15px;margin-bottom:24px;outline:none;box-sizing:border-box;">
      ${t.products.map(p => `<option value="${p}">${p}</option>`).join('')}
    </select>
    <button onclick="calcDose()" style="width:100%;background:var(--gold);color:#fff;border:none;border-radius:8px;padding:14px;font-size:15px;font-weight:700;cursor:pointer;">${t.calc} →</button>
    <div id="dose-result" style="margin-top:20px;display:none;"></div>
    <p style="margin-top:20px;font-size:11px;color:rgba(255,255,255,.3);line-height:1.6;">${t.note}</p>
  </div>`;
  document.body.appendChild(modal);

  btn.onclick = () => { modal.style.display = 'flex'; };
  modal.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

  window.calcDose = function() {
    const w = parseFloat(document.getElementById('horse-weight').value) || 500;
    const prod = document.getElementById('horse-product').value;
    const res = document.getElementById('dose-result');
    const isDE = location.pathname.startsWith('/de');
    let html = '';

    if (prod.includes('Alpha2EQ')) {
      html = isDE
        ? `<b style="color:var(--teal-light)">Alpha2EQ</b><br>1 Kit pro Behandlung (nicht gewichtsabhängig)<br>Konzentrat in das betroffene Gelenk injizieren.<br>Einfrierbar: bis 12 Monate bei −20°C.`
        : `<b style="color:var(--teal-light)">Alpha2EQ</b><br>1 kit per behandeling (niet gewichtsafhankelijk)<br>Concentraat intra-articulair injecteren.<br>Invriesbaar: tot 12 maanden bij −20°C.`;
    } else if (prod.includes('HA') || prod.includes('Optivisc')) {
      html = isDE
        ? `<b style="color:var(--teal-light)">Stabilisierte HA (Optivisc)</b><br>2 ml intraartikulär pro Gelenk.<br>Bei großen Gelenken (Hüfte, Hock): 2–3 ml.<br>Wiederholung nach 3–6 Monaten je nach Ansprechen.`
        : `<b style="color:var(--teal-light)">Gestabiliseerd HA</b><br>2 ml intra-articulair per gewricht.<br>Grote gewrichten (heup, sprong): 2–3 ml.<br>Herhaling na 3–6 maanden afhankelijk van respons.`;
    } else if (prod.includes('Noltrex')) {
      html = isDE
        ? `<b style="color:var(--teal-light)">Noltrex Vet</b><br>Fesselgelenk: 1–2 ml<br>Sprunggelenk (tarsometacarpal): 2–3 ml<br>Großes Sprunggelenk: 3–5 ml<br>Einmalige Behandlung (dauerhaft).`
        : `<b style="color:var(--teal-light)">Noltrex Vet</b><br>Kogel: 1–2 ml<br>Spronggewricht (distaal): 2–3 ml<br>Groot spronggewricht: 3–5 ml<br>Eenmalige behandeling (permanent).`;
    } else if (prod.includes('Tildren') || prod.includes('Tiludronate') || prod.includes('Tiludronsäure')) {
      const dose_mg = Math.round(w * 1);
      const vol_ml = Math.round(dose_mg / 5);
      html = isDE
        ? `<b style="color:var(--teal-light)">Tildren — ${w} kg</b><br>Dosis: 1 mg/kg IV = <b style="color:#fff">${dose_mg} mg</b><br>Volumen (5 mg/ml): <b style="color:#fff">${vol_ml} ml</b><br>Infusion über 90 min in 1L NaCl 0,9%.<br>Einzelgabe oder 2× mit 2 Wochen Abstand.`
        : `<b style="color:var(--teal-light)">Tildren — ${w} kg</b><br>Dosering: 1 mg/kg IV = <b style="color:#fff">${dose_mg} mg</b><br>Volume (5 mg/ml): <b style="color:#fff">${vol_ml} ml</b><br>Infusie over 90 min in 1L NaCl 0,9%.<br>Eenmalig of 2× met 2 weken tussentijd.`;
    } else if (prod.includes('Osphos') || prod.includes('Clodronate') || prod.includes('Clodronsäure')) {
      const dose_mg = Math.round(w * 1.8);
      const vol_ml = (dose_mg / 51).toFixed(1);
      html = isDE
        ? `<b style="color:var(--teal-light)">Osphos — ${w} kg</b><br>Dosis: 1,8 mg/kg IM = <b style="color:#fff">${dose_mg} mg</b><br>Volumen (51 mg/ml): <b style="color:#fff">${vol_ml} ml</b><br>Intramuskulär, aufgeteilt auf 2 Injektionsstellen.<br>Wiederholung nach 6 Monaten möglich.`
        : `<b style="color:var(--teal-light)">Osphos — ${w} kg</b><br>Dosering: 1,8 mg/kg IM = <b style="color:#fff">${dose_mg} mg</b><br>Volume (51 mg/ml): <b style="color:#fff">${vol_ml} ml</b><br>Intramusculair, verdeel over 2 injectieplaatsen.<br>Herhaling na 6 maanden mogelijk.`;
    } else if (prod.includes('Pentosan')) {
      const dose_mg = Math.round(w * 3);
      html = isDE
        ? `<b style="color:var(--teal-light)">Pentosan Evolution — ${w} kg</b><br>Dosis: 3 mg/kg IM = <b style="color:#fff">${dose_mg} mg</b><br>1× per Woche für 4 Wochen (Induktionskur).<br>Danach monatliche Erhaltungsdosis.`
        : `<b style="color:var(--teal-light)">Pentosan Evolution — ${w} kg</b><br>Dosering: 3 mg/kg IM = <b style="color:#fff">${dose_mg} mg</b><br>1× per week gedurende 4 weken (inductiekuur).<br>Daarna maandelijkse onderhoudsdosis.`;
    }

    res.style.display = 'block';
    res.style.cssText = 'margin-top:20px;background:rgba(14,95,110,.1);border:1px solid rgba(14,95,110,.3);border-radius:10px;padding:16px;font-size:14px;color:rgba(255,255,255,.8);line-height:1.8;display:block;';
    res.innerHTML = html;
  };
})();

// ════════════════════════════════════════
// WOW FACTOR JS
// ════════════════════════════════════════

// ── Muis-reactieve aurora hero ──
(function(){
  const hero = document.querySelector('.hero');
  if(!hero) return;
  let tx=60, ty=40, cx=60, cy=40;
  hero.addEventListener('mousemove', e=>{
    tx = (e.clientX / window.innerWidth)  * 100;
    ty = (e.clientY / window.innerHeight) * 100;
  });
  function lerp(a,b,t){ return a + (b-a)*t; }
  (function tick(){
    cx = lerp(cx, tx, 0.06);
    cy = lerp(cy, ty, 0.06);
    hero.style.setProperty('--mx', cx.toFixed(2)+'%');
    hero.style.setProperty('--my', cy.toFixed(2)+'%');
    requestAnimationFrame(tick);
  })();
  // Override aurora met muis-reactieve versie
  const bg = hero.querySelector('.hero-bg-pattern');
  if(bg) {
    (function animBg(){
      bg.style.background = `
        radial-gradient(ellipse 70% 55% at ${cx.toFixed(1)}% ${cy.toFixed(1)}%,rgba(21,96,189,0.28) 0%,transparent 65%),
        radial-gradient(ellipse 45% 40% at ${(100-cx).toFixed(1)}% ${(100-cy).toFixed(1)}%,rgba(14,95,110,0.18) 0%,transparent 60%)
      `;
      requestAnimationFrame(animBg);
    })();
  }
})();

// ── Text scramble decoder op statistieken ──
function scramble(el, finalText, delay=0){
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
  const duration = 900;
  let start = null;
  setTimeout(()=>{
    function step(ts){
      if(!start) start=ts;
      const prog = Math.min((ts-start)/duration, 1);
      el.textContent = finalText.split('').map((ch,i)=>{
        if(ch===' '||ch==='+') return ch;
        if(prog > i/finalText.length) return ch;
        return CHARS[Math.floor(Math.random()*CHARS.length)];
      }).join('');
      if(prog < 1) requestAnimationFrame(step);
      else el.textContent = finalText;
    }
    requestAnimationFrame(step);
  }, delay);
}

// ── GSAP Horizontale scroll ──
window.addEventListener('load', function() {
  if(typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Horizontal scroll
  const hSection = document.querySelector('.horiz-section');
  const hTrack   = document.querySelector('.horiz-track');
  const hDots    = document.querySelectorAll('.horiz-dot');
  if(hSection && hTrack){
    const slides = hTrack.querySelectorAll('.horiz-slide');
    const n = slides.length;

    ScrollTrigger.create({
      trigger: hSection,
      pin: true,
      start: 'top top',
      end: `+=${n * 100}%`,
      scrub: 0.9,
      onUpdate: self=>{
        const idx = Math.round(self.progress * (n-1));
        hDots.forEach((d,i)=> d.classList.toggle('active', i===idx));
        // Animate bar fills in slide
        const activeSlide = slides[idx];
        if(activeSlide){
          activeSlide.querySelectorAll('.hs-bar-fill').forEach(b=> b.classList.add('animate'));
        }
      },
    });

    gsap.to(hTrack, {
      xPercent: -(100 * (n-1)),
      ease: 'none',
      scrollTrigger: {
        trigger: hSection,
        start: 'top top',
        end: `+=${n * 100}%`,
        scrub: 0.9,
      }
    });

    // Dot click navigatie
    hDots.forEach((dot,i)=>{
      dot.addEventListener('click', ()=>{
        const st = ScrollTrigger.getById('horiz');
        if(st) return;
        const target = hSection.offsetTop + (i / (n-1)) * (n * window.innerHeight);
        window.scrollTo({ top: target, behavior: 'smooth' });
      });
    });
  }

  // Kinetic stats met scramble
  const kItems = document.querySelectorAll('.kinetic-num[data-target]');
  kItems.forEach(el=>{
    const target = el.dataset.target;
    const suffix = el.querySelector('span')?.outerHTML || '';
    ScrollTrigger.create({
      trigger: el, start:'top 85%', once:true,
      onEnter: ()=>scramble(el, target+suffix.replace(/<[^>]+>/g,''))
    });
  });

  // Sectie-overgangen met clip-path
  gsap.utils.toArray('.clip-reveal').forEach(el=>{
    gsap.fromTo(el,
      { clipPath:'inset(0 100% 0 0)' },
      { clipPath:'inset(0 0% 0 0)', duration:1.1, ease:'power3.inOut',
        scrollTrigger:{ trigger:el, start:'top 80%', once:true } }
    );
  });

  // Parallax op kinetische achtergrondcijfers
  gsap.utils.toArray('.kinetic-item').forEach((item,i)=>{
    gsap.to(item.querySelector('.hs-bg-num, .kinetic-item::before'), {
      y: -40, ease:'none',
      scrollTrigger:{ trigger:item, start:'top bottom', end:'bottom top', scrub:true }
    });
  });
});

// ── PRODUCT-KEUZE-ASSISTENT ──
(function(){
  const isDE = location.pathname.startsWith('/de');
  const T = isDE ? {
    btn:'🔍 Welches Produkt?',
    close:'Schließen',
    back:'← Zurück',
    steps:[
      {title:'Was ist das primäre Problem?',sub:'Beschreiben Sie die Hauptklage des Patienten.',opts:[
        {icon:'🦴',text:'Chronische Arthritis / Gelenkabnutzung',next:1},
        {icon:'💉',text:'Sehnenschaden / Regenerationsbedarf',next:'alpha2eq'},
        {icon:'🐾',text:'Hufrollensyndrom / Knochenproblem',next:'tildren'},
        {icon:'💧',text:'Gelenkflüssigkeit / Prävention',next:'ha'},
      ]},
      {title:'Kortikosteroide — Reaktion?',sub:'Hat der Patient früher auf Kortikosteroide angesprochen?',opts:[
        {icon:'📉',text:'Ja, Wirkung lässt nach',next:'alpha2eq'},
        {icon:'🆕',text:'Nein / Erstbehandlung',next:2},
      ]},
      {title:'Welche Gelenke sind betroffen?',sub:'',opts:[
        {icon:'🎯',text:'Ein spezifisches Gelenk',next:'ha-noltrex'},
        {icon:'🔄',text:'Mehrere Gelenke / systemisch',next:'pentosan'},
      ]},
    ],
    results:{
      'alpha2eq':{prod:'Alpha2EQ',why:'Alpha2EQ konzentriert α2-Makroglobulin aus dem Eigenblut — hemmt alle 4 Proteaseklassen, die Knorpel abbauen. Ideal bei Kortikosteroid-Versagen und chronischer Arthritis.',url:'/de/wissenschaft.html#alpha2eq'},
      'ha':{prod:'Stabilisierte HA',why:'Gestabiliseerde Hyaluronsäure bleibt 3–6 Monate im Gelenk aktiv — deutlich länger als lineare oder vernetzte HA. Mapatruto-Patent.',url:'/de/produkte.html'},
      'noltrex':{prod:'Noltrex Vet',why:'Polyacrylamid 4% als dauerhafte Gelenkfüllung. Eine Behandlung — dauerhafter Effekt.',url:'/de/produkte.html'},
      'ha-noltrex':{prod:'Stabilisierte HA oder Noltrex Vet',why:'Für ein einzelnes Gelenk: stabilisierte HA bei moderater Arthrose; Noltrex Vet bei schwerer Degeneration als dauerhafte Option.',url:'/de/produkte.html'},
      'pentosan':{prod:'Pentosan Evolution',why:'Systemischer DMOAD-Effekt: Pentosanpolysulfat + Glucosamin + HA in einer Injektion. Ideal bei Mehrgelenk-Arthrose.',url:'/de/produkte.html'},
      'tildren':{prod:'Tildren of Osphos',why:'Bisphosphonate hemmen die osteoklastische Knochenresorption. Tiludronsäure (Tildren) oder Clodronsäure (Osphos) — beide sofort lieferbar.',url:'/de/produkte.html'},
    }
  } : {
    btn:'🔍 Welk product?',
    close:'Sluiten',
    back:'← Vorige',
    steps:[
      {title:'Wat is het primaire probleem?',sub:'Beschrijf de hoofdklacht van de patiënt.',opts:[
        {icon:'🦴',text:'Chronische artritis / gewrichtsslijtage',next:1},
        {icon:'💉',text:'Peesbeschadiging / regeneratiebehoefte',next:'alpha2eq'},
        {icon:'🐾',text:'Naviculaire aandoening / botprobleem',next:'tildren'},
        {icon:'💧',text:'Gewrichtsfluid / preventief onderhoud',next:'ha'},
      ]},
      {title:'Corticosteroïden — wat was de respons?',sub:'Heeft de patiënt eerder behandeling gehad?',opts:[
        {icon:'📉',text:'Ja, werking neemt af',next:'alpha2eq'},
        {icon:'🆕',text:'Nee / eerste behandeling',next:2},
      ]},
      {title:'Welke gewrichten zijn betrokken?',sub:'',opts:[
        {icon:'🎯',text:'Één specifiek gewricht',next:'ha-noltrex'},
        {icon:'🔄',text:'Meerdere gewrichten / systemisch',next:'pentosan'},
      ]},
    ],
    results:{
      'alpha2eq':{prod:'Alpha2EQ',why:'Alpha2EQ concentreert α2-Macroglobuline uit het eigen bloed — remt alle 4 proteaseklassen die kraakbeen afbreken. Ideaal bij corticosteroïd-falen en chronische artritis.',url:'/wetenschap.html'},
      'ha':{prod:'Gestabiliseerd HA',why:'Blijft 3–6 maanden actief in het gewricht — aanzienlijk langer dan lineair of cross-linked HA. Mapatruto-patent, enige leverancier in Europa.',url:'/producten.html'},
      'noltrex':{prod:'Noltrex Vet',why:'Polyacrylamide 4% als permanente gewrichtsvulling. Eenmalige behandeling — blijvend effect.',url:'/producten.html'},
      'ha-noltrex':{prod:'Gestabiliseerd HA of Noltrex Vet',why:'Voor één gewricht: gestabiliseerd HA bij matige artrose; Noltrex Vet bij ernstige degeneratie als permanente optie.',url:'/producten.html'},
      'pentosan':{prod:'Pentosan Evolution',why:'Systemisch DMOAD-effect: pentosan polysulfaat + glucosamine + HA in één injectie. Ideaal bij meerdere gewrichten.',url:'/producten.html'},
      'tildren':{prod:'Tildren of Osphos',why:'Bisfosfonaten remmen osteoklastische botresorptie. Tiludronate (Tildren) of clodronate (Osphos) — beide direct op voorraad.',url:'/producten.html'},
    }
  };

  const btn = document.createElement('button');
  btn.id='quiz-trigger'; btn.textContent=T.btn;
  document.body.appendChild(btn);

  const modal = document.createElement('div');
  modal.id='quiz-modal';
  document.body.appendChild(modal);

  let history=[], currentStep=0;

  function render(stepOrResult){
    const isResult = typeof stepOrResult === 'string';
    let html = `<div class="quiz-inner">
      <button onclick="document.getElementById('quiz-modal').style.display='none'" style="position:absolute;top:16px;right:16px;background:none;border:none;color:rgba(255,255,255,.4);font-size:20px;cursor:pointer">${T.close}</button>`;

    if(!isResult){
      const s = T.steps[stepOrResult];
      const prog = T.steps.map((_,i)=>`<div class="quiz-prog-dot${i<stepOrResult?' done':''}"></div>`).join('');
      html += `<div class="quiz-progress">${prog}</div>
        <div class="quiz-step active">
          <div class="quiz-title">${s.title}</div>
          ${s.sub?`<div class="quiz-sub">${s.sub}</div>`:''}
          <div class="quiz-options">
            ${s.opts.map(o=>`<button class="quiz-opt" onclick="quizGo('${o.next}')"><span class="quiz-opt-icon">${o.icon}</span>${o.text}</button>`).join('')}
          </div>
          ${history.length?`<button class="quiz-back" onclick="quizBack()">${T.back}</button>`:''}
        </div>`;
    } else {
      const r = T.results[stepOrResult];
      html += `<div class="quiz-step active quiz-result">
        <div style="font-size:40px;margin-bottom:12px">✅</div>
        <div class="quiz-title">Aanbevolen product</div>
        <div class="quiz-result-product">${r.prod}</div>
        <div class="quiz-result-why">${r.why}</div>
        <a href="${r.url}" class="btn-primary" style="display:inline-flex;margin:0 auto;">Meer informatie →</a>
        <br><button class="quiz-back" onclick="quizReset()" style="margin-top:12px">Opnieuw beginnen</button>
      </div>`;
    }
    html+='</div>';
    modal.innerHTML=html;
    modal.style.display='flex';
  }

  window.quizGo=function(next){
    history.push(currentStep);
    if(typeof next==='number'){ currentStep=next; render(next); }
    else render(next);
  };
  window.quizBack=function(){
    if(!history.length) return;
    currentStep=history.pop();
    render(currentStep);
  };
  window.quizReset=function(){ history=[]; currentStep=0; render(0); };

  btn.onclick=()=>render(0);
  modal.addEventListener('click',e=>{ if(e.target===modal) modal.style.display='none'; });
})();

// ── MOLECULAIRE CANVAS VISUALISATIE ──
(function(){
  const canvas=document.getElementById('mol-canvas');
  if(!canvas) return;
  const ctx=canvas.getContext('2d');
  const DPR=window.devicePixelRatio||1;
  function resize(){
    canvas.width=canvas.offsetWidth*DPR;
    canvas.height=canvas.offsetHeight*DPR;
    ctx.scale(DPR,DPR);
  }
  resize();
  window.addEventListener('resize',()=>{ctx.setTransform(1,0,0,1,0,0);resize();});

  // HA polymer chain: alternating rings + functional groups
  const CHAIN=[
    {dx:-240,dy:0,r:22,c:'#1560BD',label:'GlcUA'},
    {dx:-160,dy:-30,r:16,c:'#2E7DD4',label:'OH'},
    {dx:-80,dy:0,r:22,c:'#1A8BA0',label:'GlcNAc'},
    {dx:0,dy:-30,r:16,c:'#2E7DD4',label:'NH'},
    {dx:80,dy:0,r:22,c:'#1560BD',label:'GlcUA'},
    {dx:160,dy:-30,r:16,c:'#0E5F6E',label:'OH'},
    {dx:240,dy:0,r:22,c:'#1A8BA0',label:'GlcNAc'},
    {dx:320,dy:-30,r:12,c:'#2E7DD4',label:''},
    {dx:-320,dy:-30,r:12,c:'#2E7DD4',label:''},
  ];

  let angle=0, mouseX=0, mouseY=0;
  canvas.addEventListener('mousemove',e=>{
    const r=canvas.getBoundingClientRect();
    mouseX=(e.clientX-r.left-canvas.offsetWidth/2)*0.02;
    mouseY=(e.clientY-r.top-canvas.offsetHeight/2)*0.015;
  });

  function draw(){
    const W=canvas.offsetWidth, H=canvas.offsetHeight;
    ctx.clearRect(0,0,W,H);
    const cx=W/2, cy=H/2;

    const cosA=Math.cos(angle+mouseX);
    const sinA=Math.sin(angle+mouseX);
    const cosB=Math.cos(mouseY*0.5);
    const sinB=Math.sin(mouseY*0.5);

    const pts=CHAIN.map(a=>{
      const x3=a.dx*cosA - a.dy*sinA;
      const y3=a.dx*sinA + a.dy*cosA;
      const z=y3*0.3; // perspective
      return {
        x:cx+x3, y:cy+y3*cosB+z*sinB,
        r:a.r*(1+z*0.001), c:a.c, label:a.label,
        alpha:0.4+0.6*(1+z/100)*0.5
      };
    });

    // Draw bonds
    for(let i=0;i<pts.length-1;i++){
      const a=pts[i], b=pts[i+1];
      ctx.beginPath();
      ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
      const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
      grad.addColorStop(0,a.c+'88'); grad.addColorStop(1,b.c+'88');
      ctx.strokeStyle=grad; ctx.lineWidth=3;
      ctx.stroke();
    }

    // Draw atoms
    pts.forEach(p=>{
      // Glow
      const glow=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*2.5);
      glow.addColorStop(0,p.c+'22'); glow.addColorStop(1,'transparent');
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2);
      ctx.fillStyle=glow; ctx.fill();

      // Atom sphere
      const sphere=ctx.createRadialGradient(p.x-p.r*.3,p.y-p.r*.3,0,p.x,p.y,p.r);
      sphere.addColorStop(0,'rgba(255,255,255,.35)'); sphere.addColorStop(1,p.c);
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=sphere; ctx.fill();

      // Label
      if(p.label && p.r>14){
        ctx.fillStyle='rgba(255,255,255,.9)';
        ctx.font=`bold ${Math.floor(p.r*.6)}px DM Mono, monospace`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        ctx.fillText(p.label,p.x,p.y);
      }
    });

    // Rotation info label
    ctx.fillStyle='rgba(255,255,255,.2)';
    ctx.font='11px DM Sans, sans-serif';
    ctx.textAlign='right'; ctx.textBaseline='bottom';
    ctx.fillText('Hyaluronzuur polymer — interactief',W-16,H-12);

    angle+=0.006;
    requestAnimationFrame(draw);
  }
  draw();
})();
