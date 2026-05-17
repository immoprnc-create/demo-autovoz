'use strict';

// Header scroll effect
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    // Close mobile menu if open
    mobileMenu.classList.remove('open');
  });
});

// Mobile menu
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu on outside click
document.addEventListener('click', e => {
  if (!header.contains(e.target)) mobileMenu.classList.remove('open');
});

// Counter animation
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(ease * target);
    el.textContent = value >= 1000 ? value.toLocaleString('ru-RU') : value;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
let countersStarted = false;

const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    statNums.forEach(animateCounter);
    statsObserver.disconnect();
  }
}, { threshold: 0.4 });

const statsSection = document.querySelector('.stats');
if (statsSection) statsObserver.observe(statsSection);

// Toast
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast ${type} show`;
  setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

// Form submit
const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', e => {
    e.preventDefault();

    const btnText = orderForm.querySelector('.btn-text');
    const btnLoading = orderForm.querySelector('.btn-loading');
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    // Simulate sending (replace with real API call later)
    setTimeout(() => {
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      orderForm.reset();
      showToast('Заявка отправлена! Менеджер перезвонит в течение 15 минут.');
    }, 1200);
  });
}

// Animate dots along route paths
(function animateRouteDots() {
  const routes = [
    { path: '.rl1', dot: '.rdot1', delay: 200,  dur: 3000 },
    { path: '.rl2', dot: '.rdot2', delay: 700,  dur: 2200 },
    { path: '.rl3', dot: '.rdot3', delay: 1100, dur: 2600 },
    { path: '.rl4', dot: '.rdot4', delay: 1500, dur: 3200 },
    { path: '.rl5', dot: '.rdot5', delay: 1900, dur: 2800 },
  ];

  routes.forEach(({ path, dot, delay, dur }) => {
    const pathEl = document.querySelector(path);
    const dotEl  = document.querySelector(dot);
    if (!pathEl || !dotEl) return;

    const len = pathEl.getTotalLength ? pathEl.getTotalLength() : 300;

    function runDot() {
      dotEl.classList.add('visible');
      let start = null;
      function step(ts) {
        if (!start) start = ts;
        const t = Math.min((ts - start) / dur, 1);
        const pt = pathEl.getPointAtLength(t * len);
        dotEl.setAttribute('cx', pt.x);
        dotEl.setAttribute('cy', pt.y);
        if (t < 1) requestAnimationFrame(step);
        else {
          dotEl.classList.remove('visible');
          setTimeout(runDot, 800);
        }
      }
      requestAnimationFrame(step);
    }

    setTimeout(runDot, delay + 400);
  });
})();

// Fade-in animation on scroll
const fadeEls = document.querySelectorAll('.why-card, .review-card, .step');
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  fadeObserver.observe(el);
});
