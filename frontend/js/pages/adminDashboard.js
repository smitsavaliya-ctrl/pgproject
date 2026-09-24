// Fully Interactive & Stateful Admin Dashboard Component for StayNest with Master Audit Logs, User Credentials Management, Exact HR:MIN:SEC Time Logging & Support Messages Reply Feature

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { MOCK_STATS, ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { getAuthDatabase, getPasswordResetRequests, approvePasswordResetRequest, rejectPasswordResetRequest, getAdminAuditLogs, logAdminAuditAction, clearAdminAuditLogs } from './auth.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { renderAdminListingsView } from '../admin/views/adminListingsView.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

function exportAuditLogsCSV(logs) {
  let csv = 'Log Ref ID,Timestamp,Category,Performed By,Target Entity,Details\n';
  logs.forEach(l => {
    const esc = s => `"${String(s || '').replace(/"/g, '""')}"`;
    csv += `${esc(l.id)},${esc(l.timestamp)},${esc(l.actionCategory)},${esc(l.performedBy)},${esc(l.targetDetails)},${esc(l.changesDescription)}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `StayNest_Admin_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Admin Property & Photo Editor Modal
function showAdminEditPropertyModal(pg, onSavedCallback) {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 10010; animation: fadeIn 0.2s ease;';

  let photosList = [...(pg.photos || pg.images || ['./assets/pg_photos/photo_1.jpg'])];

  const oldName = pg.name;
  const oldRent = pg.rent;
  const oldCity = pg.city;
  const oldArea = pg.area;
  const oldGender = pg.gender;
  const oldPhotoCount = photosList.length;

  modal.innerHTML = `
    <div style="background: white; padding: 2rem; border-radius: 24px; max-width: 680px; width: 92%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid #e2e8f0; position: relative;">
      
      <button id="btn-close-edit-pg-x" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; font-weight: 800; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 1rem; z-index: 10;">✕</button>

      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.5rem;">
        <span style="background: #6366f1; color: white; font-weight: 900; font-size: 0.75rem; padding: 4px 10px; border-radius: 999px;">⚙️ ADMIN PROPERTY & PHOTO EDITOR</span>
        <span style="font-family: monospace; font-size: 0.82rem; color: #64748b; font-weight: 700;">ID: ${pg.id}</span>
      </div>

      <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Edit "${pg.name}"</h2>
      <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">Modify property information, upload/change photos, and manage listing settings live.</p>

      <form id="form-admin-edit-pg" style="display: flex; flex-direction: column; gap: 1.15rem; text-align: left;">
        
        <!-- Basic Info -->
        <div>
          <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Property / PG Name *</label>
          <input type="text" id="edit-pg-name" value="${pg.name}" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.92rem; font-weight: 600; box-sizing: border-box;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">City *</label>
            <input type="text" id="edit-pg-city" value="${pg.city}" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.92rem; font-weight: 600; box-sizing: border-box;">
          </div>
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Area / Locality *</label>
            <input type="text" id="edit-pg-area" value="${pg.area}" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.92rem; font-weight: 600; box-sizing: border-box;">
          </div>
        </div>

        <div>
          <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Full Address *</label>
          <input type="text" id="edit-pg-address" value="${pg.address || ''}" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.92rem; font-weight: 600; box-sizing: border-box;">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.85rem;">
          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Gender *</label>
            <select id="edit-pg-gender" style="width: 100%; padding: 0.75rem 0.8rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 600; background: white; box-sizing: border-box;">
              <option value="Boys" ${pg.gender === 'Boys' ? 'selected' : ''}>Boys</option>
              <option value="Girls" ${pg.gender === 'Girls' ? 'selected' : ''}>Girls</option>
              <option value="Co-ed (Both Boys & Girls)" ${pg.gender?.includes('Both') || pg.gender === 'Co-ed' ? 'selected' : ''}>Co-ed (Both Boys & Girls)</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Monthly Rent (₹) *</label>
            <input type="number" id="edit-pg-rent" value="${pg.rent}" required style="width: 100%; padding: 0.75rem 0.8rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 600; box-sizing: border-box;">
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Owner Phone *</label>
            <input type="text" id="edit-pg-phone" value="${pg.phone || '+91 98765 12345'}" required style="width: 100%; padding: 0.75rem 0.8rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 600; box-sizing: border-box;">
          </div>
        </div>

        <div>
          <label style="font-size: 0.85rem; font-weight: 700; color: #334155; display: block; margin-bottom: 4px;">Description</label>
          <textarea id="edit-pg-desc" rows="3" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-family: inherit; font-weight: 500; outline: none; box-sizing: border-box;">${pg.description || ''}</textarea>
        </div>

        <!-- PHOTO EDITOR SECTION -->
        <div style="background: #f8fafc; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <label style="font-size: 0.9rem; font-weight: 800; color: #0f172a;">🖼️ Property Photos Manager (${photosList.length} Photos)</label>
            <span style="font-size: 0.76rem; color: #64748b;">Upload new photos or add image URLs</span>
          </div>

          <!-- Photos Grid -->
          <div id="edit-photos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 10px; margin-bottom: 1rem;">
            ${photosList.map((imgUrl, index) => `
              <div style="position: relative; border-radius: 10px; overflow: hidden; border: 2px solid ${index === 0 ? '#6366f1' : '#cbd5e1'}; aspect-ratio: 4/3; background: #e2e8f0;">
                <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
                ${index === 0 ? '<span style="position: absolute; top: 4px; left: 4px; background: #6366f1; color: white; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">COVER</span>' : ''}
                <button type="button" class="btn-remove-photo" data-photo-idx="${index}" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; width: 22px; height: 22px; border-radius: 50%; font-weight: 800; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">✕</button>
              </div>
            `).join('')}
          </div>

          <!-- Upload Controls -->
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <label style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.82rem; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; white-space: nowrap; border: 1px solid #c7d2fe;">
                📁 Upload Photos
                <input type="file" id="input-edit-upload-photos" multiple accept="image/*" style="display: none;">
              </label>
              <input type="text" id="input-edit-photo-url" placeholder="Or paste Image URL (https://...)" style="flex: 1; padding: 0.6rem 0.85rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.85rem; outline: none;">
              <button type="button" id="btn-add-photo-url" style="background: #334155; color: white; border: none; font-weight: 800; padding: 0.6rem 1rem; border-radius: 10px; cursor: pointer; font-size: 0.82rem;">Add URL</button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div style="display: flex; gap: 0.75rem; margin-top: 0.5rem;">
          <button type="submit" style="flex: 1; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
            💾 Save All Property Changes
          </button>
          <button type="button" id="btn-admin-delete-pg" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; font-weight: 800; padding: 0.85rem 1.25rem; border-radius: 999px; cursor: pointer; font-size: 0.88rem;">
            🗑️ Delete PG
          </button>
        </div>

      </form>
    </div>
  `;

  function dismissModal() {
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  function renderPhotoGrid() {
    const grid = modal.querySelector('#edit-photos-grid');
    if (!grid) return;
    grid.innerHTML = photosList.map((imgUrl, index) => `
      <div style="position: relative; border-radius: 10px; overflow: hidden; border: 2px solid ${index === 0 ? '#6366f1' : '#cbd5e1'}; aspect-ratio: 4/3; background: #e2e8f0;">
        <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
        ${index === 0 ? '<span style="position: absolute; top: 4px; left: 4px; background: #6366f1; color: white; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px;">COVER</span>' : ''}
        <button type="button" class="btn-remove-photo" data-photo-idx="${index}" style="position: absolute; top: 4px; right: 4px; background: rgba(239,68,68,0.9); color: white; border: none; width: 22px; height: 22px; border-radius: 50%; font-weight: 800; cursor: pointer; font-size: 0.75rem; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>
    `).join('');

    grid.querySelectorAll('.btn-remove-photo').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-photo-idx'));
        photosList.splice(idx, 1);
        renderPhotoGrid();
      });
    });
  }

  modal.querySelector('#btn-close-edit-pg-x').addEventListener('click', dismissModal);

  modal.querySelector('#input-edit-upload-photos')?.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        photosList.push(evt.target.result);
        renderPhotoGrid();
      };
      reader.readAsDataURL(file);
    });
  });

  modal.querySelector('#btn-add-photo-url')?.addEventListener('click', () => {
    const urlInput = modal.querySelector('#input-edit-photo-url');
    const val = urlInput ? urlInput.value.trim() : '';
    if (val) {
      photosList.push(val);
      urlInput.value = '';
      renderPhotoGrid();
    }
  });

  // Delete PG Action
  modal.querySelector('#btn-admin-delete-pg')?.addEventListener('click', () => {
    if (confirm(`Are you sure you want to delete "${pg.name}" permanently from the platform?`)) {
      const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(pg.id));
      if (idx !== -1) {
        ACCOMMODATIONS.splice(idx, 1);
      }

      try {
        let cache = JSON.parse(localStorage.getItem('staynest_cms_edits_cache') || '[]');
        cache = cache.filter(p => String(p.id) !== String(pg.id));
        localStorage.setItem('staynest_cms_edits_cache', JSON.stringify(cache));
      } catch(e) {}

      try {
        fetch(`http://localhost:8000/api/properties/${pg.id}/`, { method: 'DELETE' }).catch(() => {});
      } catch(e) {}

      logAdminAuditAction('Property Delete', `Listing #${pg.id} (${pg.name})`, `Property permanently deleted from platform database`);

      window.dispatchEvent(new CustomEvent('cms-data-updated'));
      appState.showToast(`🗑️ "${pg.name}" deleted permanently.`);
      dismissModal();
      if (onSavedCallback) onSavedCallback();
    }
  });

  // Submit Changes Form
  modal.querySelector('#form-admin-edit-pg').addEventListener('submit', (e) => {
    e.preventDefault();
    
    pg.name = modal.querySelector('#edit-pg-name').value.trim();
    pg.city = modal.querySelector('#edit-pg-city').value.trim();
    pg.area = modal.querySelector('#edit-pg-area').value.trim();
    pg.address = modal.querySelector('#edit-pg-address').value.trim();
    pg.gender = modal.querySelector('#edit-pg-gender').value;
    pg.rent = parseInt(modal.querySelector('#edit-pg-rent').value) || pg.rent;
    pg.phone = modal.querySelector('#edit-pg-phone').value.trim();
    pg.description = modal.querySelector('#edit-pg-desc').value.trim();
    
    if (photosList.length > 0) {
      pg.photos = [...photosList];
      pg.images = [...photosList];
      pg.image = photosList[0];
      pg.coverImage = photosList[0];
    }

    // Update in memory ACCOMMODATIONS dataset
    const accIdx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(pg.id));
    if (accIdx !== -1) {
      ACCOMMODATIONS[accIdx] = { ...ACCOMMODATIONS[accIdx], ...pg };
    }

    // Update local storage CMS cache for real-time persistence
    try {
      let cache = JSON.parse(localStorage.getItem('staynest_cms_edits_cache') || '[]');
      const cIdx = cache.findIndex(p => String(p.id) === String(pg.id));
      if (cIdx !== -1) {
        cache[cIdx] = { ...cache[cIdx], ...pg };
      } else {
        cache.push(pg);
      }
      localStorage.setItem('staynest_cms_edits_cache', JSON.stringify(cache));
    } catch(e) {}

    // Record Audit Log with exact changes
    const changeItems = [];
    if (oldName !== pg.name) changeItems.push(`Name: "${oldName}" → "${pg.name}"`);
    if (oldRent !== pg.rent) changeItems.push(`Rent: ₹${oldRent.toLocaleString()} → ₹${pg.rent.toLocaleString()}`);
    if (oldCity !== pg.city) changeItems.push(`City: ${oldCity} → ${pg.city}`);
    if (oldArea !== pg.area) changeItems.push(`Area: ${oldArea} → ${pg.area}`);
    if (oldGender !== pg.gender) changeItems.push(`Gender: ${oldGender} → ${pg.gender}`);
    if (photosList.length !== oldPhotoCount) changeItems.push(`Photos count: ${oldPhotoCount} → ${photosList.length}`);
    const changeDetailStr = changeItems.length > 0 ? changeItems.join(' | ') : 'Property details & photos updated';

    logAdminAuditAction('Property Edit', `Listing #${pg.id} (${pg.name})`, changeDetailStr);

    // Attempt background API patch if Django server is active
    try {
      fetch(`http://localhost:8000/api/properties/${pg.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: pg.name,
          area: pg.area,
          address: pg.address,
          gender: pg.gender,
          rent: pg.rent,
          phone: pg.phone,
          description: pg.description,
          images: JSON.stringify(pg.images || pg.photos || [])
        })
      }).catch(() => {});
    } catch(e) {}

    // Dispatch global real-time event to re-render all public views instantly
    window.dispatchEvent(new CustomEvent('cms-data-updated'));

    appState.showToast(`✅ "${pg.name}" updated successfully!`);
    dismissModal();
    if (onSavedCallback) onSavedCallback();
  });

  document.body.appendChild(modal);
  renderPhotoGrid();
}

export function renderAdminDashboard(targetElem = null) {
  const root = targetElem || document.getElementById('app-root') || document.getElementById('admin-app-root');
  if (!root) return;

  let activeTab = 'panel'; // 'panel' | 'listings' | 'audit_logs' | 'pass_requests' | 'credentials' | 'support' | 'students' | 'owners' | 'pending' | 'analytics' | 'settings'

  let pendingApprovalsList = [
    { id: 'pending-1', name: 'Shree Krishna Luxury PG', city: 'Ahmedabad', area: 'Navrangpura', owner: 'Vikas Sharma', date: '2026-08-08 11:20:15' },
    { id: 'pending-2', name: 'Royal Residency Boys Hostel', city: 'Mumbai', area: 'Andheri West', owner: 'Ramesh Shah', date: '2026-08-07 16:45:02' }
  ];

  const container = document.createElement('div');
  container.className = 'dashboard-layout';
  container.style.cssText = 'display: grid; grid-template-columns: 270px 1fr; min-height: 100vh; width: 100%; background: #f8fafc; position: relative; z-index: 100;';

  // Admin Reply Modal for Support Messages
  function showAdminReplyModal(msg) {
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10010; animation: fadeIn 0.2s ease;';

    modal.innerHTML = `
      <div style="background: white; padding: 2.25rem; border-radius: 24px; max-width: 580px; width: 92%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid #e2e8f0; position: relative;">
        <button id="btn-close-reply-x" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-weight: 800; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">✕</button>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 0.5rem;">
          <span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.75rem; padding: 3px 10px; border-radius: 999px; text-transform: uppercase;">
            ADMIN LIVE REPLY CENTER
          </span>
          <span style="font-family: monospace; font-size: 0.82rem; color: #64748b; font-weight: 700;">Ref ID: #${msg.id}</span>
        </div>

        <h3 style="font-size: 1.45rem; font-weight: 800; color: #0f172a; margin: 0 0 0.75rem 0;">Reply to ${msg.userName}</h3>

        <!-- User Message Summary Card -->
        <div style="background: #f8fafc; border-radius: 14px; padding: 1rem 1.15rem; border: 1px solid #e2e8f0; margin-bottom: 1.25rem; font-size: 0.88rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px; flex-wrap: wrap;">
            <span style="color: #64748b; font-weight: 600;">From: <strong style="color: #0f172a;">${msg.userName}</strong> (${msg.userEmail})</span>
            <span style="color: #64748b; font-size: 0.78rem;">${msg.timestamp}</span>
          </div>
          <div style="font-weight: 700; color: #4338ca; margin-bottom: 4px;">Subject: ${msg.subject || 'Support Request'}</div>
          <div style="color: #334155; line-height: 1.5; font-style: italic; background: white; padding: 8px 12px; border-radius: 8px; border: 1px solid #cbd5e1;">"${msg.message}"</div>
        </div>

        <!-- Admin Reply Form -->
        <form id="form-admin-send-reply">
          <div style="margin-bottom: 1.25rem;">
            <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #334155; margin-bottom: 0.4rem;">Official Admin Reply Message *</label>
            <textarea id="admin-reply-text" required rows="4" placeholder="Type your response to ${msg.userName}..." style="width: 100%; padding: 0.8rem 1rem; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem; font-family: inherit; font-weight: 500; outline: none; box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);"></textarea>
          </div>

          <div style="display: flex; gap: 0.75rem;">
            <button type="submit" style="flex: 1; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35); display: flex; align-items: center; justify-content: center; gap: 6px;">
              ✉️ Dispatch Reply to ${msg.userName}
            </button>
            <button type="button" id="btn-cancel-reply" style="background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; font-weight: 700; padding: 0.85rem 1.25rem; border-radius: 999px; cursor: pointer; font-size: 0.88rem;">
              Cancel
            </button>
          </div>
        </form>
      </div>
    `;

    function dismissModal() {
      if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
    }

    modal.querySelector('#btn-close-reply-x').addEventListener('click', dismissModal);
    modal.querySelector('#btn-cancel-reply').addEventListener('click', dismissModal);

    modal.querySelector('#form-admin-send-reply').addEventListener('submit', (e) => {
      e.preventDefault();
      const replyVal = modal.querySelector('#admin-reply-text').value;

      appState.replyToSupportMessage(msg.id, replyVal);
      logAdminAuditAction('Support Reply Sent', `Ref #${msg.id} (User: ${msg.userName} - ${msg.userEmail})`, `Replied to subject '${msg.subject}': "${replyVal}"`);
      appState.showToast(`✉️ Reply sent successfully to ${msg.userName} (${msg.userEmail})!`);
      dismissModal();
      renderTabContent();
    });

    document.body.appendChild(modal);
  }

  function renderTabContent() {
    const main = container.querySelector('#admin-main-content');
    if (!main) return;

    const state = appState.getState();
    const userDb = getAuthDatabase();
    const userEntries = Object.entries(userDb);
    const supportList = state.supportMessages || [];
    const pendingSupport = supportList.filter(m => m.status === 'Pending');

    if (activeTab === 'panel') {
      main.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">System Admin Control Panel</h1>
            <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Monitor platform growth, user login credentials, exact sign-in timestamps & live support messages.</p>
          </div>
          <button id="btn-admin-export-top" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 14px rgba(99,102,241,0.3);">
            📥 Export Audit & Credentials Report (CSV)
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #eef2ff; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🔑</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${userEntries.length}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Registered Credentials</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #fef3c7; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">💬</div>
            <div>
              <strong style="font-size: 1.6rem; color: #d97706; display: block; font-weight: 800;">${pendingSupport.length}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">Pending Support Messages</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #ecfdf5; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">🏠</div>
            <div>
              <strong style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${MOCK_STATS.totalOwners}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600;">PG Owners</span>
            </div>
          </div>

          <div style="background: white; padding: 1.25rem; border-radius: 16px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="font-size: 2.2rem; background: #f3e8ff; width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center;">👁️</div>
            <div>
              <strong id="admin-live-views-count" style="font-size: 1.6rem; color: #0f172a; display: block; font-weight: 800;">${(appState.getState().totalStudentViews || 45820).toLocaleString()}</strong>
              <span style="font-size: 0.82rem; color: #64748b; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                Monthly Student Views
                <span style="background: #ecfdf5; color: #059669; font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 999px; border: 1px solid #a7f3d0; display: inline-flex; align-items: center; gap: 3px;">
                  <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block;"></span> LIVE
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Master User Login Data Credentials Table with Exact Timestamps -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02); margin-bottom: 2rem;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;">🔑 Registered User Credentials & Exact Sign-In Timestamps</h3>
            <span style="background: #e0e7ff; color: #4338ca; font-size: 0.78rem; font-weight: 800; padding: 4px 10px; border-radius: 999px;">
              REAL-TIME SECURITY REGISTRY
            </span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 0.75rem;">User Name</th>
                  <th style="padding: 0.75rem;">User Email / ID</th>
                  <th style="padding: 0.75rem;">Role</th>
                  <th style="padding: 0.75rem;">Password(s)</th>
                  <th style="padding: 0.75rem;">Registration Time (Date & HR:MIN:SEC)</th>
                  <th style="padding: 0.75rem;">Last Active Sign-In (Date & HR:MIN:SEC)</th>
                </tr>
              </thead>
              <tbody>
                ${userEntries.map(([email, user]) => `
                  <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem;">
                    <td style="padding: 0.75rem;"><strong style="color: #0f172a;">${user.name}</strong></td>
                    <td style="padding: 0.75rem; color: #4338ca; font-weight: 700;"><code>${email}</code></td>
                    <td style="padding: 0.75rem;">
                      <span style="background: ${user.role === 'admin' ? '#fef3c7' : (user.role === 'owner' ? '#e0e7ff' : '#dcfce7')}; color: ${user.role === 'admin' ? '#b45309' : (user.role === 'owner' ? '#4338ca' : '#15803d')}; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">
                        ${user.role}
                      </span>
                    </td>
                    <td style="padding: 0.75rem; font-family: monospace; color: #ef4444; font-weight: 800;">${(user.passwords && user.passwords.length > 0) ? user.passwords[0] : (user.password || 'password123')}</td>
                    <td style="padding: 0.75rem; color: #64748b; font-family: monospace; font-size: 0.85rem;">${user.regTime || '2026-08-08 10:00:00'}</td>
                    <td style="padding: 0.75rem; color: #10b981; font-family: monospace; font-weight: 800; font-size: 0.85rem;">${user.lastLoginTime || user.regTime || 'Active Now'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      main.querySelector('#btn-admin-export-top')?.addEventListener('click', () => {
        const logs = getAdminAuditLogs();
        exportAuditLogsCSV(logs);
        appState.showToast('📥 Audit & Activity log report exported to CSV!');
      });

    } else if (activeTab === 'listings') {
      renderAdminListingsView(main);
    } else if (activeTab === 'audit_logs') {
      let logs = getAdminAuditLogs();
      let filterCategory = 'all';
      let searchLogQuery = '';

      function renderAuditTable() {
        let filtered = [...logs];
        if (filterCategory !== 'all') {
          filtered = filtered.filter(l => (l.actionCategory || '').toLowerCase().includes(filterCategory.toLowerCase()));
        }
        if (searchLogQuery) {
          const q = searchLogQuery.toLowerCase();
          filtered = filtered.filter(l => 
            (l.id && l.id.toLowerCase().includes(q)) ||
            (l.targetDetails && l.targetDetails.toLowerCase().includes(q)) ||
            (l.changesDescription && l.changesDescription.toLowerCase().includes(q)) ||
            (l.actionCategory && l.actionCategory.toLowerCase().includes(q))
          );
        }

        main.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">📜 System Admin Audit & Activity Logs</h1>
              <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Real-time historical log recording every property edit, addition, deletion, password reset approval, and setting change with exact timestamps.</p>
            </div>
            <div style="display: flex; gap: 8px;">
              <button id="btn-export-audit-csv" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.65rem 1.25rem; border-radius: 999px; cursor: pointer; font-size: 0.85rem; box-shadow: 0 4px 12px rgba(99,102,241,0.3); display: flex; align-items: center; gap: 6px;">
                📥 Export CSV Report
              </button>
              <button id="btn-clear-audit-logs" style="background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; font-weight: 800; padding: 0.65rem 1rem; border-radius: 999px; cursor: pointer; font-size: 0.85rem;">
                🗑️ Clear History
              </button>
            </div>
          </div>

          <div style="background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display: flex; gap: 1rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center;">
              <div style="flex: 2; min-width: 240px;">
                <input type="text" id="input-audit-search" value="${searchLogQuery}" placeholder="🔍 Search Log ID, Target Entity, or Change details..." style="width: 100%; padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; box-sizing: border-box;">
              </div>
              <select id="select-audit-category" style="padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 600; background: white; cursor: pointer;">
                <option value="all" ${filterCategory === 'all' ? 'selected' : ''}>All Categories (${logs.length})</option>
                <option value="Property Edit" ${filterCategory === 'Property Edit' ? 'selected' : ''}>Property Edit</option>
                <option value="Property Delete" ${filterCategory === 'Property Delete' ? 'selected' : ''}>Property Delete</option>
                <option value="Property Creation" ${filterCategory === 'Property Creation' ? 'selected' : ''}>Property Creation</option>
                <option value="Password Reset" ${filterCategory === 'Password Reset' ? 'selected' : ''}>Password Reset Requests</option>
                <option value="Support Reply" ${filterCategory === 'Support Reply' ? 'selected' : ''}>Support Replies</option>
                <option value="Theme" ${filterCategory === 'Theme' ? 'selected' : ''}>Theme & Branding</option>
              </select>
            </div>

            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                    <th style="padding: 0.75rem;">Log Ref ID</th>
                    <th style="padding: 0.75rem;">Exact Timestamp</th>
                    <th style="padding: 0.75rem;">Category</th>
                    <th style="padding: 0.75rem;">Performed By</th>
                    <th style="padding: 0.75rem;">Target Details</th>
                    <th style="padding: 0.75rem;">Full Record of Changes Made</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered.length === 0 ? `
                    <tr>
                      <td colspan="6" style="text-align: center; padding: 2.5rem; color: #64748b; font-size: 0.92rem;">
                        📭 No audit log entries found matching your query.
                      </td>
                    </tr>
                  ` : filtered.map(log => `
                    <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.88rem; vertical-align: top;">
                      <td style="padding: 0.8rem; font-family: monospace; font-weight: 800; color: #6366f1;">${log.id}</td>
                      <td style="padding: 0.8rem; font-family: monospace; color: #10b981; font-size: 0.82rem; font-weight: 800; white-space: nowrap;">${log.timestamp}</td>
                      <td style="padding: 0.8rem; white-space: nowrap;">
                        <span style="background: ${log.actionCategory.includes('Delete') ? '#fee2e2' : log.actionCategory.includes('Password') ? '#fef3c7' : '#e0e7ff'}; color: ${log.actionCategory.includes('Delete') ? '#dc2626' : log.actionCategory.includes('Password') ? '#b45309' : '#4338ca'}; font-weight: 800; font-size: 0.72rem; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">
                          ${log.actionCategory}
                        </span>
                      </td>
                      <td style="padding: 0.8rem; font-weight: 700; color: #334155;">${log.performedBy || 'System Admin'}</td>
                      <td style="padding: 0.8rem; font-weight: 700; color: #0f172a; max-width: 200px;">${log.targetDetails}</td>
                      <td style="padding: 0.8rem; color: #475569; font-family: inherit; line-height: 1.4;">${log.changesDescription}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;

        main.querySelector('#input-audit-search')?.addEventListener('input', (e) => {
          searchLogQuery = e.target.value;
          renderAuditTable();
        });

        main.querySelector('#select-audit-category')?.addEventListener('change', (e) => {
          filterCategory = e.target.value;
          renderAuditTable();
        });

        main.querySelector('#btn-export-audit-csv')?.addEventListener('click', () => {
          exportAuditLogsCSV(logs);
          appState.showToast('📥 Audit report exported to CSV!');
        });

        main.querySelector('#btn-clear-audit-logs')?.addEventListener('click', () => {
          if (confirm('🚨 Are you sure you want to clear all audit logs history?')) {
            clearAdminAuditLogs();
            logs = [];
            renderAuditTable();
            appState.showToast('🗑️ Audit logs cleared.');
          }
        });
      }

      renderAuditTable();

    } else if (activeTab === 'support') {
      main.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">💬 User Support Messages & Reply Center</h1>
            <p style="color: #64748b; margin: 0; font-size: 0.9rem;">View incoming inquiries submitted via Support Contact and send direct replies to users.</p>
          </div>
          <span style="background: #e0e7ff; color: #4338ca; font-weight: 800; padding: 6px 14px; border-radius: 999px; font-size: 0.85rem;">
            ${pendingSupport.length} Pending Reply
          </span>
        </div>

        <div style="background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                  <th style="padding: 0.75rem;">Ref ID</th>
                  <th style="padding: 0.75rem;">User Name & Contact</th>
                  <th style="padding: 0.75rem;">Subject & Support Message</th>
                  <th style="padding: 0.75rem;">Sent Time (HR:MIN:SEC)</th>
                  <th style="padding: 0.75rem;">Status</th>
                  <th style="padding: 0.75rem;">Admin Action / Reply</th>
                </tr>
              </thead>
              <tbody>
                ${supportList.length === 0 ? `
                  <tr>
                    <td colspan="6" style="text-align: center; padding: 2rem; color: #64748b;">No support messages recorded yet.</td>
                  </tr>
                ` : supportList.map(msg => `
                  <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; vertical-align: top;">
                    <td style="padding: 0.85rem; font-family: monospace; font-weight: 800; color: #6366f1;">#${msg.id}</td>
                    <td style="padding: 0.85rem;">
                      <strong style="color: #0f172a; display: block;">${msg.userName}</strong>
                      <span style="color: #4338ca; font-size: 0.82rem; font-weight: 600; display: block;">${msg.userEmail}</span>
                      <span style="color: #64748b; font-size: 0.78rem;">${msg.phone || ''}</span>
                    </td>
                    <td style="padding: 0.85rem; max-width: 300px;">
                      <strong style="color: #0f172a; display: block; margin-bottom: 2px;">Subject: ${msg.subject || 'Support Message'}</strong>
                      <p style="color: #475569; font-size: 0.85rem; margin: 0; line-height: 1.4;">${msg.message}</p>
                    </td>
                    <td style="padding: 0.85rem; font-family: monospace; color: #64748b; font-size: 0.82rem; white-space: nowrap;">
                      ${msg.timestamp}
                    </td>
                    <td style="padding: 0.85rem; white-space: nowrap;">
                      <span style="background: ${msg.status === 'Replied' ? '#dcfce7' : '#fef3c7'}; color: ${msg.status === 'Replied' ? '#15803d' : '#b45309'}; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px; text-transform: uppercase;">
                        ${msg.status === 'Replied' ? '✓ REPLIED' : '⚠️ PENDING'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem;">
                      ${msg.status === 'Replied' ? `
                        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 10px; font-size: 0.82rem;">
                          <strong style="color: #10b981; display: block; margin-bottom: 2px;">Replied at ${msg.repliedAt}:</strong>
                          <span style="color: #334155; font-style: italic;">"${msg.adminReply}"</span>
                        </div>
                      ` : `
                        <button class="btn-reply-support-msg" data-msg-id="${msg.id}" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 6px 14px; border-radius: 999px; cursor: pointer; font-size: 0.8rem; box-shadow: 0 2px 8px rgba(99,102,241,0.3); display: flex; align-items: center; gap: 4px;">
                          💬 Send Reply
                        </button>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      main.querySelectorAll('.btn-reply-support-msg').forEach(btn => {
        btn.addEventListener('click', () => {
          const msgId = btn.getAttribute('data-msg-id');
          const targetMsg = supportList.find(m => m.id === msgId);
          if (targetMsg) showAdminReplyModal(targetMsg);
        });
      });

    } else if (activeTab === 'credentials') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">🔑 Master User Credentials Database</h2>
          <p style="color: #64748b; font-size: 0.88rem; margin-bottom: 1.5rem;">List of registered users, plain-text passwords, and exact registration timestamps.</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                <th style="padding: 0.75rem;">Name</th>
                <th style="padding: 0.75rem;">Email ID</th>
                <th style="padding: 0.75rem;">Role</th>
                <th style="padding: 0.75rem;">Password</th>
                <th style="padding: 0.75rem;">Registration Time</th>
              </tr>
            </thead>
            <tbody>
              ${userEntries.map(([email, user]) => `
                <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem;">
                  <td style="padding: 0.75rem;"><strong>${user.name}</strong></td>
                  <td style="padding: 0.75rem; color: #4338ca;"><code>${email}</code></td>
                  <td style="padding: 0.75rem;"><span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${user.role}</span></td>
                  <td style="padding: 0.75rem; font-family: monospace; color: #ef4444; font-weight: 800;">${(user.passwords && user.passwords.length > 0) ? user.passwords[0] : (user.password || 'password123')}</td>
                  <td style="padding: 0.75rem; color: #64748b; font-family: monospace; font-size: 0.85rem;">${user.regTime || '2026-08-08 10:00:00'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'pass_requests') {
      const resetReqs = getPasswordResetRequests();
      const pendingReqs = resetReqs.filter(r => r.status === 'Pending');

      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
            <div>
              <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">🔐 Password Reset Requests (${resetReqs.length})</h2>
              <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Review and approve student & owner password reset requests. Approved passwords are automatically activated.</p>
            </div>
            <span style="background: ${pendingReqs.length > 0 ? '#fee2e2' : '#ecfdf5'}; color: ${pendingReqs.length > 0 ? '#dc2626' : '#047857'}; font-weight: 800; padding: 6px 14px; border-radius: 999px; font-size: 0.85rem;">
              ${pendingReqs.length} Pending Approval
            </span>
          </div>

          ${resetReqs.length === 0 ? `
            <div style="text-align: center; padding: 3rem; color: #64748b; background: #f8fafc; border-radius: 16px; border: 1px dashed #cbd5e1;">
              <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📭</div>
              <strong style="font-size: 1.1rem; color: #0f172a; display: block; margin-bottom: 4px;">No Password Reset Requests Yet</strong>
              <span>Requests submitted by Students or PG Owners will appear here for your approval.</span>
            </div>
          ` : `
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                    <th style="padding: 0.75rem;">Request ID</th>
                    <th style="padding: 0.75rem;">User Email / Phone</th>
                    <th style="padding: 0.75rem;">Role</th>
                    <th style="padding: 0.75rem;">Requested New Password</th>
                    <th style="padding: 0.75rem;">Request Time</th>
                    <th style="padding: 0.75rem;">Status</th>
                    <th style="padding: 0.75rem;">Admin Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${resetReqs.map(req => `
                    <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; vertical-align: middle;">
                      <td style="padding: 0.75rem; font-family: monospace; font-weight: 800; color: #6366f1;">${req.id}</td>
                      <td style="padding: 0.75rem;"><strong>${req.email}</strong></td>
                      <td style="padding: 0.75rem;"><span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">${req.role}</span></td>
                      <td style="padding: 0.75rem; font-family: monospace; color: #ef4444; font-weight: 800;">${req.desiredPassword}</td>
                      <td style="padding: 0.75rem; color: #64748b; font-family: monospace; font-size: 0.82rem;">${req.requestTime}</td>
                      <td style="padding: 0.75rem;">
                        <span style="background: ${req.status === 'Approved' ? '#dcfce7' : req.status === 'Rejected' ? '#fee2e2' : '#fef3c7'}; color: ${req.status === 'Approved' ? '#15803d' : req.status === 'Rejected' ? '#b91c1c' : '#b45309'}; font-weight: 800; font-size: 0.75rem; padding: 3px 8px; border-radius: 6px;">
                          ${req.status === 'Approved' ? '✓ APPROVED' : req.status === 'Rejected' ? '✕ REJECTED' : '⏳ PENDING'}
                        </span>
                      </td>
                      <td style="padding: 0.75rem;">
                        ${req.status === 'Pending' ? `
                          <div style="display: flex; gap: 6px;">
                            <button class="btn-admin-approve-pass" data-req-id="${req.id}" style="background: #10b981; color: white; border: none; font-weight: 800; font-size: 0.78rem; padding: 5px 12px; border-radius: 999px; cursor: pointer; box-shadow: 0 2px 6px rgba(16,185,129,0.3);">
                              ✓ Approve & Set Pass
                            </button>
                            <button class="btn-admin-reject-pass" data-req-id="${req.id}" style="background: #ef4444; color: white; border: none; font-weight: 800; font-size: 0.78rem; padding: 5px 10px; border-radius: 999px; cursor: pointer;">
                              ✕ Reject
                            </button>
                          </div>
                        ` : `
                          <span style="color: #64748b; font-size: 0.82rem;">${req.status} ${req.approvedTime || req.rejectedTime ? `at ${req.approvedTime || req.rejectedTime}` : ''}</span>
                        `}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      `;

      main.querySelectorAll('.btn-admin-approve-pass').forEach(btn => {
        btn.addEventListener('click', () => {
          const reqId = btn.getAttribute('data-req-id');
          approvePasswordResetRequest(reqId);
          appState.showToast(`✅ Password Reset Request ${reqId} Approved! User password updated live.`);
          renderTabContent();
        });
      });

      main.querySelectorAll('.btn-admin-reject-pass').forEach(btn => {
        btn.addEventListener('click', () => {
          const reqId = btn.getAttribute('data-req-id');
          rejectPasswordResetRequest(reqId);
          appState.showToast(`✕ Password Reset Request ${reqId} Rejected.`);
          renderTabContent();
        });
      });
    } else if (activeTab === 'students') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">👥 Registered Students (${MOCK_STATS.totalStudents.toLocaleString()})</h2>
          <p style="color: #64748b; font-size: 0.88rem;">Student accounts with active room reservations and site visit schedules.</p>
        </div>
      `;
    } else if (activeTab === 'owners') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">🏠 Registered PG Owners (${MOCK_STATS.totalOwners})</h2>
          <p style="color: #64748b; font-size: 0.88rem;">Verified property owners and hostel managers registered on StayNest.</p>
        </div>
      `;
    } else if (activeTab === 'settings') {
      const themeCfg = appState.getThemeConfig();

      main.innerHTML = `
        <div style="margin-bottom: 2rem;">
          <h1 style="font-size: 1.85rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">⚙️ Global System Settings & Website Customizer</h1>
          <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Change website color theme, global announcement bar text, site branding & tagline live.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
          
          <!-- 🎨 1. WEBSITE COLOR THEME CUSTOMIZER -->
          <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
              <div>
                <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">🎨 Website Color Themes & Presets</h3>
                <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Select a preset color theme or pick custom primary & secondary accent colors.</p>
              </div>
              <span style="background: #e0e7ff; color: #4338ca; font-size: 0.78rem; font-weight: 800; padding: 4px 12px; border-radius: 999px;">
                ACTIVE THEME: ${themeCfg.themeMode === 'dark' ? '🌙 MIDNIGHT DARK' : '☀️ LIGHT MODE'}
              </span>
            </div>

            <!-- Preset Cards Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
              
              <div class="theme-preset-card" data-primary="#6366f1" data-secondary="#7c3aed" data-mode="light" style="background: #f8fafc; border: 2px solid ${themeCfg.primaryColor === '#6366f1' ? '#6366f1' : '#cbd5e1'}; border-radius: 14px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.5rem;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #6366f1;"></div>
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #7c3aed;"></div>
                </div>
                <strong style="color: #0f172a; font-size: 0.9rem; display: block;">💜 Indigo Royal</strong>
                <span style="font-size: 0.75rem; color: #64748b;">(Default Theme)</span>
              </div>

              <div class="theme-preset-card" data-primary="#2563eb" data-secondary="#0284c7" data-mode="light" style="background: #f8fafc; border: 2px solid ${themeCfg.primaryColor === '#2563eb' ? '#2563eb' : '#cbd5e1'}; border-radius: 14px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.5rem;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #2563eb;"></div>
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #0284c7;"></div>
                </div>
                <strong style="color: #0f172a; font-size: 0.9rem; display: block;">🔵 Oceanic Sapphire</strong>
                <span style="font-size: 0.75rem; color: #64748b;">(Vibrant Blue)</span>
              </div>

              <div class="theme-preset-card" data-primary="#059669" data-secondary="#10b981" data-mode="light" style="background: #f8fafc; border: 2px solid ${themeCfg.primaryColor === '#059669' ? '#059669' : '#cbd5e1'}; border-radius: 14px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.5rem;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #059669;"></div>
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #10b981;"></div>
                </div>
                <strong style="color: #0f172a; font-size: 0.9rem; display: block;">🟢 Emerald Nature</strong>
                <span style="font-size: 0.75rem; color: #64748b;">(Fresh Green)</span>
              </div>

              <div class="theme-preset-card" data-primary="#e11d48" data-secondary="#f43f5e" data-mode="light" style="background: #f8fafc; border: 2px solid ${themeCfg.primaryColor === '#e11d48' ? '#e11d48' : '#cbd5e1'}; border-radius: 14px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.5rem;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #e11d48;"></div>
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #f43f5e;"></div>
                </div>
                <strong style="color: #0f172a; font-size: 0.9rem; display: block;">🔴 Rose Crimson</strong>
                <span style="font-size: 0.75rem; color: #64748b;">(Warm Pink-Red)</span>
              </div>

              <div class="theme-preset-card" data-primary="#818cf8" data-secondary="#c084fc" data-mode="dark" style="background: #0f172a; border: 2px solid ${themeCfg.themeMode === 'dark' ? '#818cf8' : '#334155'}; border-radius: 14px; padding: 1rem; cursor: pointer; text-align: center;">
                <div style="display: flex; gap: 6px; justify-content: center; margin-bottom: 0.5rem;">
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #818cf8;"></div>
                  <div style="width: 24px; height: 24px; border-radius: 50%; background: #c084fc;"></div>
                </div>
                <strong style="color: white; font-size: 0.9rem; display: block;">🌙 Midnight Dark</strong>
                <span style="font-size: 0.75rem; color: #cbd5e1;">(Luxury Dark Mode)</span>
              </div>

            </div>

            <!-- Custom Colors Form -->
            <form id="form-theme-colors" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; align-items: end;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Primary Brand Color</label>
                <input type="color" id="picker-primary-color" value="${themeCfg.primaryColor}" style="width: 100%; height: 42px; padding: 4px; border-radius: 10px; border: 1px solid #cbd5e1; cursor: pointer;">
              </div>
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Secondary Accent Color</label>
                <input type="color" id="picker-secondary-color" value="${themeCfg.secondaryColor}" style="width: 100%; height: 42px; padding: 4px; border-radius: 10px; border: 1px solid #cbd5e1; cursor: pointer;">
              </div>
              <button type="submit" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 12px rgba(99,102,241,0.35);">
                🎨 Apply Theme Live
              </button>
            </form>
          </div>

          <!-- 📢 2. GLOBAL ANNOUNCEMENT BANNER EDITOR -->
          <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">📢 Global Header Announcement Banner</h3>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0 0 1.25rem 0;">Publish live announcements or discount promotions across top header navbar of every page.</p>

            <form id="form-announcement-settings" style="display: flex; flex-direction: column; gap: 1rem;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <input type="checkbox" id="chk-announcement-enabled" ${themeCfg.announcementEnabled ? 'checked' : ''} style="width: 20px; height: 20px; accent-color: #6366f1; cursor: pointer;">
                <label for="chk-announcement-enabled" style="font-size: 0.9rem; font-weight: 700; color: #0f172a; cursor: pointer;">Enable Global Header Announcement Banner</label>
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Announcement Banner Message Text</label>
                <input type="text" id="input-announcement-text" value="${themeCfg.announcementText || ''}" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 600; box-sizing: border-box;">
              </div>

              <button type="submit" style="align-self: flex-start; background: #334155; color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 999px; cursor: pointer; font-size: 0.88rem;">
                📢 Save Announcement Banner
              </button>
            </form>
          </div>

          <!-- 🏷️ 3. BRANDING & TAGLINE EDITOR -->
          <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">🏷️ Website Branding & Tagline</h3>
            <p style="color: #64748b; font-size: 0.88rem; margin: 0 0 1.25rem 0;">Customize platform brand title name and hero section subtitle slogans.</p>

            <form id="form-branding-settings" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; align-items: end;">
              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Brand Name Title</label>
                <input type="text" id="input-site-name" value="${themeCfg.siteName}" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 700; box-sizing: border-box;">
              </div>

              <div>
                <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Hero Subtitle Tagline</label>
                <input type="text" id="input-site-tagline" value="${themeCfg.siteTagline}" style="width: 100%; padding: 0.75rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; font-weight: 600; box-sizing: border-box;">
              </div>

              <button type="submit" style="grid-column: span 2; background: #0f172a; color: white; border: none; font-weight: 800; padding: 0.8rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem;">
                🏷️ Update Brand & Slogan Settings
              </button>
            </form>
          </div>

        </div>
      `;

      // Preset click handlers
      main.querySelectorAll('.theme-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          const p = card.getAttribute('data-primary');
          const s = card.getAttribute('data-secondary');
          const m = card.getAttribute('data-mode');
          const nameStr = card.querySelector('strong').innerText;

          appState.updateThemeConfig({ primaryColor: p, secondaryColor: s, themeMode: m });
          logAdminAuditAction('Theme Update', 'Website Palette', `Applied preset theme '${nameStr}' (Primary: ${p}, Secondary: ${s})`);
          appState.showToast(`🎨 Theme updated to ${nameStr}!`);
          renderTabContent();
        });
      });

      // Custom theme form submit
      main.querySelector('#form-theme-colors')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const p = main.querySelector('#picker-primary-color').value;
        const s = main.querySelector('#picker-secondary-color').value;

        appState.updateThemeConfig({ primaryColor: p, secondaryColor: s, themeMode: 'light' });
        logAdminAuditAction('Theme Customization', 'Website Custom Colors', `Set custom primary: ${p}, secondary: ${s}`);
        appState.showToast('🎨 Custom theme colors applied live!');
        renderTabContent();
      });

      // Announcement form submit
      main.querySelector('#form-announcement-settings')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const enabled = main.querySelector('#chk-announcement-enabled').checked;
        const text = main.querySelector('#input-announcement-text').value.trim();

        appState.updateThemeConfig({ announcementEnabled: enabled, announcementText: text });
        logAdminAuditAction('Announcement Update', 'Header Banner', `Enabled: ${enabled} | Message: "${text}"`);
        appState.showToast('📢 Global announcement banner updated!');
      });

      // Branding form submit
      main.querySelector('#form-branding-settings')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = main.querySelector('#input-site-name').value.trim();
        const tagline = main.querySelector('#input-site-tagline').value.trim();

        appState.updateThemeConfig({ siteName: name, siteTagline: tagline });
        logAdminAuditAction('Branding Update', 'Platform Identity', `Brand Name: "${name}" | Hero Tagline: "${tagline}"`);
        appState.showToast('🏷️ Site branding updated!');
      });
    } else if (activeTab === 'pending') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 1rem;">⏳ Pending Approvals (${pendingApprovalsList.length})</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 2px solid #f1f5f9; text-align: left; font-size: 0.82rem; color: #64748b; text-transform: uppercase;">
                <th style="padding: 0.75rem;">Property Name</th>
                <th style="padding: 0.75rem;">Location</th>
                <th style="padding: 0.75rem;">Owner</th>
                <th style="padding: 0.75rem;">Submission Date</th>
                <th style="padding: 0.75rem;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${pendingApprovalsList.map(item => `
                <tr style="border-bottom: 1px solid #f1f5f9; font-size: 0.9rem;">
                  <td style="padding: 0.75rem;"><strong>${item.name}</strong></td>
                  <td style="padding: 0.75rem; color: #64748b;">${item.area}, ${item.city}</td>
                  <td style="padding: 0.75rem; color: #4338ca; font-weight: 700;">${item.owner}</td>
                  <td style="padding: 0.75rem; color: #64748b; font-family: monospace;">${item.date}</td>
                  <td style="padding: 0.75rem;">
                    <button class="btn-approve-listing" data-pending-id="${item.id}" style="background: #10b981; color: white; border: none; font-weight: 800; font-size: 0.78rem; padding: 5px 12px; border-radius: 999px; cursor: pointer;">
                      ✓ Approve Listing
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      main.querySelectorAll('.btn-approve-listing').forEach(btn => {
        btn.addEventListener('click', () => {
          const pId = btn.getAttribute('data-pending-id');
          const targetItem = pendingApprovalsList.find(p => p.id === pId);
          pendingApprovalsList = pendingApprovalsList.filter(p => p.id !== pId);
          if (targetItem) {
            logAdminAuditAction('Listing Approved', `Pending #${pId} (${targetItem.name})`, `Approved owner listing for ${targetItem.city} (${targetItem.area})`);
          }
          appState.showToast('✓ Property listing approved!');
          renderTabContent();
        });
      });

    } else if (activeTab === 'analytics') {
      main.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0;">
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">📈 Platform Analytics</h2>
          <p style="color: #64748b; font-size: 0.88rem;">Monthly user searches: +34% MoM growth in Ahmedabad and Mumbai hubs.</p>
        </div>
      `;
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

  const curState = appState.getState();
  const supportList = curState.supportMessages || [];
  const pendingCount = supportList.filter(m => m.status === 'Pending').length;
  const resetReqList = getPasswordResetRequests();
  const pendingResetCount = resetReqList.filter(r => r.status === 'Pending').length;
  const auditLogsCount = getAdminAuditLogs().length;

  container.innerHTML = `
    <aside style="background: #0f172a; color: white; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 0.35rem; border-right: 1px solid #1e293b; user-select: none;">
      <div style="padding: 0 0.5rem 1.5rem 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 0.5rem;">
        <span style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: #f59e0b; font-weight: 800;">System Admin Studio</span>
        <h3 style="color: white; font-size: 1.15rem; font-weight: 800; margin: 4px 0 0 0;">StayNest HQ CMS</h3>
      </div>

      <div class="sidebar-nav-item" data-tab-key="panel" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">📊 Platform Control Panel</div>
      <div class="sidebar-nav-item" data-tab-key="listings" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">🏢 Accommodation Listings (${ACCOMMODATIONS.length})</div>
      <div class="sidebar-nav-item" data-tab-key="audit_logs" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;">
        <span>📜 Admin Audit & Activity Logs</span>
        <span style="background: #334155; color: #f8fafc; font-size: 0.72rem; padding: 2px 7px; border-radius: 999px; font-weight: 800;">${auditLogsCount}</span>
      </div>
      <div class="sidebar-nav-item" data-tab-key="pass_requests" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;">
        <span>🔐 Password Reset Requests</span>
        ${pendingResetCount > 0 ? `<span style="background: #ef4444; color: white; font-size: 0.72rem; padding: 2px 7px; border-radius: 999px; font-weight: 800;">${pendingResetCount}</span>` : ''}
      </div>
      <div class="sidebar-nav-item" data-tab-key="credentials" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">🔑 User Login Credentials</div>
      <div class="sidebar-nav-item" data-tab-key="support" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;">
        <span>💬 Support Messages</span>
        ${pendingCount > 0 ? `<span style="background: #ef4444; color: white; font-size: 0.72rem; padding: 2px 7px; border-radius: 999px; font-weight: 800;">${pendingCount}</span>` : ''}
      </div>
      <div class="sidebar-nav-item" data-tab-key="students" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">👥 Student Users (${MOCK_STATS.totalStudents.toLocaleString()})</div>
      <div class="sidebar-nav-item" data-tab-key="owners" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">🏠 Registered PG Owners (${MOCK_STATS.totalOwners})</div>
      <div class="sidebar-nav-item" data-tab-key="pending" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">⏳ Pending Approvals (${pendingApprovalsList.length})</div>
      <div class="sidebar-nav-item" data-tab-key="analytics" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">📈 Platform Analytics</div>
      <div class="sidebar-nav-item" data-tab-key="settings" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;">⚙️ System Settings & Themes</div>
      
      <div id="btn-admin-view-website" style="margin-top: auto; padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; color: #38bdf8; font-weight: 800; border: 1px solid rgba(56,189,248,0.3); background: rgba(56,189,248,0.08); text-align: center; margin-bottom: 0.4rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
        🌐 View Public Website
      </div>
      <div id="admin-logout" style="padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; color: #ef4444; font-weight: 800; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
        🚪 Logout Admin
      </div>
    </aside>

    <main id="admin-main-content" style="padding: 2rem 2.5rem; overflow-y: auto;">
    </main>
  `;

  container.querySelectorAll('[data-tab-key]').forEach(item => {
    item.addEventListener('click', () => {
      activeTab = item.getAttribute('data-tab-key');
      updateSidebarNav();
      renderTabContent();
    });
  });

  container.querySelector('#btn-admin-view-website')?.addEventListener('click', () => {
    appState.setUserRole('student');
    appState.setPage('home');
  });

  container.querySelector('#admin-logout')?.addEventListener('click', () => {
    appState.setUserRole('student');
    appState.showToast('Logged out of System Admin Portal.');
    appState.setPage('login');
  });

  updateSidebarNav();
  root.innerHTML = '';
  root.appendChild(container);
  renderTabContent();
}
