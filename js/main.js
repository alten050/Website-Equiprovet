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