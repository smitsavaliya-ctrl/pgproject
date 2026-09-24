// Navbar Header Component for StayNest (Lock Icons for Unauthenticated Roles & Instant Sign Out)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { showAddPropertyModal, showOwnerAccessRequiredModal, showAdminAccessRequiredModal, showStudentLoginRequiredModal } from './modals.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderNavbar() {
  let container = document.getElementById('navbar-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'navbar-container';
    const appRoot = document.getElementById('app-root');
    if (appRoot) {
      document.body.insertBefore(container, appRoot);
    } else {
      document.body.prepend(container);
    }
  }

  const state = appState.getState();
  const activePage = state.currentPage;
  const wishlistCount = (state.wishlist || []).length;
  const compareCount = (state.compareList || []).length;
  const userRole = state.userRole; // 'student' | 'owner' | 'admin'

  const showDashboardLink = userRole === 'owner' || userRole === 'admin';

    const themeCfg = appState.getThemeConfig();
  const announcementHTML = (themeCfg && themeCfg.announcementEnabled) ? `
    <div id="global-announcement-bar" style="background: linear-gradient(135deg, ${themeCfg.primaryColor || '#6366f1'} 0%, ${themeCfg.secondaryColor || '#7c3aed'} 100%); color: white; text-align: center; padding: 6px 1rem; font-size: 0.82rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; z-index: 1001; position: relative;">
      <span>${themeCfg.announcementText || '🎉 Welcome to StayNest!'}</span>
    </div>
  ` : '';

  const isLoggedIn = state.isAuthenticatedStudent || state.isAuthenticatedOwner || state.isAuthenticatedAdmin;

  container.innerHTML = `
    ${announcementHTML}
    <header class="navbar" style="background: white; border-bottom: 1px solid #e2e8f0; position: sticky; top: 0; z-index: 1000; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
      <div class="container navbar-container" style="display: flex; justify-content: space-between; align-items: center; height: 72px; flex-wrap: nowrap; gap: 1rem;">
        
        <!-- Logo with Vibrant Purple Gradient Icon & Tilt Effect -->
        <a href="#" id="nav-logo" class="brand-logo" style="display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 1.4rem; color: #0f172a; text-decoration: none; flex-shrink: 0; white-space: nowrap;">
          <div class="brand-logo-icon" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); cursor: pointer;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span>Stay<span style="color: #6366f1;">Nest</span></span>
        </a>

        <!-- Main Nav Links -->
        <ul class="nav-links" id="nav-links" style="display: flex; align-items: center; gap: 1.25rem; list-style: none; margin: 0; padding: 0; flex-wrap: nowrap; white-space: nowrap;">
          <li>
            <a href="#" class="nav-link ${activePage === 'search' || activePage === 'city' ? 'active' : ''}" data-page="search" style="padding: 0.45rem 1.1rem; border-radius: 999px; font-weight: 700; font-size: 0.92rem; background: ${activePage === 'search' || activePage === 'city' ? '#eef2ff' : 'transparent'}; color: ${activePage === 'search' || activePage === 'city' ? '#6366f1' : '#475569'}; transition: all 0.2s; white-space: nowrap;">
              Find Hostel
            </a>
          </li>
          <li>
            <a href="#" class="nav-link ${activePage === 'compare' ? 'active' : ''}" data-page="compare" style="color: #475569; font-weight: 600; font-size: 0.92rem; white-space: nowrap;">
              Compare ${compareCount > 0 ? `<span style="background: #6366f1; color: white; border-radius: 999px; padding: 1px 6px; font-size: 0.72rem; font-weight: 800;">${compareCount}</span>` : ''}
            </a>
          </li>
          <li>
            <a href="#" class="nav-link ${activePage === 'wishlist' ? 'active' : ''}" data-page="wishlist" style="color: #475569; font-weight: 600; font-size: 0.92rem; white-space: nowrap;">
              Wishlist ${wishlistCount > 0 ? `<span style="background: #ec4899; color: white; border-radius: 999px; padding: 1px 6px; font-size: 0.72rem; font-weight: 800;">${wishlistCount}</span>` : ''}
            </a>
          </li>
          <li><a href="#" class="nav-link ${activePage === 'about' ? 'active' : ''}" data-page="about" style="color: #475569; font-weight: 600; font-size: 0.92rem; white-space: nowrap;">About</a></li>
          <li><a href="#" class="nav-link ${activePage === 'contact' ? 'active' : ''}" data-page="contact" style="color: #475569; font-weight: 600; font-size: 0.92rem; white-space: nowrap;">Contact</a></li>
        </ul>

        <!-- Right Side Actions & Role Switcher -->
        <div class="nav-actions" style="display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; white-space: nowrap;">
          
          ${isLoggedIn ? `
            <div class="role-selector-wrapper">
              <select id="role-select" title="Switch User Role" style="padding: 0.4rem 0.75rem; border-radius: 999px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 0.8rem; background: #f8fafc; color: #334155; cursor: pointer; white-space: nowrap;">
                <option value="student" ${userRole === 'student' ? 'selected' : ''}>🎓 Student Mode</option>
                <option value="admin" ${userRole === 'admin' ? 'selected' : ''}>${state.isAuthenticatedAdmin ? '🟢 ⚙️ System Admin' : '🔒 ⚙️ Admin (Key Req.)'}</option>
              </select>
            </div>
            ${userRole === 'admin' ? `
              <button id="nav-dashboard-link" style="color: #6366f1; font-weight: 800; font-size: 0.85rem; background: #f5f3ff; padding: 0.45rem 1rem; border-radius: 999px; border: 1px solid #ddd6fe; cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 4px;">
                📊 Admin Dashboard
              </button>
            ` : ''}
            <button id="btn-nav-logout" title="Sign Out" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 0.45rem 0.85rem; border-radius: 999px; font-weight: 800; font-size: 0.8rem; cursor: pointer; white-space: nowrap;">
              🚪 Logout
            </button>
          ` : `
            <button id="btn-nav-login" style="background: transparent; border: 1px solid #cbd5e1; color: #334155; padding: 0.5rem 1.1rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; white-space: nowrap;">Login</button>
            <button id="btn-nav-register" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; padding: 0.55rem 1.35rem; border-radius: 999px; font-weight: 800; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3); white-space: nowrap;">Sign up free</button>
          `}
        </div>
      </div>
    </header>
  `;

  container.querySelector('#nav-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.setPage('home');
  });

  container.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      appState.setPage(page);
    });
  });

  container.querySelector('#role-select')?.addEventListener('change', (e) => {
    const selectedMode = e.target.value;
    const curState = appState.getState();

    if (selectedMode === 'admin') {
      if (curState.isAuthenticatedAdmin) {
        appState.setUserRole('admin');
        appState.setPage('adminDashboard');
      } else {
        window.open('/admin', '_blank');
      }
    } else {
      if (curState.isAuthenticatedStudent) {
        appState.setUserRole('student');
        appState.setPage('home');
      } else {
        appState.setPage('student-login');
      }
    }
  });

  container.querySelector('#nav-dashboard-link')?.addEventListener('click', () => {
    if (userRole === 'admin') {
      window.open('/admin', '_blank');
    }
  });

  container.querySelector('#btn-nav-logout')?.addEventListener('click', () => {
    appState.logoutUser();
    appState.showToast('Logged out successfully.');
    appState.setPage('login');
  });

  container.querySelector('#btn-nav-login')?.addEventListener('click', () => {
    appState.setPage('login');
  });

  container.querySelector('#btn-nav-register')?.addEventListener('click', () => {
    appState.setPage('register');
  });

  container.querySelector('#btn-list-property-gold')?.addEventListener('click', (e) => {
    e.preventDefault();
    showAddPropertyModal();
  });
}