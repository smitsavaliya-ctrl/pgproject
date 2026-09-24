// Fully Interactive & Stateful Student Dashboard Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createPGCard } from '../components/pgCard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderStudentDashboard() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  let activeTab = 'overview'; // 'overview' | 'wishlist' | 'compare' | 'enquiries' | 'visits' | 'notifications' | 'profile'

  const container = document.createElement('div');
  container.className = 'dashboard-layout';
  container.style.cssText = 'display: grid; grid-template-columns: 270px 1fr; min-height: 90vh; background: #f8fafc;';

  function renderTabContent() {
    const main = container.querySelector('#student-main-content');
    if (!main) return;

    if (activeTab === 'overview') {
      main.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">Student Portal Overview</h1>
            <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Track your saved PGs, booked site visits, and direct owner enquiries.</p>
          </div>
          <button id="btn-dash-find" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 14px rgba(99,102,241,0.3);">
            🔍 Find More PGs
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #ffe4e6; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">❤️</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${state.wishlist.length}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Saved Wishlist PGs</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #eef2ff; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">📩</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">2</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Active Enquiries</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #ecfdf5; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🗓️</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">1</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Upcoming Visit</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #fef3c7; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🔔</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">3</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Notifications</span>
            </div>
          </div>
        </div>

        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">Recent Enquiries & Site Visits</h3>
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 0.75rem;">Accommodation</th>
                  <th style="padding: 0.75rem;">Location</th>
                  <th style="padding: 0.75rem;">Date Sent</th>
                  <th style="padding: 0.75rem;">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem;">
                  <td style="padding: 0.75rem;"><strong style="color: #0f172a;">Urban Nest Luxury PG</strong></td>
                  <td style="padding: 0.75rem; color: #475569;">Navrangpura, Ahmedabad</td>
                  <td style="padding: 0.75rem; color: #64748b;">Yesterday</td>
                  <td style="padding: 0.75rem;"><span style="background: #10b981; color: white; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Owner Callback Scheduled</span></td>
                </tr>
                <tr style="font-size: 0.9rem;">
                  <td style="padding: 0.75rem;"><strong style="color: #0f172a;">Scholar Stay Premium PG</strong></td>
                  <td style="padding: 0.75rem; color: #475569;">Thaltej, Ahmedabad</td>
                  <td style="padding: 0.75rem; color: #64748b;">3 days ago</td>
                  <td style="padding: 0.75rem;"><span style="background: #6366f1; color: white; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Visit Scheduled (Tomorrow 4 PM)</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin-bottom: 1.25rem;">Recommended Stays For You</h3>
          <div id="dash-rec-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.5rem;"></div>
        </div>
      `;

      const recGrid = main.querySelector('#dash-rec-grid');
      if (recGrid) {
        ACCOMMODATIONS.slice(0, 3).forEach(pg => recGrid.appendChild(createPGCard(pg)));
      }

      main.querySelector('#btn-dash-find')?.addEventListener('click', () => appState.setPage('search'));

    } else if (activeTab === 'wishlist') {
      appState.setPage('wishlist');
    } else if (activeTab === 'compare') {
      appState.setPage('compare');
    } else if (activeTab === 'enquiries') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">📩 My Active Enquiries (2)</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">Direct enquiries sent to PG owners.</p>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div style="padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h4 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px 0;">Urban Nest Luxury PG</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Requested Single Sharing Room • Move-in date: 15 Aug 2026</p>
              <span style="background: #10b981; color: white; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Callback Confirmed</span>
            </div>
            <div style="padding: 1.25rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h4 style="font-size: 1.1rem; font-weight: 800; margin: 0 0 4px 0;">Scholar Stay Premium PG</h4>
              <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Requested Double Sharing Room • Move-in date: 20 Aug 2026</p>
              <span style="background: #6366f1; color: white; padding: 4px 10px; border-radius: 999px; font-weight: 700; font-size: 0.75rem;">Site Visit Scheduled</span>
            </div>
          </div>
        </div>
      `;
    } else if (activeTab === 'visits') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">🗓️ Scheduled Site Visits (1)</h2>
          <div style="padding: 1.25rem; background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 14px; margin-top: 1rem;">
            <h4 style="font-size: 1.1rem; font-weight: 800; color: #4338ca; margin: 0 0 4px 0;">Scholar Stay Premium PG</h4>
            <p style="font-size: 0.88rem; color: #3730a3; margin: 0;">Scheduled for tomorrow at 4:00 PM • Contact Warden: +91 98765 12345</p>
          </div>
        </div>
      `;
    } else if (activeTab === 'notifications') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">🔔 Student Notifications (3)</h2>
          <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem;">
            <div style="padding: 1rem; background: #eef2ff; border-radius: 10px; font-size: 0.88rem;">🔔 Site visit confirmed for Scholar Stay PG tomorrow at 4:00 PM.</div>
            <div style="padding: 1rem; background: #f8fafc; border-radius: 10px; font-size: 0.88rem;">❤️ Saved 2 new PGs to your Wishlist.</div>
            <div style="padding: 1rem; background: #f8fafc; border-radius: 10px; font-size: 0.88rem;">🎉 Welcome to StayNest! Start exploring top PGs near your college.</div>
          </div>
        </div>
      `;
    } else if (activeTab === 'profile') {
      main.innerHTML = `
        <div style="max-width: 580px; background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; margin: 0 auto;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">👤 Student Profile Settings</h2>
          <form id="form-student-profile" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.25rem;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Full Name</label>
              <input type="text" value="${state.userProfile.name}" style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none;">
            </div>
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Contact Phone</label>
              <input type="tel" value="${state.userProfile.phone}" style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none;">
            </div>
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Email Address</label>
              <input type="email" value="${state.userProfile.email}" style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none;">
            </div>
            <button type="submit" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.8rem; border-radius: 999px; cursor: pointer;">
              Save Profile
            </button>
          </form>
        </div>
      `;

      main.querySelector('#form-student-profile')?.addEventListener('submit', (e) => {
        e.preventDefault();
        appState.showToast('👤 Student profile saved successfully!');
      });
    }
  }

  function updateSidebarNav() {
    container.querySelectorAll('.sidebar-nav-item').forEach(item => {
      const tabKey = item.getAttribute('data-tab-key');
      if (tabKey === activeTab) {
        item.style.background = '#6366f1';
        item.style.color = 'white';
        item.style.fontWeight = '800';
      } else {
        item.style.background = 'transparent';
        item.style.color = '#cbd5e1';
        item.style.fontWeight = '600';
      }
    });
  }

  container.innerHTML = `
    <aside style="background: #0f172a; color: white; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.35rem; border-right: 1px solid #1e293b;">
      <div style="padding: 0 0.5rem 1.5rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
        <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #818cf8; font-weight: 800;">Student Portal</span>
        <h3 style="color: white; font-size: 1.15rem; font-weight: 800; margin: 4px 0 0 0;">${state.userProfile.name}</h3>
      </div>

      <div class="sidebar-nav-item" data-tab-key="overview" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">📊 Overview</div>
      <div class="sidebar-nav-item" data-tab-key="wishlist" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">❤️ My Wishlist (${state.wishlist.length})</div>
      <div class="sidebar-nav-item" data-tab-key="compare" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">⚖️ Compare List (${state.compareList.length})</div>
      <div class="sidebar-nav-item" data-tab-key="enquiries" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">📩 Active Enquiries (2)</div>
      <div class="sidebar-nav-item" data-tab-key="visits" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">🗓️ Scheduled Visits (1)</div>
      <div class="sidebar-nav-item" data-tab-key="notifications" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">🔔 Notifications (3)</div>
      <div class="sidebar-nav-item" data-tab-key="profile" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">👤 Profile Settings</div>
      <div id="student-logout" style="margin-top: auto; padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; color: #ef4444; font-weight: 700;">🚪 Logout</div>
    </aside>

    <main id="student-main-content" style="padding: 2rem 2.5rem; overflow-y: auto;">
    </main>
  `;

  container.querySelectorAll('[data-tab-key]').forEach(item => {
    item.addEventListener('click', () => {
      activeTab = item.getAttribute('data-tab-key');
      updateSidebarNav();
      renderTabContent();
    });
  });

  container.querySelector('#student-logout')?.addEventListener('click', () => {
    appState.setUserRole('student');
    appState.showToast('Logged out of Student Portal.');
    appState.setPage('login');
  });

  updateSidebarNav();
  root.innerHTML = '';
  root.appendChild(container);
  renderTabContent();
}
