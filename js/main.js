// THE CPP GRIND — main.js

// ============================================
// COOKIE / LOCALSTORAGE NOTICE
// ============================================
function initCookieNotice() {
  if (localStorage.getItem('cookie-ok')) return;
  const notice = document.createElement('div');
  notice.className = 'cookie-notice';
  notice.innerHTML = `
    <span>This site saves your progress locally. Keep cookies/localStorage enabled to preserve it. <a href="pages/about.html#privacy" style="color:var(--blue)">Learn more</a></span>
    <button onclick="acceptCookies()">Got it</button>
  `;
  document.body.appendChild(notice);
}
function acceptCookies() {
  localStorage.setItem('cookie-ok', '1');
  document.querySelector('.cookie-notice')?.remove();
}

// ============================================
// PROGRESS TRACKER
// All checkboxes with class .progress-check
// Keyed by article URL + element index
// ============================================
function initProgressTracker() {
  const checks = document.querySelectorAll('.progress-check');
  const pageKey = location.pathname;
  checks.forEach((el, i) => {
    const key = `progress:${pageKey}:${i}`;
    if (localStorage.getItem(key) === '1') el.classList.add('done');
    el.addEventListener('click', () => {
      el.classList.toggle('done');
      localStorage.setItem(key, el.classList.contains('done') ? '1' : '0');
    });
  });
}

// ============================================
// SPOILER TOGGLES
// ============================================
function initSpoilers() {
  document.querySelectorAll('.spoiler-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.spoiler').classList.toggle('open');
    });
  });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('mobile-open');
  });
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      nav.classList.remove('mobile-open');
    }
  });
}

// ============================================
// NAV DROPDOWNS
// ============================================
function initDropdowns() {
  const groups = document.querySelectorAll('.nav-group');
  groups.forEach(group => {
    const btn = group.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = group.classList.contains('open');
      groups.forEach(g => g.classList.remove('open'));
      if (!wasOpen) group.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    groups.forEach(g => g.classList.remove('open'));
  });
}

// ============================================
// THEME TOGGLE (dark default, optional light)
// - Stores explicit user choice in localStorage
// - If no choice, follows OS preference
// ============================================
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'light') root.setAttribute('data-theme', 'light');
  else root.removeAttribute('data-theme');

  // Keep all toggles in sync across pages
  document.querySelectorAll('.theme-toggle[role="switch"]').forEach(btn => {
    btn.setAttribute('aria-checked', theme === 'light' ? 'true' : 'false');
  });
}

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll('.theme-toggle[role="switch"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  });

  // If user hasn't chosen a theme, react to OS changes
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)');
  if (!mq) return;
  mq.addEventListener?.('change', () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return;
    applyTheme(getPreferredTheme());
  });
}

// ============================================
// DAILY SEED (same puzzle for everyone each day)
// ============================================
function getDailySeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}
function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}
window.getDailyItem = function(arr) {
  const rng = seededRandom(getDailySeed());
  return arr[Math.floor(rng() * arr.length)];
};

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initCookieNotice();
  initThemeToggle();
  initProgressTracker();
  initSpoilers();
  initMobileMenu();
  initDropdowns();
});
