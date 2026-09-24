// Main Application Entry Point & Client Router for StayNest (100% Instant Responsive SPA Routing & AI Chatbot Integration)

import { appState } from './appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderNavbar } from './components/navbar.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderFooter } from './components/footer.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderChatbot } from './components/chatbot.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

import { renderHomePage } from './pages/home.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderCityPage } from './pages/city.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderPGDetailsPage } from './pages/details.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderComparePage } from './pages/compare.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderWishlistPage } from './pages/wishlist.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderLoginPage, renderRegisterPage, renderOwnerRegisterPage, renderAdminLoginPage } from './pages/auth.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderOwnerDashboard } from './pages/ownerDashboard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderAdminDashboard } from './pages/adminDashboard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderAboutPage } from './pages/about.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderContactPage } from './pages/contact.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderApp(state) {
  const isAdminPage = state.currentPage === 'adminDashboard' || state.currentPage === 'admin-dashboard' || state.currentPage === 'admin-login' || state.currentPage === 'adminLogin' || state.currentPage === 'admin';
  const isAuthPage = state.currentPage === 'login' || state.currentPage === 'student-login' || state.currentPage === 'owner-login' || state.currentPage === 'register' || state.currentPage === 'owner-register';

  const navbarContainer = document.getElementById('navbar-container');
  const footerEl = document.querySelector('footer');
  const chatbotContainer = document.getElementById('chatbot-container') || document.getElementById('staynest-chatbot-widget');

  if (isAdminPage) {
    if (navbarContainer) navbarContainer.style.display = 'none';
    if (footerEl) footerEl.style.display = 'none';
    if (chatbotContainer) chatbotContainer.style.display = 'none';
  } else if (isAuthPage) {
    if (navbarContainer) navbarContainer.style.display = '';
    if (footerEl) footerEl.style.display = '';
    if (chatbotContainer) chatbotContainer.style.display = 'none';

    renderNavbar();
    renderFooter();
  } else {
    if (navbarContainer) navbarContainer.style.display = '';
    if (footerEl) footerEl.style.display = '';
    if (chatbotContainer) chatbotContainer.style.display = '';

    renderNavbar();
    renderFooter();
    renderChatbot();
  }

  switch (state.currentPage) {
    case 'home':
      renderHomePage();
      break;
    case 'search':
    case 'city':
      renderCityPage(state.searchQuery.city || 'Ahmedabad');
      break;
    case 'details':
      renderPGDetailsPage({ id: state.selectedPgId || state.selectedPGId });
      break;
    case 'compare':
      renderComparePage();
      break;
    case 'wishlist':
      renderWishlistPage();
      break;
    case 'login':
    case 'student-login':
    case 'studentLogin':
      renderLoginPage('student');
      break;
    case 'owner-login':
    case 'ownerLogin':
    case 'owner-register':
    case 'ownerRegister':
    case 'ownerDashboard':
    case 'owner-dashboard':
      renderHomePage();
      break;
    case 'admin-login':
    case 'adminLogin':
    case 'adminDashboard':
    case 'admin-dashboard':
    case 'admin':
      if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin.html') {
        window.location.href = '/admin';
      }
      break;
    case 'register':
      renderRegisterPage();
      break;
    case 'studentDashboard':
    case 'student-dashboard':
      renderHomePage();
      break;
    case 'about':
      renderAboutPage();
      break;
    case 'contact':
      renderContactPage();
      break;
    default:
      renderHomePage();
      break;
  }
}

export function handlePathOrHashRouting() {
  const path = window.location.pathname.toLowerCase();
  const rawHash = window.location.hash.replace('#', '').trim();
  const hashLower = rawHash.toLowerCase();

  // 1. Direct Admin route via path or hash: /admin, /admin-login, /admin/listings, #admin, #admin-dashboard -> Redirect to standalone /admin
  if (path.startsWith('/admin') || hashLower.startsWith('admin') || hashLower.includes('admin-dashboard')) {
    if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin.html') {
      window.location.href = '/admin';
    }
    return;
  }

  // 2. Direct Owner route via path or hash -> redirect to home page
  if (path.startsWith('/owner') || hashLower.startsWith('owner') || hashLower.includes('owner-dashboard')) {
    if (appState.getState().currentPage !== 'home') {
      appState.setPage('home');
    }
    return;
  }

  if (rawHash) {
    // City routes: #city=Mumbai, #city/mumbai, #mumbai
    if (hashLower.startsWith('city=')) {
      const city = decodeURIComponent(rawHash.replace(/city=/i, ''));
      if (city) appState.updateSearchQuery({ city: city, area: '', college: '', keyword: '' });
    } else if (hashLower.startsWith('city/')) {
      const city = decodeURIComponent(rawHash.replace(/city\//i, ''));
      if (city) appState.updateSearchQuery({ city: city, area: '', college: '', keyword: '' });
    } else if (['ahmedabad', 'mumbai', 'bengaluru', 'delhi', 'pune', 'jaipur'].includes(hashLower)) {
      const cityName = rawHash.charAt(0).toUpperCase() + rawHash.slice(1).toLowerCase();
      appState.updateSearchQuery({ city: cityName, area: '', college: '', keyword: '' });
    } 
    // Details routes: #pg=id, #detail/id, #details/id, #details?id=id
    else if (hashLower.startsWith('pg=')) {
      const pgId = decodeURIComponent(rawHash.substring(3));
      if (pgId) appState.setPage('details', pgId);
    } else if (hashLower.startsWith('detail/')) {
      const pgId = decodeURIComponent(rawHash.substring(7));
      if (pgId) appState.setPage('details', pgId);
    } else if (hashLower.startsWith('details/')) {
      const pgId = decodeURIComponent(rawHash.substring(8));
      if (pgId) appState.setPage('details', pgId);
    } else if (hashLower.startsWith('details?id=')) {
      const pgId = decodeURIComponent(rawHash.substring(11));
      if (pgId) appState.setPage('details', pgId);
    }
  }
}

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  appState.subscribe(renderApp);

  window.addEventListener('hashchange', handlePathOrHashRouting);
  window.addEventListener('popstate', handlePathOrHashRouting);

  handlePathOrHashRouting();

  if (appState.getState().currentPage === 'home' && !window.location.hash && !window.location.pathname.startsWith('/admin') && !window.location.pathname.startsWith('/owner')) {
    renderApp(appState.getState());
  }
});
