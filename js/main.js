// ── Scroll progress bar ──
(function() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.transform = 'scaleX(' + Math.min(scrolled, 1) + ')';
  }
  window.addEventListener('scroll', update, { passive: true });
})();

// ── Reveal animations (IntersectionObserver) ──
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-group, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
})();

// ── FAQ accordion ──
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const answer = item.querySelector('.faq-answer');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-answer').style.maxHeight = '0';
      o.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Cookie banner ──
(function() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  try {
    if (!localStorage.getItem('cookie-consent')) {
      setTimeout(() => banner.classList.add('visible'), 3000);
    }
  } catch(e) {
    setTimeout(() => banner.classList.add('visible'), 3000);
  }
})();

function handleCookie(decision) {
  try { localStorage.setItem('cookie-consent', decision); } catch(e) {}
  const banner = document.getElementById('cookie-banner');
  if (banner) banner.classList.remove('visible');
}

// ── Privacy modal ──
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

// ── Sticky CTA ──
(function() {
  const cta = document.getElementById('sticky-cta');
  if (!cta) return;
  window.addEventListener('scroll', () => {
    cta.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
})();

// ── Active nav link ──
(function() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href !== '/' && path.startsWith(href.replace(/\.html$/, ''))) {
      a.classList.add('nav-active');
    } else if (href === '/' && path === '/') {
      a.classList.add('nav-active');
    }
  });
})();

// ── View Transitions fallback ──
if (!document.startViewTransition) {
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel')) return;
    a.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.transition = 'opacity .2s ease';
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
}

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js'));
}
