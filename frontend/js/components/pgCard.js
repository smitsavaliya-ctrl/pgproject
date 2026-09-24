// PG Accommodation Card Component for StayNest (Fail-Safe & Purple Brand Theme with Both Boys & Girls Label & Interactive 360° Street View Modal)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function createPGCard(pg) {
  if (!pg) return document.createElement('div');

  const state = appState.getState();
  const isWishlisted = (state.wishlist || []).includes(pg.id);
  const isCompared = (state.compareList || []).includes(pg.id);

  const card = document.createElement('div');
  card.className = 'pg-card';
  card.style.background = 'white';
  card.style.borderRadius = 'var(--radius-xl)';
  card.style.overflow = 'hidden';
  card.style.boxShadow = 'var(--shadow-md)';
  card.style.border = '1px solid var(--secondary-200)';
  card.style.display = 'flex';
  card.style.flexDirection = 'column';
  card.style.cursor = 'pointer';
  card.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-4px)';
    card.style.boxShadow = '0 12px 28px -6px rgba(99, 102, 241, 0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'none';
    card.style.boxShadow = 'var(--shadow-md)';
  });

  const rawGender = pg.gender || 'Boys';
  const displayGender = (rawGender === 'Co-ed' || rawGender.toLowerCase() === 'unisex') ? 'Both Boys & Girls' : rawGender;

  const genderStr = rawGender.toLowerCase();
  const genderColor = genderStr === 'boys' ? '#2563eb' : (genderStr === 'girls' ? '#ec4899' : '#8b5cf6');

  // Fail-safe image extraction
  let rawList = [];
  if (Array.isArray(pg.images)) rawList = pg.images;
  else if (Array.isArray(pg.photos)) rawList = pg.photos;
  else if (typeof pg.images === 'string' && pg.images.trim()) {
    try {
      const parsed = JSON.parse(pg.images);
      if (Array.isArray(parsed)) rawList = parsed;
      else rawList = [pg.images];
    } catch(e) {
      rawList = [pg.images];
    }
  } else if (typeof pg.photos === 'string' && pg.photos.trim()) {
    rawList = [pg.photos];
  } else if (pg.image || pg.coverImage) {
    rawList = [pg.image || pg.coverImage];
  }

  let primaryImg = (rawList.length > 0 && rawList[0]) ? String(rawList[0]).trim() : '';

  if (primaryImg.startsWith('./')) {
    primaryImg = primaryImg.substring(1);
  }
  if (!primaryImg.startsWith('/') && !primaryImg.startsWith('http')) {
    primaryImg = '/' + primaryImg;
  }
  if (!primaryImg || primaryImg === '/') {
    const numId = typeof pg.id === 'number' ? pg.id : (parseInt(String(pg.id).replace(/\D/g, '')) || 1);
    primaryImg = `/assets/pg_photos/photo_${((numId - 1) % 46) + 1}.jpg`;
  }

  const amenities = pg.amenities || ['Wi-Fi', 'Food', 'CCTV'];
  const pgName = pg.name || 'Student PG Accommodation';
  const pgAddress = pg.address || `${pg.area || 'Central'}, ${pg.city || 'StayNest'}`;
  const pgRent = pg.rent || pg.minRent || 7500;
  const pgRating = pg.rating || 4.5;
  const reviewCount = pg.reviewsCount || pg.reviewCount || 18;

  card.innerHTML = `
    <div class="pg-card-media" style="position: relative; height: 210px; overflow: hidden; background: #f1f5f9;">
      <img src="${primaryImg}" alt="${pgName}" class="pg-card-img" style="width: 100%; height: 100%; object-fit: cover;" loading="lazy" onerror="this.onerror=null; this.src='/assets/pg_photos/swastik_elite_1.jpg';">
      
      <div style="position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; align-items: center;">
        <span style="background: ${genderColor}; color: white; font-weight: 800; font-size: 0.72rem; padding: 4px 10px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.5px;">
          ${displayGender.toUpperCase()}
        </span>
        ${pg.verified ? `
          <span style="background: #10b981; color: white; font-weight: 700; font-size: 0.72rem; padding: 4px 10px; border-radius: 999px; display: inline-flex; align-items: center; gap: 3px;">
            🛡️ VERIFIED
          </span>
        ` : ''}
      </div>

      <button class="wishlist-heart-btn" data-wishlist-id="${pg.id}" style="position: absolute; top: 12px; right: 12px; background: white; border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 5;" title="Save to wishlist">
        ${isWishlisted ? '❤️' : '🤍'}
      </button>

      <div style="position: absolute; bottom: 10px; left: 10px; right: 10px; background: rgba(255, 255, 255, 0.94); backdrop-filter: blur(4px); padding: 5px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 600; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px;">
        📍 <span>${pgAddress}</span>
      </div>
    </div>

    <div class="pg-card-body" style="padding: 1.25rem; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; margin-bottom: 4px;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 0; line-height: 1.3;">${pgName}</h3>
          <span style="background: #eef2ff; color: #6366f1; font-weight: 800; font-size: 0.82rem; padding: 3px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 3px; white-space: nowrap;">
            ★ ${pgRating} <span style="font-size: 0.72rem; color: #4f46e5; font-weight: 500;">(${reviewCount})</span>
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
          <span style="font-size: 0.8rem; font-weight: 700; color: #6366f1;">
            ⚡ ${pgName.toLowerCase().includes('hostel') ? 'Hostel' : 'PG'}
          </span>
        </div>

        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 12px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          📍 ${pgAddress}
        </p>

        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 14px;">
          ${amenities.slice(0, 4).map(a => `
            <span style="background: #f1f5f9; color: #334155; font-size: 0.74rem; font-weight: 600; padding: 3px 8px; border-radius: 6px;">${a}</span>
          `).join('')}
          ${amenities.length > 4 ? `
            <span style="background: #f8fafc; color: #64748b; font-size: 0.74rem; font-weight: 600; padding: 3px 6px; border-radius: 6px;">+${amenities.length - 4} more</span>
          ` : ''}
        </div>
      </div>

      <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0;">
          <div>
            <span style="font-size: 1.3rem; font-weight: 800; color: #0f172a;">₹${pgRent.toLocaleString()}</span>
            <span style="font-size: 0.8rem; color: #64748b; font-weight: 500;">/mo</span>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 600;">${pg.roomTypes ? pg.roomTypes.join('/') : 'Single/Double/Triple'}</div>
          </div>
          
          <label style="font-size: 0.75rem; color: #64748b; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;" onclick="event.stopPropagation();">
            <input type="checkbox" class="compare-checkbox" data-compare-id="${pg.id}" ${isCompared ? 'checked' : ''}>
            <span>Compare</span>
          </label>
        </div>

        <button class="btn-view-details" data-pg-id="${pg.id}" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; font-size: 0.92rem; padding: 0.7rem 1rem; border-radius: 999px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: transform 0.2s ease, box-shadow 0.2s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.28);">
          <span>See More Details</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.closest('[data-wishlist-id]') || e.target.closest('.compare-checkbox') || e.target.closest('.btn-card-streetview')) return;
    appState.setPage('details', pg.id);
  });

  card.querySelector('[data-wishlist-id]')?.addEventListener('click', (e) => {
    e.stopPropagation();
    appState.toggleWishlist(pg.id);
  });

  card.querySelector('[data-compare-id]')?.addEventListener('change', (e) => {
    e.stopPropagation();
    appState.toggleCompare(pg.id);
  });

  return card;
}
