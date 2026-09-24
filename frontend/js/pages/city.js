// Fully Interactive City Landing Page Component for StayNest with Sidebar Filters & GIS Map

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS, CITIES } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createPGCard } from '../components/pgCard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createIndiaMap } from '../components/IndiaMap.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderCityPage(cityName = 'Ahmedabad') {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  const currentCityName = cityName || state.searchQuery.city || 'Ahmedabad';

  // Fetch all PGs for current city
  let cityPGs = ACCOMMODATIONS.filter(pg => pg.city && pg.city.toLowerCase().trim() === currentCityName.toLowerCase().trim());
  if (cityPGs.length === 0) {
    cityPGs = ACCOMMODATIONS.filter(pg => (pg.city || '').toLowerCase().includes(currentCityName.toLowerCase().slice(0, 4)));
  }

  // Extract unique areas & counts
  const areaCounts = {};
  cityPGs.forEach(pg => {
    const areaName = pg.area || pg.locality || 'Central Area';
    areaCounts[areaName] = (areaCounts[areaName] || 0) + 1;
  });
  const areaList = Object.keys(areaCounts).sort((a, b) => areaCounts[b] - areaCounts[a]);

  // Current filter values from appState
  const query = state.searchQuery;
  const filters = state.filters;

  // Filter listings based on active sidebar and toolbar inputs
  let filtered = cityPGs.filter(pg => {
    // Area filter
    if (query.area && !pg.area?.toLowerCase().includes(query.area.toLowerCase()) && !pg.address?.toLowerCase().includes(query.area.toLowerCase())) return false;
    
    // College filter
    if (query.college && !pg.collegeName?.toLowerCase().includes(query.college.toLowerCase()) && !pg.distanceFromCollege?.toLowerCase().includes(query.college.toLowerCase())) return false;

    // Rent filter
    const pRent = pg.rent || pg.minRent || 10000;
    if (filters.maxRent > 0 && pRent > filters.maxRent) return false;

    // Gender filter
    if (filters.gender && filters.gender !== 'All') {
      const fg = filters.gender.toLowerCase();
      const pgGen = (pg.gender || '').toLowerCase();
      if (fg === 'co-ed' || fg === 'both boys & girls') {
        if (!pgGen.includes('co-ed') && !pgGen.includes('both') && !pgGen.includes('unisex') && !pgGen.includes('coed')) return false;
      } else if (pgGen !== fg && !pgGen.includes(fg)) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating > 0 && pg.rating < filters.minRating) return false;

    // Amenities filter (100% Robust Smart Fuzzy Matcher)
    if (filters.amenities && filters.amenities.length > 0) {
      const pgAms = (pg.amenities || []).map(a => String(a).toLowerCase());
      const hasAll = filters.amenities.every(requiredAm => {
        const reqLower = String(requiredAm).toLowerCase();
        if (reqLower === 'cctv' || reqLower.includes('security')) {
          return pgAms.some(a => a.includes('cctv') || a.includes('security') || a.includes('surveillance') || a.includes('gated') || a.includes('guard'));
        }
        if (reqLower === 'food' || reqLower.includes('meal')) {
          return pgAms.some(a => a.includes('food') || a.includes('meal') || a.includes('mess') || a.includes('kitchen') || a.includes('breakfast') || a.includes('lunch') || a.includes('dinner'));
        }
        if (reqLower === 'wifi' || reqLower.includes('wi-fi')) {
          return pgAms.some(a => a.includes('wifi') || a.includes('wi-fi') || a.includes('internet') || a.includes('broadband'));
        }
        if (reqLower === 'ac' || reqLower.includes('air condition')) {
          return pgAms.some(a => a.includes('ac') || a.includes('air condition') || a.includes('cooler'));
        }
        if (reqLower === 'laundry' || reqLower.includes('wash')) {
          return pgAms.some(a => a.includes('laundry') || a.includes('wash') || a.includes('washing'));
        }
        return pgAms.some(a => a.includes(reqLower));
      });
      if (!hasAll) return false;
    }

    // Room sharing types filter
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      const pgTypes = pg.roomTypes || [];
      const hasType = filters.roomTypes.some(rt => pgTypes.includes(rt));
      if (!hasType) return false;
    }

    return true;
  });

  // Sort filtered results
  if (filters.sortBy === 'Price: Low to High') {
    filtered.sort((a, b) => (a.rent || a.minRent || 0) - (b.rent || b.minRent || 0));
  } else if (filters.sortBy === 'Price: High to Low') {
    filtered.sort((a, b) => (b.rent || b.minRent || 0) - (a.rent || a.minRent || 0));
  } else if (filters.sortBy === 'Highest Rated') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const container = document.createElement('div');
  container.className = 'city-page-container';
  container.style.background = '#f8fafc';
  container.style.minHeight = '100vh';
  container.style.paddingBottom = '4rem';

  container.innerHTML = `
    <!-- Top Breadcrumb Bar -->
    <div style="background: white; border-bottom: 1px solid #e2e8f0; padding: 0.85rem 0;">
      <div class="container" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #64748b;">
        <a href="#" id="link-home" style="color: #6366f1; text-decoration: none; font-weight: 600;">Home</a>
        <span>›</span>
        <a href="#" id="link-find-hostel" style="color: #64748b; text-decoration: none; font-weight: 500;">Find Hostel</a>
        <span>›</span>
        <span style="color: #6366f1; font-weight: 700;">PG in ${currentCityName}</span>
      </div>
    </div>

    <!-- Purple City Hero Section -->
    <section style="background: linear-gradient(135deg, #ffffff 0%, #eef2ff 100%); text-align: center; padding: 3.5rem 1rem 2.5rem 1rem; border-bottom: 1px solid #e2e8f0;">
      <div style="max-width: 850px; margin: 0 auto;">
        <div style="font-size: 3.2rem; margin-bottom: 0.5rem;">🏙️</div>
        <h1 style="font-size: 3rem; font-weight: 800; color: #0f172a; margin-bottom: 0.75rem; tracking: -0.5px;">
          Best PG & Hostel in <span style="color: #6366f1;">${currentCityName}</span>
        </h1>
        <p style="color: #475569; font-size: 1.05rem; line-height: 1.6; margin-bottom: 2rem; font-weight: 500;">
          Explore top-rated PGs & hostels across ${areaList.length} popular areas in ${currentCityName}. Compare prices, amenities and connect directly with owners.
        </p>

        <!-- Quick City Selector Buttons Bar -->
        <div style="display: flex; justify-content: center; gap: 0.65rem; flex-wrap: wrap; margin-bottom: 2rem;">
          <button class="city-pill-btn ${currentCityName === 'Ahmedabad' ? 'active-city-pill' : ''}" data-city-pill="Ahmedabad" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Ahmedabad' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Ahmedabad' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Ahmedabad' ? 'white' : '#334155'}; transition: all 0.2s;">
            🏙️ Ahmedabad (${ACCOMMODATIONS.filter(p=>p.city==='Ahmedabad').length} PGs)
          </button>
          <button class="city-pill-btn ${currentCityName === 'Mumbai' ? 'active-city-pill' : ''}" data-city-pill="Mumbai" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Mumbai' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Mumbai' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Mumbai' ? 'white' : '#334155'}; transition: all 0.2s;">
            🌊 Mumbai (${ACCOMMODATIONS.filter(p=>p.city==='Mumbai').length} PGs)
          </button>
          <button class="city-pill-btn ${currentCityName === 'Bengaluru' ? 'active-city-pill' : ''}" data-city-pill="Bengaluru" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Bengaluru' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Bengaluru' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Bengaluru' ? 'white' : '#334155'}; transition: all 0.2s;">
            🌳 Bengaluru (${ACCOMMODATIONS.filter(p=>p.city==='Bengaluru').length} PGs)
          </button>
          <button class="city-pill-btn ${currentCityName === 'Delhi' ? 'active-city-pill' : ''}" data-city-pill="Delhi" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Delhi' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Delhi' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Delhi' ? 'white' : '#334155'}; transition: all 0.2s;">
            🏛️ Delhi (${ACCOMMODATIONS.filter(p=>p.city==='Delhi').length} PGs)
          </button>
          <button class="city-pill-btn ${currentCityName === 'Pune' ? 'active-city-pill' : ''}" data-city-pill="Pune" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Pune' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Pune' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Pune' ? 'white' : '#334155'}; transition: all 0.2s;">
            🎓 Pune (${ACCOMMODATIONS.filter(p=>p.city==='Pune').length} PGs)
          </button>
          <button class="city-pill-btn ${currentCityName === 'Jaipur' ? 'active-city-pill' : ''}" data-city-pill="Jaipur" style="padding: 0.55rem 1.25rem; border-radius: 999px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: ${currentCityName === 'Jaipur' ? '2px solid #6366f1' : '1px solid #cbd5e1'}; background: ${currentCityName === 'Jaipur' ? '#6366f1' : 'white'}; color: ${currentCityName === 'Jaipur' ? 'white' : '#334155'}; transition: all 0.2s;">
            🏰 Jaipur (${ACCOMMODATIONS.filter(p=>p.city==='Jaipur').length} PGs)
          </button>
        </div>

        <!-- Quick City Metrics Bar -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 3rem; flex-wrap: wrap; background: white; padding: 1.1rem 2rem; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.12); border: 1px solid #e2e8f0; max-width: 680px; margin: 0 auto;">
          <div><strong style="font-size: 1.5rem; color: #0f172a; display: block; font-weight: 800;">${cityPGs.length}+</strong><span style="color: #64748b; font-size: 0.82rem; font-weight: 600;">Verified Listings</span></div>
          <div><strong style="font-size: 1.5rem; color: #0f172a; display: block; font-weight: 800;">${areaList.length}+</strong><span style="color: #64748b; font-size: 0.82rem; font-weight: 600;">Popular Areas</span></div>
          <div><strong style="font-size: 1.5rem; color: #6366f1; display: block; font-weight: 800;">0 Fee</strong><span style="color: #64748b; font-size: 0.82rem; font-weight: 600;">Zero Brokerage</span></div>
        </div>
      </div>
    </section>

    <!-- Search PG in City by Area Grid Section -->
    <section class="container" style="margin-top: 2.5rem; margin-bottom: 2.5rem;">
      <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.25rem;">
        <div>
          <h2 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Search PG in ${currentCityName} by Area</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Click any locality below to filter PGs in that specific area</p>
        </div>
        ${query.area ? `
          <button id="btn-reset-area-pill" style="background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; padding: 0.4rem 1.1rem; border-radius: 999px; font-size: 0.85rem; font-weight: 700; cursor: pointer;">
            ✕ Clear Area Filter (${query.area})
          </button>
        ` : ''}
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
        ${areaList.map(area => `
          <div class="area-card-tile ${query.area?.toLowerCase() === area.toLowerCase() ? 'active-area-tile' : ''}" data-locality-name="${area}" style="background: white; padding: 1.1rem 1.25rem; border-radius: 14px; border: ${query.area?.toLowerCase() === area.toLowerCase() ? '2.5px solid #6366f1' : '1px solid #e2e8f0'}; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div>
              <h4 style="font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0 0 4px 0;">${area}</h4>
              <span style="font-size: 0.82rem; font-weight: 600; color: #6366f1;">${areaCounts[area]} PG listing${areaCounts[area] > 1 ? 's' : ''}</span>
            </div>
            <span style="color: #6366f1; font-weight: 800; font-size: 1.15rem;">→</span>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- Main Content Layout with Interactive Top Bar and Left Sidebar Filters -->
    <div class="container">
      <!-- Interactive Top Toolbar -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; background: white; padding: 1.1rem 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
        <div>
          <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0;">${filtered.length} Accommodations Available</h3>
          <p style="color: #64748b; font-size: 0.85rem; margin: 2px 0 0 0;">${query.area ? `Showing PGs in ${query.area}` : `Showing all PGs in ${currentCityName}`}</p>
        </div>

        <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
          <!-- Gender Filter Pills -->
          <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 999px;">
            <button class="gender-tab-pill ${filters.gender === 'All' ? 'active-pill' : ''}" data-gtab="All" style="border: none; background: ${filters.gender === 'All' ? '#6366f1' : 'transparent'}; color: ${filters.gender === 'All' ? 'white' : '#475569'}; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;">All</button>
            <button class="gender-tab-pill ${filters.gender === 'Boys' ? 'active-pill' : ''}" data-gtab="Boys" style="border: none; background: ${filters.gender === 'Boys' ? '#2563eb' : 'transparent'}; color: ${filters.gender === 'Boys' ? 'white' : '#475569'}; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;">Boys</button>
            <button class="gender-tab-pill ${filters.gender === 'Girls' ? 'active-pill' : ''}" data-gtab="Girls" style="border: none; background: ${filters.gender === 'Girls' ? '#ec4899' : 'transparent'}; color: ${filters.gender === 'Girls' ? 'white' : '#475569'}; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;">Girls</button>
            <button class="gender-tab-pill ${filters.gender === 'Co-ed' ? 'active-pill' : ''}" data-gtab="Co-ed" style="border: none; background: ${filters.gender === 'Co-ed' ? '#8b5cf6' : 'transparent'}; color: ${filters.gender === 'Co-ed' ? 'white' : '#475569'}; padding: 6px 18px; border-radius: 999px; font-weight: 700; font-size: 0.82rem; cursor: pointer; transition: all 0.2s;">Co-ed</button>
          </div>

          <button id="btn-toggle-gis-map" style="background: white; border: 1px solid #6366f1; color: #6366f1; padding: 0.55rem 1.15rem; border-radius: 999px; font-weight: 700; font-size: 0.85rem; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 6px rgba(99, 102, 241, 0.1);">
            🗺️ Interactive GIS Map
          </button>

          <select id="sort-select-dropdown" style="padding: 0.55rem 1rem; border-radius: 999px; border: 1px solid #cbd5e1; font-weight: 700; font-size: 0.85rem; color: #334155; outline: none; cursor: pointer;">
            <option value="Recommended" ${filters.sortBy === 'Recommended' ? 'selected' : ''}>Recommended</option>
            <option value="Price: Low to High" ${filters.sortBy === 'Price: Low to High' ? 'selected' : ''}>Price: Low to High</option>
            <option value="Price: High to Low" ${filters.sortBy === 'Price: High to Low' ? 'selected' : ''}>Price: High to Low</option>
            <option value="Highest Rated" ${filters.sortBy === 'Highest Rated' ? 'selected' : ''}>Highest Rated</option>
          </select>
        </div>
      </div>

      <!-- GIS Map Container -->
      <div id="city-gis-map-box" style="display: none; margin-bottom: 2rem; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; height: 400px;"></div>

      <!-- Sidebar + Grid Main Split Layout -->
      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem;">
        <!-- Left Sidebar Filters Box -->
        <aside class="sidebar-filters-box" style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #e2e8f0; align-self: start; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;">
            <h3 style="font-size: 1.15rem; font-weight: 800; margin: 0; color: #0f172a;">Filters</h3>
            <button id="btn-clear-all-filters" style="background: transparent; border: none; color: #6366f1; font-weight: 700; font-size: 0.82rem; cursor: pointer;">Clear All</button>
          </div>

          <!-- Monthly Rent Budget Slider -->
          <div style="margin-bottom: 1.75rem;">
            <label style="display: block; font-size: 0.88rem; font-weight: 700; color: #334155; margin-bottom: 0.6rem;">Monthly Rent Budget</label>
            <input type="range" id="filter-rent-slider" min="3000" max="100000" step="1000" value="${filters.maxRent || 100000}" style="width: 100%; accent-color: #6366f1; cursor: pointer;">
            <div style="display: flex; justify-content: space-between; font-size: 0.82rem; color: #64748b; margin-top: 0.4rem; font-weight: 600;">
              <span>₹3,000</span>
              <span id="rent-slider-label" style="color: #6366f1; font-weight: 800;">Up to ₹${(filters.maxRent || 100000).toLocaleString()}</span>
            </div>
          </div>

          <!-- Room Sharing Type Checkboxes -->
          <div style="margin-bottom: 1.75rem;">
            <label style="display: block; font-size: 0.88rem; font-weight: 700; color: #334155; margin-bottom: 0.6rem;">Room Sharing Type</label>
            <div style="display: flex; flex-direction: column; gap: 0.45rem;">
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-room-type" value="Single" ${filters.roomTypes?.includes('Single') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Single Sharing
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-room-type" value="Double" ${filters.roomTypes?.includes('Double') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Double Sharing
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-room-type" value="Triple" ${filters.roomTypes?.includes('Triple') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Triple Sharing
              </label>
            </div>
          </div>

          <!-- Key Amenities Checkboxes -->
          <div style="margin-bottom: 1rem;">
            <label style="display: block; font-size: 0.88rem; font-weight: 700; color: #334155; margin-bottom: 0.6rem;">Key Amenities</label>
            <div style="display: flex; flex-direction: column; gap: 0.45rem;">
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-amenity" value="Wi-Fi" ${filters.amenities?.includes('Wi-Fi') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Wi-Fi High Speed
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-amenity" value="Food" ${filters.amenities?.includes('Food') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> 3 Meals Daily (Food)
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-amenity" value="AC" ${filters.amenities?.includes('AC') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Air Conditioner (AC)
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-amenity" value="Laundry" ${filters.amenities?.includes('Laundry') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> Laundry & Washing Machine
              </label>
              <label style="font-size: 0.85rem; color: #475569; display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 500;">
                <input type="checkbox" class="cb-amenity" value="CCTV" ${filters.amenities?.includes('CCTV') ? 'checked' : ''} style="accent-color: #6366f1; width: 16px; height: 16px;"> CCTV & Security
              </label>
            </div>
          </div>
        </aside>

        <!-- Accommodations Grid View -->
        <main>
          ${filtered.length === 0 ? `
            <div style="background: white; padding: 3rem 2rem; border-radius: 16px; border: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
              <h3 style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">No Accommodations Found</h3>
              <p style="color: #64748b; font-size: 0.92rem; margin-bottom: 1.5rem;">We couldn't find any PGs matching your exact filters in ${currentCityName}. Try clearing area or amenity filters.</p>
              <button id="btn-no-results-clear" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 700; padding: 0.75rem 1.75rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem;">
                Clear All Filters
              </button>
            </div>
          ` : `
            <div id="city-pg-cards-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 1.75rem;"></div>
          `}
        </main>
      </div>
    </div>
  `;

  // Append PG Cards
  const cardsGrid = container.querySelector('#city-pg-cards-grid');
  if (cardsGrid) {
    filtered.forEach(pg => cardsGrid.appendChild(createPGCard(pg)));
  }

  // Bind City Pill Buttons
  container.querySelectorAll('.city-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetCity = btn.getAttribute('data-city-pill');
      appState.updateSearchQuery({ city: targetCity, area: '', college: '', keyword: '' });
    });
  });

  // Bind Locality Area Tiles Click
  container.querySelectorAll('[data-locality-name]').forEach(tile => {
    tile.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const area = tile.getAttribute('data-locality-name');
      const nextArea = query.area?.toLowerCase() === area.toLowerCase() ? '' : area;
      appState.updateSearchQuery({ city: currentCityName, area: nextArea });
    });
  });

  // Bind Reset Area Pill
  container.querySelector('#btn-reset-area-pill')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.updateSearchQuery({ city: currentCityName, area: '' });
  });

  // Bind Gender Tabs
  container.querySelectorAll('.gender-tab-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const g = btn.getAttribute('data-gtab');
      appState.updateFilters({ gender: g });
    });
  });

  // Bind Sort Dropdown
  container.querySelector('#sort-select-dropdown')?.addEventListener('change', (e) => {
    appState.updateFilters({ sortBy: e.target.value });
  });

  // Bind Rent Range Slider
  const rentSlider = container.querySelector('#filter-rent-slider');
  rentSlider?.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    const label = container.querySelector('#rent-slider-label');
    if (label) label.textContent = `Up to ₹${val.toLocaleString()}`;
  });
  rentSlider?.addEventListener('change', (e) => {
    const val = parseInt(e.target.value);
    appState.updateFilters({ maxRent: val });
  });

  // Bind Room Type Checkboxes
  container.querySelectorAll('.cb-room-type').forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedTypes = Array.from(container.querySelectorAll('.cb-room-type:checked')).map(c => c.value);
      appState.updateFilters({ roomTypes: checkedTypes });
    });
  });

  // Bind Amenity Checkboxes
  container.querySelectorAll('.cb-amenity').forEach(cb => {
    cb.addEventListener('change', () => {
      const checkedAm = Array.from(container.querySelectorAll('.cb-amenity:checked')).map(c => c.value);
      appState.updateFilters({ amenities: checkedAm });
    });
  });

  // Bind Clear All Filters
  container.querySelector('#btn-clear-all-filters')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.clearFilters();
  });

  container.querySelector('#btn-no-results-clear')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.clearFilters();
  });

  // Toggle GIS Map
  let isMapOpen = false;
  container.querySelector('#btn-toggle-gis-map')?.addEventListener('click', () => {
    isMapOpen = !isMapOpen;
    const mapBox = container.querySelector('#city-gis-map-box');
    if (mapBox) {
      if (isMapOpen) {
        mapBox.style.display = 'block';
        mapBox.innerHTML = '';
        const cityObj = CITIES.find(c => c.name.toLowerCase() === currentCityName.toLowerCase()) || CITIES[0];
        const mapElement = createIndiaMap({
          locations: [cityObj],
          pgListings: filtered,
          onPGSelect: (pgId) => appState.setPage('details', pgId)
        });
        mapBox.appendChild(mapElement);
      } else {
        mapBox.style.display = 'none';
      }
    }
  });

  // Breadcrumb links
  container.querySelector('#link-home')?.addEventListener('click', (e) => { e.preventDefault(); appState.setPage('home'); });
  container.querySelector('#link-find-hostel')?.addEventListener('click', (e) => { e.preventDefault(); appState.setPage('search'); });

  root.innerHTML = '';
  root.appendChild(container);
}
