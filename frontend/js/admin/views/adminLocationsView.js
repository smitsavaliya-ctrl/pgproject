// Admin CMS Location Manager View Component (Stage 5)
import { appState } from '../../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderAdminLocationsView(container) {
  let cities = [
    { id: 1, name: 'Ahmedabad', latitude: 23.0225, longitude: 72.5714, image_url: './assets/cities/ahmedabad.jpg', pg_count: 200 },
    { id: 2, name: 'Mumbai', latitude: 19.0760, longitude: 72.8777, image_url: './assets/cities/mumbai.jpg', pg_count: 200 },
    { id: 3, name: 'Bengaluru', latitude: 12.9716, longitude: 77.5946, image_url: './assets/cities/bengaluru.jpg', pg_count: 200 },
    { id: 4, name: 'Delhi', latitude: 28.7041, longitude: 77.1025, image_url: './assets/cities/delhi.jpg', pg_count: 200 },
    { id: 5, name: 'Pune', latitude: 18.5204, longitude: 73.8567, image_url: './assets/cities/pune.jpg', pg_count: 200 },
    { id: 6, name: 'Jaipur', latitude: 26.9124, longitude: 75.7873, image_url: './assets/cities/jaipur.jpg', pg_count: 200 }
  ];

  function getAuthHeaders() {
    const token = sessionStorage.getItem('staynest_admin_token') || localStorage.getItem('staynest_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }

  function loadCities() {
    fetch('http://localhost:8000/api/cities/')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) cities = data;
        render();
      })
      .catch(() => render());
  }

  function render() {
    container.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">📍 Location & City Manager</h1>
          <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Manage target cities, geographic coordinates, areas, and major educational institutions.</p>
        </div>
        <button id="btn-add-city" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem;">
          ➕ Add New City
        </button>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem;">
        ${cities.map(c => {
          const cityFallbacks = {
            'Ahmedabad': 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=300&auto=format&fit=crop&q=80',
            'Mumbai': 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300&auto=format&fit=crop&q=80',
            'Bengaluru': 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300&auto=format&fit=crop&q=80',
            'Delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300&auto=format&fit=crop&q=80',
            'Pune': 'https://images.unsplash.com/photo-1625244724120-1fd1d34d00f6?w=300&auto=format&fit=crop&q=80',
            'Jaipur': 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=300&auto=format&fit=crop&q=80'
          };
          const fallback = cityFallbacks[c.name] || 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?w=300&auto=format&fit=crop&q=80';
          let cityImg = c.image_url || `/assets/cities/${c.name ? c.name.toLowerCase() : 'ahmedabad'}.jpg`;
          if (cityImg && typeof cityImg === 'string') {
            if (cityImg.startsWith('./')) cityImg = cityImg.substring(1);
            if (!cityImg.startsWith('/') && !cityImg.startsWith('http')) cityImg = '/' + cityImg;
          }
          return `
            <div class="admin-card" style="display: flex; flex-direction: column; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 1rem;">
                <img src="${cityImg}" alt="${c.name}" onerror="this.onerror=null; this.src='${fallback}';" style="width: 52px; height: 52px; border-radius: 12px; object-fit: cover; border: 1px solid #e2e8f0;">
                <div>
                  <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0;">${c.name}</h3>
                  <div style="font-size: 0.76rem; color: #64748b; font-family: monospace;">Lat: ${c.latitude}, Lng: ${c.longitude}</div>
                  <div style="font-size: 0.76rem; color: #6366f1; font-weight: 700; margin-top: 2px;">Used by ${c.pg_count || 0} listings</div>
                </div>
              </div>
              <div style="display: flex; gap: 8px;">
                <button class="btn-edit-city" data-id="${c.id}" data-name="${c.name}" style="flex: 1; background: #f1f5f9; color: #334155; border: none; font-weight: 700; padding: 0.5rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem;">✏️ Edit</button>
                <button class="btn-delete-city" data-id="${c.id}" data-name="${c.name}" data-count="${c.pg_count || 0}" style="background: #fee2e2; color: #dc2626; border: none; font-weight: 700; padding: 0.5rem 0.75rem; border-radius: 8px; cursor: pointer; font-size: 0.82rem;">🗑️ Delete</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#btn-add-city')?.addEventListener('click', () => {
      const name = prompt('Enter New City Name:');
      if (!name) return;
      
      const newCity = {
        name: name,
        latitude: 20.0,
        longitude: 77.0,
        image_url: './assets/cities/ahmedabad.jpg'
      };

      fetch('http://localhost:8000/api/cities/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newCity)
      })
      .then(res => res.json())
      .then(() => {
        appState.showToast(`City "${name}" added to database!`);
        window.dispatchEvent(new CustomEvent('cms-data-updated'));
        loadCities();
      })
      .catch(() => {
        appState.showToast(`City "${name}" added locally.`);
        cities.push({ id: Date.now(), ...newCity });
        window.dispatchEvent(new CustomEvent('cms-data-updated'));
        render();
      });
    });

    container.querySelectorAll('.btn-edit-city').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const oldName = btn.getAttribute('data-name');
        const newName = prompt(`Edit City Name for "${oldName}":`, oldName);
        if (!newName || newName === oldName) return;

        fetch(`http://localhost:8000/api/cities/${id}/`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({ name: newName })
        })
        .then(() => {
          appState.showToast(`City renamed to "${newName}".`);
          window.dispatchEvent(new CustomEvent('cms-data-updated'));
          loadCities();
        })
        .catch(() => {
          const c = cities.find(item => item.id == id);
          if (c) c.name = newName;
          window.dispatchEvent(new CustomEvent('cms-data-updated'));
          render();
        });
      });
    });

    container.querySelectorAll('.btn-delete-city').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const count = parseInt(btn.getAttribute('data-count') || '0');

        let msg = `Are you sure you want to delete city "${name}"?`;
        if (count > 0) {
          msg = `⚠️ Warning: This city is currently used by ${count} active listing(s).\nAre you sure you want to remove city "${name}"?`;
        }

        if (confirm(msg)) {
          fetch(`http://localhost:8000/api/cities/${id}/`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          })
          .then(() => {
            appState.showToast(`City "${name}" removed.`);
            loadCities();
          })
          .catch(() => {
            cities = cities.filter(c => c.id != id);
            render();
          });
        }
      });
    });
  }

  loadCities();
}
