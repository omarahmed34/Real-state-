import { state } from './state.js?v=1.1.2';
import { initLanguage } from './i18n.js';
import { showToast } from './utils.js';

import { renderLogin } from './login.js?v=1.1.2';
import { renderHome } from './home.js?v=1.1.4';
import { renderEmployeeDashboard } from './employeeDashboard.js';
import { renderAdminDashboard } from './adminDashboard.js?v=1.1.5';
import { renderProperties } from './properties.js?v=1.1.4';
import { renderPropertyDetails } from './propertyDetails.js?v=1.1.5';
import { renderMap } from './map.js?v=1.1.4';
import { renderProfile } from './profile.js';
import { renderFiles } from './files.js?v=1.1.2';
import { renderNavbar } from './navbar.js';

const routes = {
  '/login': renderLogin,
  '/': renderHome,
  '/dashboard': () => {
    const user = state.getCurrentUser();
    if (!user) return null;
    return (user.role === 'admin' || user.role === 'owner') ? renderAdminDashboard() : renderEmployeeDashboard();
  },
  '/properties': renderProperties,
  '/map': renderMap,
  '/files': renderFiles,
  '/profile': renderProfile,
  '/property/:id': renderPropertyDetails,
};

function handleRoute() {
  const app = document.getElementById('app');
  if (!app) return;

  try {
    let path = window.location.hash.slice(1) || '/';
    const user = state.getCurrentUser();

    // Force Login guard
    if (!user && path !== '/login') {
      window.location.hash = '/login';
      return;
    }

    // Match route
    let renderFn = routes[path];
    let params = null;
    if (!renderFn && path.startsWith('/property/')) {
      params = { id: path.split('/')[2] };
      renderFn = routes['/property/:id'];
    }
    if (!renderFn) renderFn = routes['/'];

    app.innerHTML = '';

    if (user && path !== '/login') {
      const nav = renderNavbar();
      if (nav) app.appendChild(nav);

      const main = document.createElement('main');
      main.className = 'main-content';
      const pageNode = renderFn(params);
      if (pageNode) {
        main.appendChild(pageNode);
        app.appendChild(main);
      } else {
        window.location.hash = '/login';
      }
    } else {
      const pageNode = renderFn(params);
      if (pageNode) app.appendChild(pageNode);
    }
  } catch (err) {
    console.error("Route Error:", err);
    if (window.onerror) window.onerror(err.message);
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  try {
    state.init();
    initLanguage();
    const savedTheme = localStorage.getItem('mapcom_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  } catch (err) {
    console.error("Init Error:", err);
    if (window.onerror) window.onerror(err.message);
  }
});
