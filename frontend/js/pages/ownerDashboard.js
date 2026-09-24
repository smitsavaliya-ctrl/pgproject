// Fully Interactive & Stateful PG Owner Dashboard with Live Recovery & Recycle Bin

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderOwnerDashboard() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();

  // Security Check: Restrict student role away from Owner Dashboard
  if (state.userRole === 'student' || !state.isAuthenticatedOwner) {
    appState.showToast('🔒 Please Sign In or Register as PG Owner to access Owner features.');
    appState.setPage('owner-register');
    return;
  }

  // Persistent Owner Profile State
  if (!window.staynestOwnerProfile) {
    window.staynestOwnerProfile = {
      name: 'Rajesh Patel',
      phone: '+91 98765 43210',
      email: 'rajesh.owner@staynest.com',
      company: 'Patel Accommodation Services Pvt Ltd'
    };
  }

  // Global Deleted Properties Storage for Undo/Recovery
  if (!window.staynestDeletedProperties) {
    window.staynestDeletedProperties = [];
  }

  let activeTab = 'overview'; // 'overview' | 'properties' | 'add' | 'rooms' | 'enquiries' | 'trash' | 'profile'
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 10;

  // Initialize status and vacantRooms for all 1,200 accommodations if not set
  ACCOMMODATIONS.forEach((p, idx) => {
    if (!p.status) {
      p.status = idx % 9 === 0 ? 'Inactive' : 'Active & Verified';
    }
    if (p.vacantRooms === undefined) {
      p.vacantRooms = (idx % 6) + 2;
    }
  });

  function formatFullTimestamp(isoString) {
    if (!isoString) return 'Just now';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    return `${dateStr}, ${timeStr} IST`;
  }

  const container = document.createElement('div');
  container.className = 'dashboard-layout';
  container.style.cssText = 'display: grid; grid-template-columns: 270px 1fr; min-height: 90vh; background: #f8fafc;';

  function updateSidebarNav() {
    const navItems = container.querySelectorAll('.db-nav-item');
    navItems.forEach(item => {
      const tab = item.getAttribute('data-tab');
      if (tab === activeTab) {
        item.style.background = '#eef2ff';
        item.style.color = '#6366f1';
        item.style.fontWeight = '800';
      } else {
        item.style.background = 'transparent';
        item.style.color = '#475569';
        item.style.fontWeight = '600';
      }
    });

    const trashBadge = container.querySelector('#sidebar-trash-badge');
    if (trashBadge) {
      trashBadge.textContent = window.staynestDeletedProperties.length;
      trashBadge.style.display = window.staynestDeletedProperties.length > 0 ? 'inline-block' : 'none';
    }
  }

  function openEditModal(property) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';

    modal.innerHTML = `
      <div style="background: white; padding: 2rem; border-radius: 20px; max-width: 580px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 1px solid #e2e8f0; position: relative;">
        <button id="btn-close-edit-modal" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; font-weight: 800; cursor: pointer;">✕</button>

        <h3 style="font-size: 1.35rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">✏️ Edit Property: ${property.name}</h3>
        <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 1.25rem;">Update rent, vacant beds, and verification status.</p>

        <form id="form-edit-property" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Property Name</label>
            <input type="text" id="edit-name" value="${property.name}" required style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Monthly Rent (₹)</label>
              <input type="number" id="edit-rent" value="${property.rent || 7500}" required style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Vacant Beds</label>
              <input type="number" id="edit-vacant" value="${property.vacantRooms || 2}" required style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>
          </div>
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Status</label>
            <select id="edit-status" style="width: 100%; padding: 0.7rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
              <option value="Active & Verified" ${property.status === 'Active & Verified' ? 'selected' : ''}>Active & Verified</option>
              <option value="Inactive" ${property.status === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>

          <button type="submit" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.8rem; border-radius: 999px; cursor: pointer; margin-top: 0.5rem; font-size: 0.95rem;">
            Save Property Changes
          </button>
        </form>
      </div>
    `;

    modal.querySelector('#btn-close-edit-modal').addEventListener('click', () => document.body.removeChild(modal));
    modal.querySelector('#form-edit-property').addEventListener('submit', (e) => {
      e.preventDefault();
      property.name = modal.querySelector('#edit-name').value;
      property.rent = parseInt(modal.querySelector('#edit-rent').value);
      property.vacantRooms = parseInt(modal.querySelector('#edit-vacant').value);
      property.status = modal.querySelector('#edit-status').value;

      document.body.removeChild(modal);
      appState.showToast(`Updated details for "${property.name}" successfully!`);
      renderTabContent();
    });

    document.body.appendChild(modal);
  }

  function renderTabContent() {
    const main = container.querySelector('#owner-main-content');
    if (!main) return;

    const currentState = appState.getState();
    const liveInquiries = [...(currentState.inquiries || [])];
    const liveBookings = [...(currentState.bookings || [])];

    // Sort live inquiries & bookings by createdAt in strict descending order (newest date, time & sec first)
    liveBookings.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    liveInquiries.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const totalEnquiriesCount = liveInquiries.length + liveBookings.length;

    // Filter accommodations for search query
    let filteredProps = ACCOMMODATIONS.filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.city.toLowerCase().includes(q) || (p.area || '').toLowerCase().includes(q);
    });

    const totalPages = Math.ceil(filteredProps.length / itemsPerPage);
    const paginatedProps = filteredProps.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalVacantBeds = ACCOMMODATIONS.reduce((sum, p) => sum + (p.vacantRooms || 0), 0);

    if (activeTab === 'overview' || activeTab === 'properties') {
      main.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">PG Owner Dashboard</h1>
            <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Manage all ${ACCOMMODATIONS.length.toLocaleString()} properties, view live inquiries & reservations.</p>
          </div>
          <div style="display: flex; gap: 10px;">
            ${window.staynestDeletedProperties.length > 0 ? `
              <button id="btn-quick-restore-top" style="background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-weight: 800; padding: 0.75rem 1.2rem; border-radius: 999px; cursor: pointer; font-size: 0.88rem;">
                ♻️ Restore Deleted PG (${window.staynestDeletedProperties.length})
              </button>
            ` : ''}
            <button id="btn-add-property-top" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 14px rgba(99,102,241,0.3);">
              ➕ Add New Property
            </button>
          </div>
        </div>

        <!-- 4 Metric Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #eef2ff; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🏠</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${ACCOMMODATIONS.length.toLocaleString()}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Total Properties</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #ecfdf5; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🛏️</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${totalVacantBeds.toLocaleString()}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Available Vacant Beds</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #fef3c7; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">📩</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${totalEnquiriesCount}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Live Enquiries & Reservations</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #f3e8ff; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">👁️</div>
            <div>
              <strong id="live-monthly-views-count" style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${(currentState.totalStudentViews || 45820).toLocaleString()}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                Monthly Student Views
                <span style="background: #ecfdf5; color: #059669; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 999px; border: 1px solid #a7f3d0; display: inline-flex; align-items: center; gap: 3px;">
                  <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block;"></span> LIVE
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Accommodation Listings Table with Search, Pagination & Delete Button -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;">My Active Listings (${filteredProps.length.toLocaleString()})</h3>
              <p style="font-size: 0.82rem; color: #64748b; margin: 2px 0 0 0;">Strict representation of all verified properties across India</p>
            </div>
            <input type="text" id="input-search-props" value="${searchQuery}" placeholder="🔍 Search property name or city..." style="padding: 0.6rem 1rem; border-radius: 999px; border: 1px solid #cbd5e1; outline: none; font-size: 0.88rem; min-width: 260px;">
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 0.85rem;">Property Name</th>
                  <th style="padding: 0.85rem;">Location</th>
                  <th style="padding: 0.85rem;">Rent / mo</th>
                  <th style="padding: 0.85rem;">Vacant Beds</th>
                  <th style="padding: 0.85rem;">Status</th>
                  <th style="padding: 0.85rem;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${paginatedProps.map(p => `
                  <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem;">
                    <td style="padding: 0.85rem;"><strong style="color: #0f172a;">${p.name}</strong></td>
                    <td style="padding: 0.85rem; color: #475569;">${p.area || 'Central'}, ${p.city}</td>
                    <td style="padding: 0.85rem; font-weight: 800; color: #6366f1;">₹${(p.rent || 7500).toLocaleString()}</td>
                    <td style="padding: 0.85rem; font-weight: 600;">${p.vacantRooms} beds</td>
                    <td style="padding: 0.85rem;">
                      <span style="background: ${p.status.includes('Active') ? '#10b981' : '#f59e0b'}; color: white; padding: 5px 12px; border-radius: 999px; font-weight: 700; font-size: 0.78rem; display: inline-block;">
                        ${p.status}
                      </span>
                    </td>
                    <td style="padding: 0.85rem; display: flex; gap: 6px;">
                      <button class="btn-edit-prop" data-pid="${p.id}" style="background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; padding: 5px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                        Edit
                      </button>
                      <button class="btn-toggle-status" data-pid="${p.id}" style="background: white; color: #6366f1; border: 1px solid #cbd5e1; padding: 5px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                        Toggle Status
                      </button>
                      <button class="btn-delete-prop" data-pid="${p.id}" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; padding: 5px 12px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f1f5f9; flex-wrap: wrap; gap: 1rem;">
            <span style="font-size: 0.85rem; color: #64748b; font-weight: 600;">
              Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredProps.length)} of ${filteredProps.length.toLocaleString()} listings
            </span>
            <div style="display: flex; gap: 6px; align-items: center;">
              <button id="btn-prev-page" ${currentPage === 1 ? 'disabled' : ''} style="padding: 0.4rem 0.9rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white; font-weight: 700; cursor: pointer; font-size: 0.82rem;">← Prev</button>
              <span style="font-size: 0.85rem; font-weight: 800; color: #6366f1; padding: 0 8px;">Page ${currentPage} of ${totalPages}</span>
              <button id="btn-next-page" ${currentPage >= totalPages ? 'disabled' : ''} style="padding: 0.4rem 0.9rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white; font-weight: 700; cursor: pointer; font-size: 0.82rem;">Next →</button>
            </div>
          </div>
        </div>
      `;

      main.querySelector('#btn-quick-restore-top')?.addEventListener('click', () => {
        activeTab = 'trash';
        updateSidebarNav();
        renderTabContent();
      });

      main.querySelector('#btn-add-property-top')?.addEventListener('click', () => {
        activeTab = 'add';
        updateSidebarNav();
        renderTabContent();
      });

      main.querySelector('#input-search-props')?.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderTabContent();
      });

      main.querySelector('#btn-prev-page')?.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderTabContent();
        }
      });

      main.querySelector('#btn-next-page')?.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderTabContent();
        }
      });

      main.querySelectorAll('.btn-edit-prop').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-pid');
          const target = ACCOMMODATIONS.find(p => p.id === pid);
          if (target) openEditModal(target);
        });
      });

      main.querySelectorAll('.btn-toggle-status').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-pid');
          const target = ACCOMMODATIONS.find(p => p.id === pid);
          if (target) {
            target.status = target.status.includes('Active') ? 'Inactive' : 'Active & Verified';
            appState.showToast(`Updated status for "${target.name}" to ${target.status}`);
            renderTabContent();
          }
        });
      });

      main.querySelectorAll('.btn-delete-prop').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-pid');
          const idx = ACCOMMODATIONS.findIndex(p => p.id === pid);
          if (idx !== -1) {
            const removed = ACCOMMODATIONS.splice(idx, 1)[0];
            removed.deletedAt = new Date().toISOString();
            window.staynestDeletedProperties.unshift(removed);
            appState.showToast(`🗑️ Moved "${removed.name}" to Trash Bin. Click ♻️ Restore anytime.`);
            updateSidebarNav();
            renderTabContent();
          }
        });
      });

    } else if (activeTab === 'trash') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">♻️ Property Recovery & Trash Bin (${window.staynestDeletedProperties.length})</h2>
              <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Recover any accidentally deleted PGs or Hostels back into active listings.</p>
            </div>
            ${window.staynestDeletedProperties.length > 0 ? `
              <button id="btn-restore-all-trash" style="background: #10b981; color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
                ♻️ Restore All Deleted Properties
              </button>
            ` : ''}
          </div>

          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${window.staynestDeletedProperties.length === 0 ? `
              <div style="text-align: center; padding: 3rem 1rem; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🎉</div>
                <h4 style="font-size: 1.2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">No Deleted Properties</h4>
                <p style="color: #64748b; font-size: 0.9rem;">All your 1,200 accommodations are live and active.</p>
              </div>
            ` : window.staynestDeletedProperties.map(dp => `
              <div style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: 14px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap;">
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: #991b1b; margin: 0;">${dp.name}</h4>
                    <span style="background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">ID: ${dp.id}</span>
                    <span style="background: white; color: #64748b; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">🕒 Deleted: ${formatFullTimestamp(dp.deletedAt)}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: #7f1d1d; margin: 0;">
                    📍 Location: <strong>${dp.area || 'Central'}, ${dp.city}</strong> • Rent: <strong>₹${(dp.rent || 7500).toLocaleString()}/mo</strong>
                  </p>
                </div>
                <button class="btn-restore-single-prop" data-pid="${dp.id}" style="background: #10b981; color: white; border: none; font-weight: 800; padding: 8px 18px; border-radius: 999px; cursor: pointer; font-size: 0.88rem; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                  ♻️ Restore Property Live
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      main.querySelector('#btn-restore-all-trash')?.addEventListener('click', () => {
        const count = window.staynestDeletedProperties.length;
        while (window.staynestDeletedProperties.length > 0) {
          const item = window.staynestDeletedProperties.pop();
          ACCOMMODATIONS.unshift(item);
        }
        appState.showToast(`♻️ Restored all ${count} deleted properties back live!`);
        updateSidebarNav();
        renderTabContent();
      });

      main.querySelectorAll('.btn-restore-single-prop').forEach(btn => {
        btn.addEventListener('click', () => {
          const pid = btn.getAttribute('data-pid');
          const idx = window.staynestDeletedProperties.findIndex(p => p.id === pid);
          if (idx !== -1) {
            const restored = window.staynestDeletedProperties.splice(idx, 1)[0];
            ACCOMMODATIONS.unshift(restored);
            appState.showToast(`♻️ Restored "${restored.name}" back live to active listings!`);
            updateSidebarNav();
            renderTabContent();
          }
        });
      });

    } else if (activeTab === 'enquiries') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">📩 Student Enquiries & Bed Reservations (${totalEnquiriesCount})</h2>
              <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Arranged in strict chronological date order with exact timestamps (Date, Time & Sec).</p>
            </div>
            <span style="background: #10b981; color: white; font-weight: 800; padding: 6px 14px; border-radius: 999px; font-size: 0.82rem;">⚡ DATE-WISE SORTED</span>
          </div>

          <!-- Section 1: Bed Reservations -->
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #4338ca; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e7ff; display: flex; justify-content: space-between; align-items: center;">
            <span>⚡ Bed Reservations (${liveBookings.length})</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">Sorted Newest to Oldest</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2.5rem;">
            ${liveBookings.length === 0 ? `
              <p style="color: #94a3b8; font-size: 0.9rem;">No bed reservations submitted yet.</p>
            ` : liveBookings.map(b => `
              <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 14px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">${b.pgName}</h4>
                    <span style="background: #6366f1; color: white; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">ID: ${b.id}</span>
                    <span style="background: #eef2ff; color: #4338ca; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">${b.roomType}</span>
                    <span style="background: #f1f5f9; color: #475569; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">🕒 ${formatFullTimestamp(b.createdAt)}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: #475569; margin: 0;">
                    👤 Student: <strong>${b.studentName}</strong> • 📞 Phone: <strong>${b.phone}</strong> • Move-in: <strong>${b.moveInDate}</strong> • Rent: <strong>₹${(b.rent || 7500).toLocaleString()}/mo</strong>
                  </p>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button class="btn-reply-student" data-phone="${b.phone}" style="background: #10b981; color: white; border: none; font-weight: 800; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-size: 0.82rem; box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);">
                    💬 Contact Student
                  </button>
                  <button class="btn-delete-booking" data-id="${b.id}" style="background: #ef4444; color: white; border: none; font-weight: 800; padding: 8px 14px; border-radius: 999px; cursor: pointer; font-size: 0.82rem; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Section 2: Site Visit Enquiries -->
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0284c7; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0f2fe; display: flex; justify-content: space-between; align-items: center;">
            <span>🗓️ Site Visit Enquiries (${liveInquiries.length})</span>
            <span style="font-size: 0.8rem; font-weight: 600; color: #64748b;">Sorted Newest to Oldest</span>
          </h3>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${liveInquiries.length === 0 ? `
              <p style="color: #94a3b8; font-size: 0.9rem;">No site visit inquiries submitted yet.</p>
            ` : liveInquiries.map(e => `
              <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 14px; padding: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
                    <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">${e.pgName}</h4>
                    <span style="background: #0284c7; color: white; font-weight: 800; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">ID: ${e.id}</span>
                    <span style="background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 6px;">🕒 ${formatFullTimestamp(e.createdAt)}</span>
                  </div>
                  <p style="font-size: 0.85rem; color: #334155; margin: 0;">
                    👤 Student: <strong>${e.studentName}</strong> • 📞 Phone: <strong>${e.phone}</strong> • Visit Date: <strong>${e.date}</strong> (${e.timeSlot})
                  </p>
                </div>
                <div style="display: flex; gap: 8px; align-items: center;">
                  <button class="btn-reply-student" data-phone="${e.phone}" style="background: #0284c7; color: white; border: none; font-weight: 800; padding: 8px 16px; border-radius: 999px; cursor: pointer; font-size: 0.82rem; box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);">
                    💬 Contact Student
                  </button>
                  <button class="btn-delete-inquiry" data-id="${e.id}" style="background: #ef4444; color: white; border: none; font-weight: 800; padding: 8px 14px; border-radius: 999px; cursor: pointer; font-size: 0.82rem; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      main.querySelectorAll('.btn-reply-student').forEach(b => {
        b.addEventListener('click', () => {
          const ph = b.getAttribute('data-phone');
          appState.showToast(`Opening contact chat for ${ph}...`);
        });
      });

      main.querySelectorAll('.btn-delete-booking').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          appState.deleteBooking(id);
          renderTabContent();
        });
      });

      main.querySelectorAll('.btn-delete-inquiry').forEach(b => {
        b.addEventListener('click', () => {
          const id = b.getAttribute('data-id');
          appState.deleteInquiry(id);
          renderTabContent();
        });
      });

    } else if (activeTab === 'profile') {
      main.innerHTML = `
        <div style="max-width: 580px; background: white; padding: 2rem; border-radius: 20px; border: 1px solid #e2e8f0; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 0.5rem;">
            <div style="font-size: 2.2rem; background: #eef2ff; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">👤</div>
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0;">Owner Profile</h2>
              <p style="color: #64748b; font-size: 0.85rem; margin: 0;">Update contact phone, email and business name.</p>
            </div>
          </div>

          <form id="form-owner-profile-save" style="display: flex; flex-direction: column; gap: 1.15rem; margin-top: 1.5rem;">
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Owner Full Name</label>
              <input type="text" id="owner-input-name" value="${window.staynestOwnerProfile.name}" required style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Contact Phone</label>
              <input type="tel" id="owner-input-phone" value="${window.staynestOwnerProfile.phone}" required style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Email Address</label>
              <input type="email" id="owner-input-email" value="${window.staynestOwnerProfile.email}" required style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>
            <div>
              <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Business / Company Name</label>
              <input type="text" id="owner-input-company" value="${window.staynestOwnerProfile.company}" required style="width: 100%; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; outline: none; font-size: 0.9rem;">
            </div>

            <button type="submit" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; margin-top: 0.5rem; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.3);">
              Save Owner Profile
            </button>
          </form>
        </div>
      `;

      main.querySelector('#form-owner-profile-save')?.addEventListener('submit', (e) => {
        e.preventDefault();
        window.staynestOwnerProfile.name = main.querySelector('#owner-input-name').value;
        window.staynestOwnerProfile.phone = main.querySelector('#owner-input-phone').value;
        window.staynestOwnerProfile.email = main.querySelector('#owner-input-email').value;
        window.staynestOwnerProfile.company = main.querySelector('#owner-input-company').value;

        appState.showToast('✅ Saved Owner Profile changes successfully!');
        renderTabContent();
      });
    }
  }

  container.innerHTML = `
    <!-- Left Sidebar Navigation -->
    <aside style="background: white; border-right: 1px solid #e2e8f0; padding: 1.5rem 1rem;">
      <div style="padding-bottom: 1.25rem; margin-bottom: 1.25rem; border-bottom: 1px solid #f1f5f9;">
        <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">🏠 Owner Control Panel</h3>
        <span style="font-size: 0.78rem; color: #6366f1; font-weight: 700;">Authorized Owner Access</span>
      </div>

      <nav style="display: flex; flex-direction: column; gap: 4px;">
        <button class="db-nav-item" data-tab="overview" style="text-align: left; padding: 0.75rem 1rem; border-radius: 10px; border: none; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">
          📊 Dashboard Overview
        </button>
        <button class="db-nav-item" data-tab="enquiries" style="text-align: left; padding: 0.75rem 1rem; border-radius: 10px; border: none; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">
          📩 Live Enquiries & Bookings
        </button>
        <button class="db-nav-item" data-tab="trash" style="text-align: left; padding: 0.75rem 1rem; border-radius: 10px; border: none; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;">
          <span>♻️ Trash / Restore</span>
          <span id="sidebar-trash-badge" style="background: #ef4444; color: white; font-size: 0.72rem; font-weight: 800; padding: 1px 7px; border-radius: 999px; display: none;">0</span>
        </button>
        <button class="db-nav-item" data-tab="profile" style="text-align: left; padding: 0.75rem 1rem; border-radius: 10px; border: none; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">
          👤 Owner Profile
        </button>
      </nav>
    </aside>

    <!-- Main Content Panel -->
    <main id="owner-main-content" style="padding: 2rem; overflow-y: auto;">
    </main>
  `;

  container.querySelectorAll('.db-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = btn.getAttribute('data-tab');
      updateSidebarNav();
      renderTabContent();
    });
  });

  root.innerHTML = '';
  root.appendChild(container);

  updateSidebarNav();
  renderTabContent();
}
