// Standalone StayNest CMS Admin Application Module (100% Isolated Page at /admin)

import { appState } from './appState.js?v=99000_STANDALONE_CMS_ADMIN';
import { renderAdminDashboard } from './pages/adminDashboard.js?v=99000_STANDALONE_CMS_ADMIN';
import { getFormattedTimestamp, logAdminAuditAction } from './pages/auth.js?v=99000_STANDALONE_CMS_ADMIN';

export function isCmsAdminAuthenticated() {
  return sessionStorage.getItem('staynest_cms_admin_authenticated') === 'true';
}

export function setCmsAdminAuthenticated(status) {
  if (status) {
    sessionStorage.setItem('staynest_cms_admin_authenticated', 'true');
    appState.authenticateAdmin();
  } else {
    sessionStorage.removeItem('staynest_cms_admin_authenticated');
  }
}

export function renderStandaloneAdminApp() {
  const root = document.getElementById('admin-app-root');
  if (!root) return;

  root.innerHTML = '';

  if (isCmsAdminAuthenticated()) {
    renderAuthenticatedAdminDashboard(root);
  } else {
    renderAdminSignInScreen(root);
  }
}

function renderAdminSignInScreen(root) {
  const container = document.createElement('div');
  container.style.cssText = 'min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0f172a; padding: 2rem 1rem; box-sizing: border-box;';

  container.innerHTML = `
    <div style="max-width: 460px; width: 100%; background: #ffffff; border-radius: 24px; padding: 2.5rem 2.25rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); border: 1px solid #1e293b; color: #0f172a; position: relative;">
      
      <!-- Top Branding -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #818cf8; width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; box-shadow: 0 10px 25px rgba(0,0,0,0.25); border: 2px solid #334155;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <h1 style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 0.35rem 0; letter-spacing: -0.02em;">
          StayNest <span style="color: #6366f1;">CMS Admin</span>
        </h1>
        <p style="color: #64748b; font-size: 0.88rem; font-weight: 600; margin: 0;">
          System Administration Control Panel
        </p>
      </div>

      <!-- Alert Message Box -->
      <div id="admin-login-error-box" style="display: none; background: #fef2f2; border: 1.5px solid #fecaca; color: #991b1b; padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.85rem; font-weight: 700; margin-bottom: 1.25rem; line-height: 1.4; text-align: center;"></div>

      <!-- Login Form (Credentials COMPLETELY BLANK by default) -->
      <form id="standalone-admin-login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #334155; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em;">
            Admin Email Address *
          </label>
          <input type="email" id="standalone-admin-email" required autocomplete="off" value="" placeholder="Enter Admin Email" style="width: 100%; padding: 0.85rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.95rem; font-weight: 600; background: #f8fafc; color: #0f172a; box-sizing: border-box; transition: border-color 0.2s ease;">
        </div>

        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
            <label style="font-size: 0.82rem; font-weight: 800; color: #334155; text-transform: uppercase; letter-spacing: 0.04em;">
              Security Password *
            </label>
            <!-- NO FORGOT PASSWORD OPTION -->
          </div>
          <input type="password" id="standalone-admin-pass" required autocomplete="new-password" value="" placeholder="Enter Security Password" style="width: 100%; padding: 0.85rem 1rem; border: 1.5px solid #cbd5e1; border-radius: 12px; outline: none; font-size: 0.95rem; font-weight: 600; background: #f8fafc; color: #0f172a; box-sizing: border-box; transition: border-color 0.2s ease;">
        </div>

        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border: none; font-weight: 800; padding: 0.95rem; border-radius: 999px; cursor: pointer; font-size: 0.98rem; margin-top: 0.5rem; box-shadow: 0 4px 18px rgba(15, 23, 42, 0.4); display: flex; align-items: center; justify-content: center; gap: 8px;">
          ⚙️ Unlock StayNest CMS Admin Control Panel
        </button>
      </form>

      <!-- Bottom Info Footer -->
      <div style="margin-top: 1.75rem; padding-top: 1.25rem; border-top: 1px solid #f1f5f9; text-align: center;">
        <a href="/" target="_blank" style="color: #6366f1; font-weight: 700; font-size: 0.85rem; text-decoration: none; display: inline-flex; align-items: center; gap: 4px;">
          🌐 View Public Website in New Tab &rarr;
        </a>
      </div>

    </div>
  `;

  const form = container.querySelector('#standalone-admin-login-form');
  const emailInput = container.querySelector('#standalone-admin-email');
  const passInput = container.querySelector('#standalone-admin-pass');
  const errorBox = container.querySelector('#admin-login-error-box');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (emailInput.value || '').trim().toLowerCase();
    const password = (passInput.value || '').trim();

    errorBox.style.display = 'none';

    // Strict Admin Credential Validation
    const isExactMatch = (email === 'staynest11@gmail.com' && password === 'Staynest@187') ||
                         (email === 'admin@staynest.com' && (password === 'Staynest@187' || password === 'admin123' || password === 'password123'));

    if (isExactMatch) {
      setCmsAdminAuthenticated(true);
      logAdminAuditAction('Admin Sign In', `Admin Email: ${email}`, `Authenticated successfully at ${getFormattedTimestamp()}. Access granted.`);
      renderStandaloneAdminApp();
    } else {
      errorBox.innerHTML = `❌ Access Denied! Invalid Email Address or Security Password. Please enter valid credentials.`;
      errorBox.style.display = 'block';
      passInput.style.borderColor = '#ef4444';
      passInput.value = '';
      passInput.focus();
    }
  });

  root.appendChild(container);
}

function renderAuthenticatedAdminDashboard(root) {
  // Render Top Header Bar with Sign Out and Public Site Link
  const topHeader = document.createElement('div');
  topHeader.style.cssText = 'background: #0f172a; border-bottom: 1px solid #1e293b; padding: 0.85rem 1.5rem; display: flex; align-items: center; justify-content: space-between; color: white;';
  topHeader.innerHTML = `
    <div style="display: flex; align-items: center; gap: 12px;">
      <div style="background: #6366f1; color: white; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;">
        ⚙️
      </div>
      <div>
        <div style="font-weight: 800; font-size: 1.05rem; letter-spacing: -0.01em;">StayNest Standalone CMS Admin Panel</div>
        <div style="font-size: 0.76rem; color: #94a3b8; font-weight: 600;">Full System Control & Real-Time Data Synchronization</div>
      </div>
    </div>

    <div style="display: flex; align-items: center; gap: 12px;">
      <a href="/" target="_blank" style="background: #1e293b; color: #818cf8; border: 1px solid #334155; padding: 0.5rem 1rem; border-radius: 999px; text-decoration: none; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 6px;">
        🌐 View Public Website &nearr;
      </a>
      <button id="btn-admin-signout-top" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 999px; font-weight: 800; font-size: 0.82rem; cursor: pointer;">
        🔒 Sign Out
      </button>
    </div>
  `;

  topHeader.querySelector('#btn-admin-signout-top').addEventListener('click', () => {
    setCmsAdminAuthenticated(false);
    renderStandaloneAdminApp();
  });

  const dashboardContainer = document.createElement('div');
  dashboardContainer.style.cssText = 'flex: 1; background: #f8fafc; color: #0f172a;';

  root.appendChild(topHeader);
  root.appendChild(dashboardContainer);

  // Render full dashboard inside dashboardContainer
  appState.authenticateAdmin();
  renderAdminDashboard(dashboardContainer);
}

// Initial Boot on Load
function initStandaloneAdminApp() {
  renderStandaloneAdminApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initStandaloneAdminApp);
} else {
  initStandaloneAdminApp();
}
