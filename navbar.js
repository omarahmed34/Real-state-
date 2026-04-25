import { state } from './state.js';
import { t, setLanguage } from './i18n.js';

export function renderNavbar() {
  const header = document.createElement('header');
  header.className = 'navbar';

  const user = state.getCurrentUser();
  const currentLang = state.get('language') || 'en';

  // Extract initials
  const initials = user ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const avatarHtml = (user && user.profilePic)
    ? `<img src="${user.profilePic}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
    : initials;

  header.innerHTML = `
    <div class="container">
      <a href="#/" class="navbar-brand" id="nav-brand" style="display:flex; align-items:center; min-width: 200px;">
        <svg width=\"170\" height=\"70\" viewBox=\"0 0 400 200\" xmlns=\"http://www.w3.org/2000/svg\">
          <defs>
            <linearGradient id=\"metalGrad\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">
              <stop offset=\"0%\" style=\"stop-color:#ffffff;stop-opacity:1\" />
              <stop offset=\"50%\" style=\"stop-color:#a0a0a0;stop-opacity:1\" />
              <stop offset=\"100%\" style=\"stop-color:#707070;stop-opacity:1\" />
            </linearGradient>
            <filter id=\"depth3d\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\">
              <feGaussianBlur in=\"SourceAlpha\" stdDeviation=\"2\" result=\"blur\" />
              <feSpecularLighting in=\"blur\" surfaceScale=\"6\" specularConstant=\"1.2\" specularExponent=\"30\" lighting-color=\"#ffffff\" result=\"specOut\">
                <fePointLight x=\"-5000\" y=\"-10000\" z=\"20000\" />
              </feSpecularLighting>
              <feComposite in=\"specOut\" in2=\"SourceAlpha\" operator=\"in\" result=\"specOut\" />
              <feComposite in=\"SourceGraphic\" in2=\"specOut\" operator=\"arithmetic\" k1=\"0\" k2=\"1\" k3=\"1\" k4=\"0\" result=\"litGraphic\" />
              <feDropShadow dx=\"4\" dy=\"4\" stdDeviation=\"3\" flood-opacity=\"0.4\" />
            </filter>
          </defs>
          <g filter=\"url(#depth3d)\">
            <text x=\"135\" y=\"100\" text-anchor=\"middle\" style=\"font: bold 90px sans-serif; fill: url(#metalGrad);\">C</text>
            <path transform=\"translate(165, 20) scale(0.95)\" d=\"M35 5 C15 5 0 20 0 35 C0 60 35 90 35 90 C35 90 70 60 70 35 C70 20 55 5 35 5 ZM 35 50 C27 50 20 43 20 35 C20 27 27 20 35 20 C43 20 50 27 50 35 C50 43 43 50 35 50 Z\" fill=\"url(#metalGrad)\"/>
            <text x=\"265\" y=\"100\" text-anchor=\"middle\" style=\"font: bold 90px sans-serif; fill: url(#metalGrad);\">M</text>
            <text x=\"200\" y=\"160\" text-anchor=\"middle\" style=\"font: 900 16px serif; fill: #ffffff; letter-spacing: 1px; text-transform: uppercase;\">COMMERCIAL REAL ESTATE</text>
            <text x=\"200\" y=\"185\" text-anchor=\"middle\" style=\"font: 900 16px serif; fill: #ffffff; letter-spacing: 1px; text-transform: uppercase;\">INTERNATIONAL</text>
          </g>
        </svg>
       </a>
      
      <button id="mobile-menu-btn" class="btn-icon mobile-only" style="margin-left: auto; margin-right: 1rem;">
        <i class="fa-solid fa-bars"></i>
      </button>
      
      <nav class="navbar-nav">
        <a href="#/" class="nav-link">${t('home')}</a>
        <a href="#/dashboard" class="nav-link">${t('dashboard')}</a>
        <a href="#/properties" class="nav-link">${t('properties')}</a>
        <a href="#/map" class="nav-link">${t('map')}</a>
        <a href="#/files" class="nav-link">Files</a>
        <a href="#/profile" class="nav-link">${t('profile')}</a>
      </nav>
      
      <div class="navbar-user">
        <button id="lang-toggle" class="btn-icon" style="font-size: 0.9rem; font-weight: bold; width: 2.5rem;">
          ${currentLang === 'en' ? 'عربي' : 'EN'}
        </button>
        <button id="theme-toggle" class="btn-icon">
          <i class="fa-solid fa-moon"></i>
        </button>
        <div class="user-profile" style="cursor: pointer; position: relative;" id="profile-btn" title="Go to Profile">
          <div class="avatar">${avatarHtml}</div>
          <span style="font-weight: 500; font-size: 0.9rem;">${user ? user.name : ''}</span>
        </div>
        <button id="logout-btn" class="btn-icon" title="${t('logout')}">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </div>
    </div>
  `;

  // Attach events
  header.querySelectorAll('.nav-link, .navbar-brand').forEach(link => {
    link.addEventListener('click', (e) => {
      // Close mobile menu on click
      const nav = header.querySelector('.navbar-nav');
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileBtn = header.querySelector('#mobile-menu-btn');
  const navMenu = header.querySelector('.navbar-nav');
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Active state highlighting
  const currentPath = window.location.hash || '#/';
  header.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  const themeToggle = header.querySelector('#theme-toggle');
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('mapcom_theme', next);
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
  updateThemeIcon();

  header.querySelector('#logout-btn').addEventListener('click', () => {
    state.logout();
    window.location.hash = '/login';
  });

  const langToggle = header.querySelector('#lang-toggle');
  langToggle.addEventListener('click', () => {
    const nextLang = state.get('language') === 'en' ? 'ar' : 'en';
    setLanguage(nextLang);
  });

  const profileBtn = header.querySelector('#profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      window.location.hash = '/profile';
    });
  }

  return header;
}
