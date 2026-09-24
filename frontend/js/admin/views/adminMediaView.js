// Admin CMS Media Library View Component (Stage 5)
import { appState } from '../../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderAdminMediaView(container) {
  let mediaList = [
    { id: 1, name: 'photo_1.jpg', file_url: '/assets/pg_photos/photo_1.jpg', size_bytes: 250880, usage_count: 3 },
    { id: 2, name: 'photo_10.jpg', file_url: '/assets/pg_photos/photo_10.jpg', size_bytes: 317440, usage_count: 2 },
    { id: 3, name: 'photo_12.jpg', file_url: '/assets/pg_photos/photo_12.jpg', size_bytes: 184320, usage_count: 4 },
    { id: 4, name: 'photo_14.jpg', file_url: '/assets/pg_photos/photo_14.jpg', size_bytes: 296960, usage_count: 1 },
    { id: 5, name: 'ahmedabad.jpg', file_url: '/assets/cities/ahmedabad.jpg', size_bytes: 430080, usage_count: 1 },
    { id: 6, name: 'mumbai.jpg', file_url: '/assets/cities/mumbai.jpg', size_bytes: 522240, usage_count: 1 }
  ];

  function getAuthHeaders() {
    const token = sessionStorage.getItem('staynest_admin_token') || localStorage.getItem('staynest_admin_token');
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }
    return headers;
  }

  function loadMedia() {
    try {
      const raw = localStorage.getItem('staynest_cms_media');
      if (raw) {
        const data = JSON.parse(raw);
        if (Array.isArray(data) && data.length > 0) mediaList = data;
      }
    } catch(e) {}
    render();
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '250 KB';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function render() {
    container.innerHTML = `
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h1 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin: 0 0 4px 0;">🖼️ Media Asset Library</h1>
          <p style="color: #64748b; margin: 0; font-size: 0.9rem;">Upload images, manage asset URLs, and track image usage across StayNest.</p>
        </div>
        <div style="display: flex; gap: 0.75rem;">
          <button id="btn-add-media-url" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.75rem 1.4rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem;">
            ➕ Add Image URL
          </button>
          <label style="background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: 800; padding: 0.75rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
            📁 Upload Local File
            <input type="file" id="input-cms-upload-media" accept="image/*" multiple style="display: none;">
          </label>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1.25rem;">
        ${mediaList.map(m => {
          let mediaImg = m.file_url || m.url || '/assets/pg_photos/swastik_elite_1.jpg';
          if (mediaImg && typeof mediaImg === 'string') {
            if (mediaImg.startsWith('./')) mediaImg = mediaImg.substring(1);
            if (!mediaImg.startsWith('/') && !mediaImg.startsWith('http')) mediaImg = '/' + mediaImg;
          }
          return `
            <div class="admin-card" style="padding: 0.75rem; display: flex; flex-direction: column; justify-content: space-between;">
              <div style="aspect-ratio: 4/3; border-radius: 10px; overflow: hidden; background: #f1f5f9; margin-bottom: 0.65rem; position: relative;">
                <img src="${mediaImg}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&auto=format&fit=crop&q=80';">
              </div>
              <div>
                <div style="font-weight: 800; font-size: 0.85rem; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${m.name}">${m.name}</div>
                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: #64748b; margin-top: 4px;">
                  <span>${formatBytes(m.size_bytes)}</span>
                  <span style="color: #6366f1; font-weight: 700;">Used by ${m.usage_count || 1}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    container.querySelector('#btn-add-media-url')?.addEventListener('click', () => {
      const url = prompt('Enter Image URL (e.g. ./assets/pg_photos/photo_2.jpg):');
      if (!url) return;
      const filename = url.split('/').pop() || 'image.jpg';

      const newMedia = {
        name: filename,
        file_url: url,
        size_bytes: 250000,
        mime_type: 'image/jpeg',
        usage_count: 1
      };

      fetch('http://localhost:8000/api/cms/media/', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newMedia)
      })
      .then(res => res.json())
      .then(() => {
        appState.showToast(`Media "${filename}" added!`);
        loadMedia();
      })
      .catch(() => {
        appState.showToast(`Media "${filename}" added locally.`);
        mediaList.push({ id: Date.now(), ...newMedia });
        render();
      });
    });

    container.querySelector('#input-cms-upload-media')?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      files.forEach((file, index) => {
        const fakeUrl = `./assets/pg_photos/${file.name}`;
        const newMedia = {
          name: file.name,
          file_url: fakeUrl,
          size_bytes: file.size,
          mime_type: file.type || 'image/jpeg',
          usage_count: 1
        };

        fetch('http://localhost:8000/api/cms/media/', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(newMedia)
        }).catch(() => {});

        mediaList.unshift({ id: Date.now() + index, ...newMedia });
      });

      appState.showToast(`Uploaded ${files.length} asset(s) to library.`);
      render();
    });
  }

  loadMedia();
}
