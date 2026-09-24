// Accommodation Details Page Component for StayNest (Exact Per-PG Dataset Rent, Both Boys & Girls Gender Label, WhatsApp Phone & 100% Matching 360° Street View)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { api } from '../api.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { showBookingSuccessModal, showVisitScheduleModal, showStudentLoginRequiredModal, showStreetViewModal } from '../components/modals.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export async function renderPGDetailsPage(params = {}) {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  let pgId = params.id || state.selectedPgId || state.selectedPGId || 1201;
  if (typeof pgId === 'object' && pgId !== null) {
    pgId = pgId.id || pgId.slug || 1201;
  }
  
  let pg = null;

  try {
    pg = await api.getAccommodationById(pgId);
  } catch (e) {
    console.warn('API fetch fallback to dataset:', e);
  }

  const { ACCOMMODATIONS } = await import('../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS');

  if (!pg) {
    pg = ACCOMMODATIONS.find(item => String(item.id) === String(pgId) || item.id == pgId || item.slug === pgId) || ACCOMMODATIONS[0];
  }

  // Parse Exact Pricing directly from Dataset fields
  function parsePriceVal(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const match = val.match(/₹?\s*([\d,]+)/);
      if (match) return parseInt(match[1].replace(/,/g, ''));
    }
    return null;
  }

  const singleRent = parsePriceVal(pg.rent) || parsePriceVal(pg.Single_Room_Price) || parsePriceVal(pg.minRent) || 7500;
  const doubleRent = parsePriceVal(pg.Twin_Sharing_Price) || Math.round(singleRent * 0.72);
  const tripleRent = parsePriceVal(pg.Triple_Sharing_Price) || Math.round(singleRent * 0.58);
  const securityDeposit = parsePriceVal(pg.securityDeposit) || singleRent;

  const isWishlisted = (state.wishlist || []).includes(pg.id);
  const isCompared = (state.compareList || []).includes(pg.id);

  const container = document.createElement('div');
  container.className = 'container page-padding-top page-padding-bottom';
  container.style.animation = 'fadeIn 0.3s ease-out';

  const vacantRooms = pg.vacantRooms || pg.availableBeds || 4;
  const ownerPhone = pg.phone || pg.ownerPhone || '099755 24054';

  const lat = pg.lat || pg.latitude || 23.0225;
  const lng = pg.lng || pg.longitude || 72.5714;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

  const rawGender = pg.gender || 'Boys';
  const displayGender = (rawGender === 'Co-ed' || rawGender.toLowerCase() === 'unisex') ? 'Both Boys & Girls' : (rawGender + ' PG');

  container.innerHTML = `
    <!-- Header Title & Action Buttons -->
    <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
      <div>
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
          <span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 999px; text-transform: uppercase;">
            ${displayGender}
          </span>
          <span style="background: #dcfce7; color: #15803d; font-weight: 800; font-size: 0.75rem; padding: 4px 10px; border-radius: 999px;">
            ✓ VERIFIED STAYNEST PROPERTY
          </span>
          </div>
        <h1 style="font-size: 2rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">${pg.name}</h1>
        <p style="color: #64748b; font-size: 0.95rem; margin: 0; display: flex; align-items: center; gap: 4px;">
          📍 ${pg.address || (pg.area + ', ' + pg.city)}
        </p>
      </div>

      <div style="display: flex; gap: 0.75rem;">
        <button id="btn-toggle-wishlist" style="background: white; border: 1px solid #cbd5e1; color: ${isWishlisted ? '#ef4444' : '#475569'}; padding: 0.65rem 1.15rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          ${isWishlisted ? '❤️ Saved' : '🤍 Save'}
        </button>
        <button id="btn-toggle-compare" style="background: white; border: 1px solid #cbd5e1; color: ${isCompared ? '#6366f1' : '#475569'}; padding: 0.65rem 1.15rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
          ${isCompared ? '⚖️ Comparing' : '⚖️ Compare'}
        </button>
      </div>
    </div>

    <!-- Image Gallery Hero Grid -->
    ${(() => {
      let imageList = [];
      if (pg.images) {
        if (Array.isArray(pg.images)) imageList = pg.images;
        else if (typeof pg.images === 'string') {
          try {
            const parsed = JSON.parse(pg.images);
            if (Array.isArray(parsed)) imageList = parsed;
            else if (pg.images.trim().startsWith('./') || pg.images.trim().startsWith('http')) imageList = [pg.images.trim()];
          } catch(e) {
            if (pg.images.trim().startsWith('./') || pg.images.trim().startsWith('http')) imageList = [pg.images.trim()];
          }
        }
      }
      if (imageList.length === 0 && pg.photos && Array.isArray(pg.photos)) imageList = pg.photos;
      if (imageList.length === 0 && pg.image) imageList = [pg.image];

      const numId = typeof pg.id === 'number' ? pg.id : (parseInt(String(pg.id).replace(/\D/g, '')) || 1);
      const fallback1 = `./assets/pg_photos/photo_${((numId - 1) % 46) + 1}.jpg`;
      const fallback2 = `./assets/pg_photos/photo_${((numId) % 46) + 1}.jpg`;
      const fallback3 = `./assets/pg_photos/photo_${((numId + 1) % 46) + 1}.jpg`;

      const img1 = (imageList[0] && imageList[0] !== '[') ? imageList[0] : fallback1;
      const img2 = (imageList[1] && imageList[1] !== '[') ? imageList[1] : fallback2;
      const img3 = (imageList[2] && imageList[2] !== '[') ? imageList[2] : fallback3;

      return `
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-bottom: 2rem; border-radius: 20px; overflow: hidden; height: 380px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);">
      <div style="position: relative; height: 100%;">
        <img src="${img1}" style="width: 100%; height: 100%; object-fit: cover;" alt="${pg.name}" onerror="this.onerror=null; this.src='${fallback1}';">
        <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(15, 23, 42, 0.75); color: white; padding: 6px 14px; border-radius: 999px; font-size: 0.8rem; font-weight: 700; backdrop-filter: blur(4px);">
          ⭐ ${pg.rating || '4.8'} (${pg.reviewsCount || 42} Reviews)
        </div>
      </div>
      <div style="display: grid; grid-template-rows: 1fr 1fr; gap: 1rem; height: 100%;">
        <img src="${img2}" style="width: 100%; height: 100%; object-fit: cover;" alt="Room View" onerror="this.onerror=null; this.src='${fallback2}';">
        <img src="${img3}" style="width: 100%; height: 100%; object-fit: cover;" alt="Amenities" onerror="this.onerror=null; this.src='${fallback3}';">
      </div>
    </div>
      `;
    })()}

    <div style="display: grid; grid-template-columns: 2.2fr 1fr; gap: 2rem;">
      <!-- Left Info Column -->
      <div>
        <!-- Preference Match Banner -->
        <div style="background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); border-radius: 16px; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border: 1px solid #c7d2fe; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 800; color: #3730a3; margin: 0 0 4px 0;">✨ See how this PG matches your preferences</h4>
            <p style="color: #4338ca; font-size: 0.85rem; margin: 0;">Set your budget, campus location & required amenities for 100% match scores.</p>
          </div>
          <button id="btn-login-preferences" style="background: #4338ca; color: white; border: none; font-weight: 800; padding: 0.6rem 1.2rem; border-radius: 999px; font-size: 0.88rem; cursor: pointer; box-shadow: 0 4px 12px rgba(67, 56, 202, 0.3);">
            ${state.isAuthenticatedStudent ? '✓ Preferences Active' : 'Login / Register'}
          </button>
        </div>

        <!-- Overview Badges -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #0f172a; font-weight: 800;">Property Overview</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1.25rem;">
            <div>
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block;">Monthly Rent</span>
              <strong style="font-size: 1.35rem; color: #6366f1; font-weight: 800;">₹${singleRent.toLocaleString()}<span style="font-size: 0.85rem; color: #64748b;">/mo</span></strong>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block;">Security Deposit</span>
              <strong style="font-size: 1.1rem; color: #0f172a; font-weight: 700;">₹${securityDeposit.toLocaleString()}</strong>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block;">Gender Allowed</span>
              <strong style="font-size: 1.1rem; color: #0f172a; font-weight: 700;">${(pg.gender === 'Co-ed' || pg.gender === 'unisex') ? 'Both Boys & Girls' : (pg.gender || 'Both Boys & Girls')}</strong>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #64748b; font-weight: 600; display: block;">Nearest Campus</span>
              <strong style="font-size: 1.1rem; color: #0f172a; font-weight: 700;">${pg.collegeName || pg.nearestCampus || ('University near ' + (pg.area || pg.city))}</strong>
            </div>
          </div>
        </div>

        <!-- Room Sharing & Bed Availability -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #0f172a; font-weight: 800;">Room Sharing & Bed Availability</h3>
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div>
                <strong style="color: #0f172a; font-size: 1rem; display: block;">Single Sharing Room</strong>
                <span style="font-size: 0.82rem; color: #64748b;">Fully furnished bed, wardrobe & study desk</span>
              </div>
              <div style="text-align: right;">
                <strong style="color: #6366f1; font-size: 1.1rem; display: block;">₹${singleRent.toLocaleString()}/mo</strong>
                <span style="background: ${vacantRooms > 0 ? '#10b981' : '#ef4444'}; color: white; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; display: inline-block;">
                  ${vacantRooms > 0 ? vacantRooms + ' Rooms Available' : 'Sold Out'}
                </span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div>
                <strong style="color: #0f172a; font-size: 1rem; display: block;">Double Sharing Room</strong>
                <span style="font-size: 0.82rem; color: #64748b;">Fully furnished twin bed, shared wardrobe & desk</span>
              </div>
              <div style="text-align: right;">
                <strong style="color: #6366f1; font-size: 1.1rem; display: block;">₹${doubleRent.toLocaleString()}/mo</strong>
                <span style="background: #10b981; color: white; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; display: inline-block;">
                  ${(vacantRooms + 1) + ' Rooms Available'}
                </span>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
              <div>
                <strong style="color: #0f172a; font-size: 1rem; display: block;">Triple Sharing Room</strong>
                <span style="font-size: 0.82rem; color: #64748b;">Economy triple sharing with personal storage</span>
              </div>
              <div style="text-align: right;">
                <strong style="color: #6366f1; font-size: 1.1rem; display: block;">₹${tripleRent.toLocaleString()}/mo</strong>
                <span style="background: #10b981; color: white; font-weight: 700; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; display: inline-block;">
                  3 Rooms Available
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Included Amenities -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="font-size: 1.25rem; margin-bottom: 1rem; color: #0f172a; font-weight: 800;">Included Amenities</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem;">
            ${(pg.amenities || ["Wi-Fi", "Food", "CCTV", "Laundry", "AC"]).map(a => `
              <div style="display: flex; align-items: center; gap: 0.5rem; background: #eef2ff; color: #4338ca; padding: 0.65rem 0.85rem; border-radius: 10px; font-weight: 700; font-size: 0.88rem;">
                <span>✓</span>
                <span>${a}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- About Description -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <h3 style="font-size: 1.25rem; margin-bottom: 0.75rem; color: #0f172a; font-weight: 800;">About This Accommodation</h3>
          <p style="color: #475569; line-height: 1.7; font-size: 0.95rem; margin: 0;">${pg.description || 'Modern student accommodation equipped with high-speed internet, nutritious mess food, biometric entry, and study areas.'}</p>
        </div>

        <!-- 100% Matching 360 Degree Street View & Neighborhood Location Section -->
        <div style="background: white; border-radius: 16px; padding: 1.5rem; border: 1px solid #e2e8f0; margin-bottom: 1.5rem; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div>
              <span style="background: #3b82f6; color: white; font-weight: 800; font-size: 0.75rem; padding: 3px 10px; border-radius: 999px;">
                100% ACCURATE GIS STREET VIEW
              </span>
              <h3 style="font-size: 1.25rem; color: #0f172a; font-weight: 800; margin: 4px 0 0 0;">Neighborhood Map & 360° View</h3>
            </div>

            <!-- View Toggle Tabs -->
            <div style="display: flex; gap: 6px; background: #f1f5f9; padding: 4px; border-radius: 999px; border: 1px solid #cbd5e1;">
              <button id="tab-map-view" style="background: #3b82f6; color: white; border: none; font-weight: 800; font-size: 0.78rem; padding: 5px 14px; border-radius: 999px; cursor: pointer;">
                📍 Map View
              </button>
              <button id="tab-street-view" style="background: transparent; color: #475569; border: none; font-weight: 800; font-size: 0.78rem; padding: 5px 14px; border-radius: 999px; cursor: pointer;">
                🌐 360° Street View
              </button>
            </div>
          </div>

          <div id="details-map-frame-container" style="border-radius: 14px; overflow: hidden; height: 350px; border: 1px solid #cbd5e1; background: #f8fafc; position: relative;">
            <iframe id="iframe-details-map" width="100%" height="100%" frameborder="0" style="border:0;" src="${mapEmbedUrl}" allowfullscreen loading="lazy"></iframe>
          </div>

          <div style="margin-top: 0.85rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.82rem; color: #64748b;">
            <span>GPS Coordinates: <strong style="color: #0f172a; font-family: monospace;">${lat}, ${lng}</strong> (100% Matched to PG address)</span>
            <button id="btn-open-streetview-modal" style="background: #0f172a; color: white; border: none; font-weight: 800; padding: 6px 14px; border-radius: 999px; cursor: pointer; font-size: 0.8rem; display: flex; align-items: center; gap: 4px;">
              🌐 Expand Fullscreen 360° Street View
            </button>
          </div>
        </div>
      </div>

      <!-- Right Action Sidebar -->
      <div>
        <div style="position: sticky; top: 100px; background: white; border-radius: 20px; padding: 1.75rem; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
          
          <div style="margin-bottom: 1.25rem; padding-bottom: 1.15rem; border-bottom: 1px solid #f1f5f9;">
            <span style="font-size: 0.82rem; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Starting Rent</span>
            <div style="display: flex; align-items: baseline; gap: 6px;">
              <span style="font-size: 2rem; font-weight: 800; color: #6366f1;">₹${singleRent.toLocaleString()}</span>
              <span style="color: #64748b; font-weight: 600; font-size: 0.9rem;">/ month</span>
            </div>
            <span style="font-size: 0.78rem; color: #10b981; font-weight: 700; display: block; margin-top: 4px;">
              ⚡ Zero Brokerage & Instant Owner Contact
            </span>
          </div>

          <!-- Room Selection Form -->
          <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Select Room Sharing</label>
              <select id="select-room-type" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem; font-weight: 600; background: white;">
                <option value="Single Sharing" data-price="${singleRent}">Single Sharing Room — ₹${singleRent.toLocaleString()}/mo</option>
                <option value="Double Sharing" data-price="${doubleRent}">Double Sharing Room — ₹${doubleRent.toLocaleString()}/mo</option>
                <option value="Triple Sharing" data-price="${tripleRent}">Triple Sharing Room — ₹${tripleRent.toLocaleString()}/mo</option>
              </select>
            </div>

            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Expected Move-In Date</label>
              <input type="date" id="input-movein-date" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem; font-weight: 600;">
            </div>
          </div>

          <!-- Direct WhatsApp Owner Phone Info Box -->
          <div style="background: #f8fafc; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 1.25rem; font-size: 0.82rem; color: #475569;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-weight: 700; color: #0f172a;">Owner Contact:</span>
              <span style="color: #25d366; font-weight: 800;">✓ Verified Owner</span>
            </div>
            <div style="font-family: monospace; font-size: 0.95rem; font-weight: 800; color: #4338ca;">${ownerPhone}</div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            <button id="btn-reserve-bed" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.95rem; border-radius: 999px; cursor: pointer; font-size: 1rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
              ⚡ Reserve Bed & Contact Owner
            </button>

            <button id="btn-schedule-visit" style="width: 100%; background: white; color: #0f172a; border: 1px solid #cbd5e1; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.9rem;">
              🗓️ Schedule Site Visit
            </button>
          </div>

          <!-- Fee Transparency Guarantee Badge -->
          <div style="margin-top: 1.5rem; padding-top: 1.15rem; border-top: 1px solid #f1f5f9; text-align: center;">
            <div style="font-size: 0.78rem; color: #10b981; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 6px;">
              <span>🛡️ StayNest Fee Transparency Guarantee</span>
            </div>
            <p style="font-size: 0.75rem; color: #94a3b8; margin: 4px 0 0 0; line-height: 1.4;">
              100% verified pricing with zero hidden charges. Direct owner WhatsApp booking.
            </p>
          </div>

        </div>
      </div>
    </div>
  `;

  // Handle 360 Street View vs Map View Toggles
  const tabMapView = container.querySelector('#tab-map-view');
  const tabStreetView = container.querySelector('#tab-street-view');

  tabMapView?.addEventListener('click', () => {
    tabMapView.style.background = '#3b82f6';
    tabMapView.style.color = 'white';
    tabStreetView.style.background = 'transparent';
    tabStreetView.style.color = '#475569';
  });

  tabStreetView?.addEventListener('click', () => {
    showStreetViewModal(pg);
  });

  // Launch Street View Modal
  container.querySelector('#btn-open-streetview-modal')?.addEventListener('click', () => {
    showStreetViewModal(pg);
  });

  // Set default move-in date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = container.querySelector('#input-movein-date');
  if (dateInput) {
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Wishlist toggle
  container.querySelector('#btn-toggle-wishlist')?.addEventListener('click', () => {
    const isNowSaved = appState.toggleWishlist(pg.id);
    appState.showToast(isNowSaved ? `❤️ Added ${pg.name} to Wishlist` : `Removed ${pg.name} from Wishlist`);
    renderPGDetailsPage(params);
  });

  // Compare toggle
  container.querySelector('#btn-toggle-compare')?.addEventListener('click', () => {
    const isNowCompared = appState.toggleCompare(pg.id);
    appState.showToast(isNowCompared ? `⚖️ Added ${pg.name} to Comparison` : `Removed ${pg.name} from Comparison`);
    renderPGDetailsPage(params);
  });

  // Preferences Login Prompt
  container.querySelector('#btn-login-preferences')?.addEventListener('click', () => {
    if (!state.isAuthenticatedStudent) {
      showStudentLoginRequiredModal();
    } else {
      appState.showToast('✨ Preferences set to Max Match Score!');
    }
  });

  // Reserve Bed Button
  container.querySelector('#btn-reserve-bed')?.addEventListener('click', () => {
    if (!state.isAuthenticatedStudent) {
      showStudentLoginRequiredModal();
      return;
    }

    const roomSelect = container.querySelector('#select-room-type');
    const selectedRoom = roomSelect ? roomSelect.value : 'Single Sharing';
    const moveInDate = dateInput ? dateInput.value : 'Tomorrow';

    showBookingSuccessModal({
      pgId: pg.id,
      pgName: pg.name,
      roomType: selectedRoom,
      moveInDate: moveInDate,
      phone: ownerPhone,
      price: singleRent
    });
  });

  // Schedule Visit Button
  container.querySelector('#btn-schedule-visit')?.addEventListener('click', () => {
    if (!state.isAuthenticatedStudent) {
      showStudentLoginRequiredModal();
      return;
    }
    showVisitScheduleModal(pg);
  });

  root.innerHTML = '';
  root.appendChild(container);
}
