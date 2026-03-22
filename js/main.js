/* ═══════════════════════════════════════════════════════════════
   SACRIFICE OF ETERNIS — main.js
   - Sticky nav (scroll + mobile toggle)
   - Scroll-triggered fade-in animations
   - Kit toggle (controlled by body class)
═══════════════════════════════════════════════════════════════ */

/* ── Nav: scroll behavior ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Nav: mobile toggle ── */
const navToggle = document.querySelector('.nav-toggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('mobile-open');
  });
  // Close on link click
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('mobile-open'));
  });
}

/* ── Fade-up on scroll ── */
const fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.fade-up');
        siblings.forEach((el, i) => {
          setTimeout(() => el.classList.add('visible'), i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));
} else {
  // Fallback: show all immediately
  fadeEls.forEach(el => el.classList.add('visible'));
}

/* ── Active nav link based on scroll position ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sTop = section.offsetTop - 120;
    if (window.scrollY >= sTop) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--gold)'
      : '';
  });
}, { passive: true });

/* ── Kit activation (for admin use) ──
   The kit is controlled by the class on <body>:
     body.kit-oculto → buttons hidden (default)
     body.kit-ativo  → buttons visible
   To activate, change the class in the HTML file.
   This JS adds a hidden keyboard shortcut for convenience:
   Press Ctrl+Shift+K to toggle (useful during testing).
── */
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && e.key === 'K') {
    const body = document.body;
    if (body.classList.contains('kit-oculto')) {
      body.classList.replace('kit-oculto', 'kit-ativo');
      console.log('[Kit] Ativado ✓');
    } else {
      body.classList.replace('kit-ativo', 'kit-oculto');
      console.log('[Kit] Desativado');
    }
  }
});

/* ── Smooth anchor scroll with offset for fixed nav ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Back to top on logo click ── */
document.querySelector('.nav-logo')?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
