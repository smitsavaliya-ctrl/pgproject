import { appState, normalizePropertyFromDB } from '../../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../../dataset.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { logAdminAuditAction } from '../../pages/auth.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderAdminListingsView(container) {
  let currentPage = 1;
  let pageSize = 25;
  let totalCount = 0;
  let totalPages = 1;

  let searchQuery = '';
  let selectedCity = 'all';
  let selectedGender = 'all';
  let selectedType = 'all';
  let selectedStatus = 'active';
  let selectedSort = 'id_desc';

  let currentListings = [];
  let isLoading = false;
  let errorMessage = '';

  function getAuthHeaders() {
    const token = sessionStorage.getItem('staynest_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }

  function fetchListings() {
    isLoading = true;
    errorMessage = '';
    render();

    const params = new URLSearchParams();
    params.set('page', currentPage);
    params.set('page_size', pageSize);

    if (searchQuery) params.set('search', searchQuery);
    if (selectedCity !== 'all') params.set('city', selectedCity);
    if (selectedGender !== 'all') params.set('gender', selectedGender);
    if (selectedType !== 'all') params.set('property_type', selectedType);
    if (selectedStatus !== 'all') params.set('status', selectedStatus);
    if (selectedSort) params.set('sort', selectedSort);

    fetch(`http://localhost:8000/api/properties/?${params.toString()}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          sessionStorage.removeItem('staynest_auth_admin');
          sessionStorage.removeItem('staynest_admin_token');
          if (window.history && window.history.pushState) {
            window.history.pushState({}, '', '/admin-login');
          }
          throw new Error('Admin session expired. Please log in again.');
        }
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.json();
      })
      .then(data => {
        isLoading = false;
        if (data && data.results !== undefined) {
          currentListings = data.results;
          totalCount = data.count || 0;
          totalPages = Math.ceil(totalCount / pageSize) || 1;
        } else if (Array.isArray(data)) {
          currentListings = data;
          totalCount = data.length;
          totalPages = 1;
        }
        render();
      })
      .catch(() => {
        isLoading = false;
        let filtered = [...ACCOMMODATIONS];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(p => (p.name && p.name.toLowerCase().includes(q)) || (p.area && p.area.toLowerCase().includes(q)) || (p.city && p.city.toLowerCase().includes(q)));
        }
        if (selectedCity !== 'all') filtered = filtered.filter(p => (p.city || '').toLowerCase() === selectedCity.toLowerCase());
        if (selectedGender !== 'all') filtered = filtered.filter(p => (p.gender || '').toLowerCase().includes(selectedGender.toLowerCase()));
        if (selectedStatus === 'active') filtered = filtered.filter(p => p.is_active !== false);
        else if (selectedStatus === 'archived') filtered = filtered.filter(p => p.is_active === false);

        totalCount = filtered.length;
        totalPages = Math.ceil(totalCount / pageSize) || 1;
        const start = (currentPage - 1) * pageSize;
        currentListings = filtered.slice(start, start + pageSize);
        render();
      });
  }

  function render() {
    const startIdx = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endIdx = Math.min(currentPage * pageSize, totalCount);

    container.innerHTML = `
      <!-- Header Bar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0; font-family: 'Plus Jakarta Sans', sans-serif;">
            🏢 Accommodation Listings CMS
          </h1>
          <p style="color: #64748b; margin: 0; font-size: 0.9rem;">
            Real-time management for <strong style="color: #6366f1;">${totalCount.toLocaleString()}</strong> database listings connected to SQLite.
          </p>
        </div>
        <button id="btn-cms-open-add-modal" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35); display: flex; align-items: center; gap: 8px;">
          ➕ Add New Listing
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="admin-card" style="margin-bottom: 1.25rem; padding: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <div style="flex: 2; min-width: 260px;">
            <input type="text" id="input-cms-search" placeholder="🔍 Search property name, area, address, city..." value="${searchQuery}" style="width: 100%; padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.9rem; outline: none; box-sizing: border-box;">
          </div>
          
          <select id="select-cms-city" style="padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 600; background: white; cursor: pointer;">
            <option value="all" ${selectedCity === 'all' ? 'selected' : ''}>All Cities</option>
            <option value="Ahmedabad" ${selectedCity === 'Ahmedabad' ? 'selected' : ''}>Ahmedabad</option>
            <option value="Bengaluru" ${selectedCity === 'Bengaluru' ? 'selected' : ''}>Bengaluru</option>
            <option value="Delhi" ${selectedCity === 'Delhi' ? 'selected' : ''}>Delhi</option>
            <option value="Jaipur" ${selectedCity === 'Jaipur' ? 'selected' : ''}>Jaipur</option>
            <option value="Mumbai" ${selectedCity === 'Mumbai' ? 'selected' : ''}>Mumbai</option>
            <option value="Pune" ${selectedCity === 'Pune' ? 'selected' : ''}>Pune</option>
          </select>

          <select id="select-cms-gender" style="padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 600; background: white; cursor: pointer;">
            <option value="all" ${selectedGender === 'all' ? 'selected' : ''}>All Genders</option>
            <option value="Boys" ${selectedGender === 'Boys' ? 'selected' : ''}>Boys</option>
            <option value="Girls" ${selectedGender === 'Girls' ? 'selected' : ''}>Girls</option>
            <option value="Unisex" ${selectedGender === 'Unisex' ? 'selected' : ''}>Unisex</option>
          </select>

          <select id="select-cms-status" style="padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 600; background: white; cursor: pointer;">
            <option value="active" ${selectedStatus === 'active' ? 'selected' : ''}>🟢 Active Only</option>
            <option value="archived" ${selectedStatus === 'archived' ? 'selected' : ''}>📦 Archived Only</option>
            <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>All Statuses</option>
          </select>

          <select id="select-cms-sort" style="padding: 0.65rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 0.88rem; font-weight: 600; background: white; cursor: pointer;">
            <option value="id_desc" ${selectedSort === 'id_desc' ? 'selected' : ''}>Sort: Newest First</option>
            <option value="rent_asc" ${selectedSort === 'rent_asc' ? 'selected' : ''}>Sort: Rent Low → High</option>
            <option value="rent_desc" ${selectedSort === 'rent_desc' ? 'selected' : ''}>Sort: Rent High → Low</option>
            <option value="name_asc" ${selectedSort === 'name_asc' ? 'selected' : ''}>Sort: Name A-Z</option>
            <option value="rating_desc" ${selectedSort === 'rating_desc' ? 'selected' : ''}>Sort: Highest Rating</option>
          </select>
        </div>
      </div>

      <!-- Error State -->
      ${errorMessage ? `
        <div style="background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 1rem 1.25rem; border-radius: 12px; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
          <span>⚠️ ${errorMessage}</span>
          <button id="btn-cms-retry-fetch" style="background: #dc2626; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-weight: 800; cursor: pointer;">Retry</button>
        </div>
      ` : ''}

      <!-- Listings Table Card -->
      <div class="admin-card" style="padding: 0; overflow-x: auto; position: relative;">
        ${isLoading ? `
          <div style="padding: 3rem; text-align: center; color: #6366f1; font-weight: 800; font-size: 1.1rem;">
            ⏳ Fetching real property records from Django database...
          </div>
        ` : currentListings.length === 0 ? `
          <div style="padding: 3rem; text-align: center; color: #64748b; font-weight: 700;">
            🔍 No listings found matching your active filters.
          </div>
        ` : `
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 70px;">ID</th>
                <th>Property Details</th>
                <th>City / Area</th>
                <th>Rent / Mo</th>
                <th>Type / Gender</th>
                <th>Status</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${currentListings.map(item => {
                let mainImg = (Array.isArray(item.images) && item.images[0]) || (typeof item.images === 'string' && item.images.startsWith('[') ? JSON.parse(item.images)[0] : item.images) || '/assets/pg_photos/swastik_elite_1.jpg';
                if (mainImg && typeof mainImg === 'string') {
                  if (mainImg.startsWith('./')) mainImg = mainImg.substring(1);
                  if (!mainImg.startsWith('/') && !mainImg.startsWith('http')) mainImg = '/' + mainImg;
                }
                return `
                  <tr style="${!item.is_active ? 'opacity: 0.6; background: #fafafa;' : ''}">
                    <td style="font-family: monospace; font-weight: 800; color: #64748b;">#${item.id}</td>
                    <td>
                      <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="${mainImg}" alt="${item.name}" onerror="this.onerror=null; this.src='/assets/pg_photos/swastik_elite_1.jpg';" style="width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid #e2e8f0;">
                        <div>
                          <div style="font-weight: 800; color: #0f172a; font-size: 0.92rem; display: flex; align-items: center; gap: 6px;">
                            ${item.name}
                            ${item.is_featured ? '<span style="background: #fef3c7; color: #d97706; font-size: 0.7rem; padding: 2px 6px; border-radius: 4px; font-weight: 800;">⭐ Featured</span>' : ''}
                          </div>
                          <div style="font-size: 0.78rem; color: #64748b;">⭐ ${item.rating || 4.5} rating ${item.verified ? '• Verified ✅' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style="font-weight: 800; color: #334155; font-size: 0.88rem;">${item.city_name || item.city || 'N/A'}</div>
                      <div style="font-size: 0.78rem; color: #64748b;">${item.area || 'N/A'}</div>
                    </td>
                    <td style="font-weight: 800; color: #6366f1; font-size: 0.92rem;">
                      ₹${(item.rent || 7500).toLocaleString()}
                    </td>
                    <td>
                      <div style="display: flex; gap: 4px; flex-direction: column; align-items: flex-start;">
                        <span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.72rem; padding: 2px 8px; border-radius: 999px;">
                          ${item.property_type || 'PG'}
                        </span>
                        <span style="background: #f1f5f9; color: #475569; font-weight: 700; font-size: 0.72rem; padding: 2px 8px; border-radius: 999px;">
                          ${item.gender || 'Unisex'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style="background: ${item.is_active ? '#dcfce7' : '#fee2e2'}; color: ${item.is_active ? '#166534' : '#991b1b'}; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 999px;">
                        ${item.is_active ? '🟢 Active' : '📦 Archived'}
                      </span>
                    </td>
                    <td style="text-align: right;">
                      <div style="display: inline-flex; gap: 6px;">
                        <button class="btn-cms-edit-prop" data-id="${item.id}" title="Edit Listing" style="background: #e0e7ff; color: #4338ca; border: none; font-weight: 800; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                          ✏️ Edit
                        </button>
                        <button class="btn-cms-toggle-feature" data-id="${item.id}" title="${item.is_featured ? 'Unfeature' : 'Feature'}" style="background: ${item.is_featured ? '#fef3c7' : '#f1f5f9'}; color: ${item.is_featured ? '#d97706' : '#64748b'}; border: none; font-weight: 800; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                          ${item.is_featured ? '⭐' : '☆'}
                        </button>
                        <button class="btn-cms-toggle-archive" data-id="${item.id}" title="${item.is_active ? 'Archive' : 'Restore'}" style="background: #f1f5f9; color: #475569; border: none; font-weight: 800; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                          ${item.is_active ? '📦' : '🔄'}
                        </button>
                        <button class="btn-cms-delete-prop" data-id="${item.id}" title="Permanently Delete" style="background: #fee2e2; color: #dc2626; border: none; font-weight: 800; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 0.8rem;">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `}
      </div>

      <!-- Pagination Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.25rem; flex-wrap: wrap; gap: 1rem;">
        <div style="font-size: 0.85rem; color: #64748b; font-weight: 700;">
          Showing <strong style="color: #0f172a;">${startIdx}–${endIdx}</strong> of <strong style="color: #6366f1;">${totalCount.toLocaleString()}</strong> listings
        </div>

        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="btn-cms-prev-page" ${currentPage <= 1 || isLoading ? 'disabled' : ''} style="background: white; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; color: #334155; opacity: ${currentPage <= 1 ? 0.5 : 1};">
            ← Previous
          </button>
          <span style="font-size: 0.88rem; font-weight: 800; color: #0f172a; padding: 0 8px;">
            Page ${currentPage} of ${totalPages}
          </span>
          <button id="btn-cms-next-page" ${currentPage >= totalPages || isLoading ? 'disabled' : ''} style="background: white; border: 1px solid #cbd5e1; padding: 6px 14px; border-radius: 8px; font-weight: 700; cursor: pointer; color: #334155; opacity: ${currentPage >= totalPages ? 0.5 : 1};">
            Next →
          </button>
        </div>
      </div>

      <!-- Edit / Add Modal Container -->
      <div id="cms-listing-modal-container"></div>
    `;

    attachEventHandlers();
  }

  function attachEventHandlers() {
    container.querySelector('#input-cms-search')?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      currentPage = 1;
      fetchListings();
    });

    container.querySelector('#select-cms-city')?.addEventListener('change', (e) => {
      selectedCity = e.target.value;
      currentPage = 1;
      fetchListings();
    });

    container.querySelector('#select-cms-gender')?.addEventListener('change', (e) => {
      selectedGender = e.target.value;
      currentPage = 1;
      fetchListings();
    });

    container.querySelector('#select-cms-status')?.addEventListener('change', (e) => {
      selectedStatus = e.target.value;
      currentPage = 1;
      fetchListings();
    });

    container.querySelector('#select-cms-sort')?.addEventListener('change', (e) => {
      selectedSort = e.target.value;
      currentPage = 1;
      fetchListings();
    });

    container.querySelector('#btn-cms-prev-page')?.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchListings();
      }
    });

    container.querySelector('#btn-cms-next-page')?.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        fetchListings();
      }
    });

    container.querySelector('#btn-cms-retry-fetch')?.addEventListener('click', () => {
      fetchListings();
    });

    container.querySelector('#btn-cms-open-add-modal')?.addEventListener('click', () => {
      openAddEditModal(null);
    });

    // Table Button Handlers
    container.querySelectorAll('.btn-cms-edit-prop').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.id;
        const item = currentListings.find(l => String(l.id) === String(propId));
        openAddEditModal(item || propId);
      });
    });

    container.querySelectorAll('.btn-cms-toggle-feature').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.id;
        fetch(`http://localhost:8000/api/properties/${propId}/toggle_featured/`, {
          method: 'POST',
          headers: getAuthHeaders()
        })
          .then(res => res.json())
          .then(data => {
            const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(propId));
            if (idx !== -1 && data && data.is_featured !== undefined) {
              ACCOMMODATIONS[idx].is_featured = data.is_featured;
            }
            logAdminAuditAction('Status Toggle', `Listing #${propId}`, `Featured status updated to: ${data.is_featured ? '⭐ Featured' : 'Normal'}`);
            window.dispatchEvent(new CustomEvent('cms-data-updated'));
            appState.showToast('⭐ Featured status updated in SQLite database!');
            fetchListings();
          })
          .catch(err => appState.showToast(`❌ Error: ${err.message}`));
      });
    });

    container.querySelectorAll('.btn-cms-toggle-archive').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.id;
        fetch(`http://localhost:8000/api/properties/${propId}/toggle_archive/`, {
          method: 'POST',
          headers: getAuthHeaders()
        })
          .then(res => res.json())
          .then(data => {
            const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(propId));
            if (idx !== -1 && data && data.is_active !== undefined) {
              ACCOMMODATIONS[idx].is_active = data.is_active;
            }
            logAdminAuditAction('Status Toggle', `Listing #${propId}`, `Archive status updated: ${data.message || 'Status updated'}`);
            window.dispatchEvent(new CustomEvent('cms-data-updated'));
            appState.showToast(`📦 ${data.message || 'Status updated.'}`);
            fetchListings();
          })
          .catch(err => appState.showToast(`❌ Error: ${err.message}`));
      });
    });

    container.querySelectorAll('.btn-cms-delete-prop').forEach(btn => {
      btn.addEventListener('click', () => {
        const propId = btn.dataset.id;
        if (confirm(`🚨 Are you sure you want to permanently delete Listing #${propId}? This operation cannot be undone.`)) {
          fetch(`http://localhost:8000/api/properties/${propId}/`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          })
            .then(res => {
              if (res.ok || res.status === 204) {
                const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(propId));
                if (idx !== -1) {
                  ACCOMMODATIONS.splice(idx, 1);
                }
                logAdminAuditAction('Property Delete', `Listing #${propId}`, `Listing #${propId} permanently deleted from database`);
                window.dispatchEvent(new CustomEvent('cms-data-updated'));
                appState.showToast(`🗑️ Listing #${propId} deleted permanently.`);
                fetchListings();
              } else {
                throw new Error('Failed to delete listing.');
              }
            })
            .catch(err => appState.showToast(`❌ Error deleting listing: ${err.message}`));
        }
      });
    });
  }

  function openAddEditModal(listingOrId) {
    const modalHost = container.querySelector('#cms-listing-modal-container');
    if (!modalHost) return;

    const isEdit = !!listingOrId;
    let propData = typeof listingOrId === 'object' ? listingOrId : null;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop';
    modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 1.5rem;';

    const DB_CITIES = [
      { id: 5, name: 'Ahmedabad' },
      { id: 1, name: 'Bengaluru' },
      { id: 2, name: 'Delhi' },
      { id: 4, name: 'Jaipur' },
      { id: 6, name: 'Mumbai' },
      { id: 3, name: 'Pune' }
    ];

    const currentCityId = propData ? (
      typeof propData.city === 'number' ? propData.city : (
        typeof propData.city === 'object' && propData.city ? propData.city.id : (
          propData.city_name ? (DB_CITIES.find(c => c.name.toLowerCase() === propData.city_name.toLowerCase()) || {}).id : 5
        )
      )
    ) : 5;

    const currentArea = propData ? (propData.area || propData.locality || '') : '';
    const currentGender = propData ? (propData.gender || 'Unisex') : 'Unisex';

    let currentImages = [];
    if (propData && propData.images) {
      if (Array.isArray(propData.images)) {
        currentImages = [...propData.images];
      } else if (typeof propData.images === 'string') {
        try {
          const parsed = JSON.parse(propData.images);
          currentImages = Array.isArray(parsed) ? parsed : [propData.images];
        } catch(e) {
          currentImages = [propData.images];
        }
      }
    }
    if (currentImages.length === 0) {
      currentImages = ['/assets/pg_photos/swastik_elite_1.jpg'];
    }
    currentImages = currentImages.map(img => {
      if (!img) return '/assets/pg_photos/swastik_elite_1.jpg';
      let s = String(img).trim();
      if (s.startsWith('./')) s = s.substring(1);
      if (!s.startsWith('/') && !s.startsWith('http')) s = '/' + s;
      return s;
    });

    modal.innerHTML = `
      <div style="background: white; border-radius: 20px; max-width: 660px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); padding: 2rem; position: relative;">
        <button id="btn-close-cms-modal" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-weight: 800; cursor: pointer;">✕</button>

        <h2 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0 0 1.25rem 0;">
          ${isEdit ? `✏️ Edit Listing #${propData ? propData.id : listingOrId}` : '➕ Add New Accommodation Listing'}
        </h2>

        <form id="form-cms-property-edit" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Property Name *</label>
            <input type="text" id="editor-name" required value="${propData ? propData.name : ''}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box; outline: none;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">City *</label>
              <select id="editor-city" required style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box; background: white;">
                ${DB_CITIES.map(c => `
                  <option value="${c.id}" ${currentCityId === c.id ? 'selected' : ''}>${c.name}</option>
                `).join('')}
              </select>
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Area / Locality *</label>
              <input type="text" id="editor-area" required value="${currentArea}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box; outline: none;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Address *</label>
            <input type="text" id="editor-address" required value="${propData ? propData.address : ''}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box; outline: none;">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Rent / Month (₹) *</label>
              <input type="number" id="editor-rent" required value="${propData ? propData.rent : 7500}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Security Deposit (₹)</label>
              <input type="number" id="editor-deposit" value="${propData ? propData.security_deposit : 15000}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Gender *</label>
              <select id="editor-gender" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white;">
                <option value="Boys" ${(propData && propData.gender === 'Boys') ? 'selected' : ''}>Boys</option>
                <option value="Girls" ${(propData && propData.gender === 'Girls') ? 'selected' : ''}>Girls</option>
                <option value="Unisex" ${(propData && propData.gender === 'Unisex') ? 'selected' : ''}>Unisex</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Property Type</label>
              <input type="text" id="editor-type" value="${propData ? (propData.property_type || 'PG') : 'PG'}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box;">
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Contact Phone</label>
              <input type="text" id="editor-phone" value="${propData ? propData.phone : '+91 98765 12345'}" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 4px;">Description</label>
            <textarea id="editor-description" rows="3" style="width: 100%; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; box-sizing: border-box; font-family: inherit;">${propData ? propData.description : ''}</textarea>
          </div>

          <!-- Property Photos & Gallery Section -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem; margin-top: 0.25rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <label style="font-size: 0.85rem; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 6px; margin: 0;">
                <span>🖼️ Property Photos & Media Gallery</span>
                <span style="font-size: 0.75rem; color: #64748b; font-weight: 600;" id="images-count-badge">(${currentImages.length} photos)</span>
              </label>
            </div>

            <!-- Existing Images Thumbnail Grid with Remove Button -->
            <div id="editor-images-preview-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px; margin-bottom: 1rem; max-height: 180px; overflow-y: auto; padding: 4px;">
            </div>

            <!-- Add Image URL & File Upload Input Controls -->
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <div style="display: flex; gap: 8px;">
                <input type="text" id="input-add-image-url" placeholder="Paste Image URL (e.g. ./assets/pg_photos/photo_2.jpg or https://...)" style="flex: 1; padding: 0.6rem 0.85rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.85rem; box-sizing: border-box;">
                <button type="button" id="btn-add-image-url" style="background: #6366f1; color: white; border: none; font-weight: 700; padding: 0.6rem 1.1rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem; white-space: nowrap;">
                  ➕ Add URL
                </button>
              </div>

              <div style="display: flex; align-items: center; gap: 10px; font-size: 0.8rem; color: #64748b;">
                <span style="font-weight: 700;">OR Upload File:</span>
                <input type="file" id="input-upload-image-file" accept="image/*" style="font-size: 0.8rem; color: #334155; cursor: pointer;">
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 1.5rem; align-items: center; padding: 0.5rem 0;">
            <label style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="editor-verified" ${(propData && propData.verified) ? 'checked' : 'checked'}> Verified ✅
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="editor-featured" ${(propData && propData.is_featured) ? 'checked' : ''}> Featured Listing ⭐
            </label>
            <label style="display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
              <input type="checkbox" id="editor-active" ${(propData && propData.is_active === false) ? '' : 'checked'}> Active 🟢
            </label>
          </div>

          <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1rem;">
            <button type="button" id="btn-cancel-cms-modal" style="background: #f1f5f9; color: #475569; border: none; font-weight: 700; padding: 0.75rem 1.25rem; border-radius: 10px; cursor: pointer;">Cancel</button>
            <button type="submit" id="btn-save-cms-property" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">
              ${isEdit ? '💾 Save Changes' : '✨ Create Listing'}
            </button>
          </div>
        </form>
      </div>
    `;

    modalHost.appendChild(modal);

    const closeModal = () => modal.remove();

    modal.querySelector('#btn-close-cms-modal')?.addEventListener('click', closeModal);
    modal.querySelector('#btn-cancel-cms-modal')?.addEventListener('click', closeModal);

    // Gallery Render & Interactivity Handlers
    function renderImagesGallery() {
      const grid = modal.querySelector('#editor-images-preview-grid');
      const badge = modal.querySelector('#images-count-badge');
      if (!grid) return;

      if (badge) badge.textContent = `(${currentImages.length} photo${currentImages.length === 1 ? '' : 's'})`;

      if (currentImages.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: #94a3b8; font-size: 0.82rem; font-weight: 600; padding: 1rem;">No photos added yet. Add an Image URL or Upload a File above.</div>`;
        return;
      }

      grid.innerHTML = currentImages.map((imgUrl, idx) => {
        let cleanUrl = imgUrl || '/assets/pg_photos/swastik_elite_1.jpg';
        if (cleanUrl && typeof cleanUrl === 'string') {
          if (cleanUrl.startsWith('./')) cleanUrl = cleanUrl.substring(1);
          if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http')) cleanUrl = '/' + cleanUrl;
        }
        return `
          <div style="position: relative; width: 100%; aspect-ratio: 1; border-radius: 10px; overflow: hidden; border: 2px solid #cbd5e1; background: #f8fafc;">
            <img src="${cleanUrl}" onerror="this.onerror=null; this.src='/assets/pg_photos/swastik_elite_1.jpg';" style="width: 100%; height: 100%; object-fit: cover;">
            <button type="button" class="btn-remove-image-thumb" data-idx="${idx}" title="Remove Photo" style="position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.9); color: white; border: none; width: 22px; height: 22px; border-radius: 50%; font-size: 0.7rem; font-weight: 900; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">✕</button>
          </div>
        `;
      }).join('');

      grid.querySelectorAll('.btn-remove-image-thumb').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const removeIdx = parseInt(btn.getAttribute('data-idx'));
          if (!isNaN(removeIdx)) {
            currentImages.splice(removeIdx, 1);
            renderImagesGallery();
          }
        });
      });
    }

    renderImagesGallery();

    // Add Image URL Event
    modal.querySelector('#btn-add-image-url')?.addEventListener('click', (e) => {
      e.preventDefault();
      const input = modal.querySelector('#input-add-image-url');
      const val = input ? input.value.trim() : '';
      if (val) {
        currentImages.push(val);
        input.value = '';
        renderImagesGallery();
      }
    });

    // Upload Local File Event
    modal.querySelector('#input-upload-image-file')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target && evt.target.result) {
            currentImages.push(evt.target.result);
            renderImagesGallery();
            e.target.value = '';
          }
        };
        reader.readAsDataURL(file);
      }
    });

    modal.querySelector('#form-cms-property-edit')?.addEventListener('submit', (e) => {
      e.preventDefault();

      const payload = {
        name: modal.querySelector('#editor-name').value.trim(),
        city: parseInt(modal.querySelector('#editor-city').value),
        area: modal.querySelector('#editor-area').value.trim(),
        address: modal.querySelector('#editor-address').value.trim(),
        rent: intOr(modal.querySelector('#editor-rent').value, 7500),
        security_deposit: intOr(modal.querySelector('#editor-deposit').value, 15000),
        gender: modal.querySelector('#editor-gender').value,
        property_type: modal.querySelector('#editor-type').value.trim() || 'PG',
        phone: modal.querySelector('#editor-phone').value.trim(),
        description: modal.querySelector('#editor-description').value.trim(),
        images: JSON.stringify(currentImages.length > 0 ? currentImages : ['./assets/pg_photos/photo_1.jpg']),
        verified: modal.querySelector('#editor-verified').checked,
        is_featured: modal.querySelector('#editor-featured').checked,
        is_active: modal.querySelector('#editor-active').checked,
      };

      const url = isEdit
        ? `http://localhost:8000/api/properties/${propData ? propData.id : listingOrId}/`
        : 'http://localhost:8000/api/properties/';
      
      const method = isEdit ? 'PUT' : 'POST';

      fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      })
        .then(res => {
          if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
          return res.json();
        })
        .then(data => {
          closeModal();
          if (data && data.id) {
            const normalizedProp = normalizePropertyFromDB(data);
            const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(data.id));
            if (idx !== -1) {
              ACCOMMODATIONS[idx] = { ...ACCOMMODATIONS[idx], ...normalizedProp };
            } else {
              ACCOMMODATIONS.unshift(normalizedProp);
            }

            try {
              let cache = JSON.parse(localStorage.getItem('staynest_cms_edits_cache') || '[]');
              const cIdx = cache.findIndex(p => String(p.id) === String(data.id));
              if (cIdx !== -1) {
                cache[cIdx] = { ...cache[cIdx], ...normalizedProp };
              } else {
                cache.push(normalizedProp);
              }
              localStorage.setItem('staynest_cms_edits_cache', JSON.stringify(cache));
            } catch(e) {}

            logAdminAuditAction(
              isEdit ? 'Property Edit' : 'Property Creation',
              `Listing #${normalizedProp.id} (${normalizedProp.name})`,
              isEdit ? `Property details updated in database (Rent: ₹${normalizedProp.rent.toLocaleString()}/mo, City: ${normalizedProp.city})` : `New property created in ${normalizedProp.city} for ₹${normalizedProp.rent.toLocaleString()}/mo`
            );
          }
          window.dispatchEvent(new CustomEvent('cms-data-updated'));
          appState.showToast(`✅ Listing ${isEdit ? 'updated' : 'created'} successfully in SQLite database!`);
          fetchListings();
        })
        .catch(err => {
          alert(`Error saving listing: ${err.message}`);
        });
    });
  }

  function intOr(val, fallback) {
    const num = parseInt(val);
    return isNaN(num) ? fallback : num;
  }

  // Initial Fetch
  fetchListings();
}
