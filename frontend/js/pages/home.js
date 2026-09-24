// Home Page Component for StayNest (Full-Stack Integrated)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { CITIES as MOCK_CITIES, POPULAR_AREAS, ACCOMMODATIONS as MOCK_PG } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createPGCard } from '../components/pgCard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createSearchBar } from '../components/searchBar.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createIndiaMap } from '../components/IndiaMap.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { api } from '../api.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderHomePage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = ''; // Clear root container cleanly

  const page = document.createElement('div');

  // Hero Section
  const heroSection = document.createElement('section');
  heroSection.className = 'hero-section';
  heroSection.innerHTML = `
    <div class="hero-glow"></div>
    <div class="container">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✨ Smart Student Accommodation Platform</span>
        </div>
        <h1 class="hero-title" id="home-hero-title">Find Your Perfect Student Stay</h1>
        <p class="hero-subheading" id="home-hero-subheading">Discover PGs and hostels near your college, within your budget and with verified amenities.</p>
      </div>

      <div id="hero-search-wrapper" style="max-width: 1050px; margin: 0 auto;"></div>
    </div>
  `;

  try {
    const rawHp = localStorage.getItem('staynest_cms_homepage');
    if (rawHp) {
      const data = JSON.parse(rawHp);
      if (data && data.hero_title) {
        const titleEl = heroSection.querySelector('#home-hero-title');
        if (titleEl) titleEl.textContent = data.hero_title;
      }
      if (data && data.hero_subtitle) {
        const subEl = heroSection.querySelector('#home-hero-subheading');
        if (subEl) subEl.textContent = data.hero_subtitle;
      }
      if (data && data.cta_title) {
        const ctaTitleEl = page.querySelector('#home-cta-title');
        if (ctaTitleEl) ctaTitleEl.textContent = data.cta_title;
      }
      if (data && data.cta_subtitle) {
        const ctaSubEl = page.querySelector('#home-cta-subtitle');
        if (ctaSubEl) ctaSubEl.textContent = data.cta_subtitle;
      }
    }
  } catch(e) {}

  heroSection.querySelector('#hero-search-wrapper').appendChild(createSearchBar());
  page.appendChild(heroSection);

  // Authoritative Interactive Map Section (All 1,200 PGs mapped across India)
  const mapSection = document.createElement('section');
  mapSection.className = 'container';
  mapSection.style.margin = '2rem auto';

  let activeCities = MOCK_CITIES;
  let activePGs = MOCK_PG; // Full 1200 PGs dataset for complete India map view

  const mapContainer = createIndiaMap({
    locations: activeCities,
    pgListings: activePGs,
    onLocationSelect: (cityName) => {
      appState.updateSearchQuery({ city: cityName, area: '', college: '', keyword: '' });
    },
    onPGSelect: (pgOrId) => {
      const realId = (typeof pgOrId === 'object' && pgOrId !== null) ? (pgOrId.id || pgOrId) : pgOrId;
      appState.setPage('details', realId);
    }
  });

  mapSection.appendChild(mapContainer);
  page.appendChild(mapSection);

  // Popular Cities Section with Dynamic Backend PG Counts & Guaranteed HD Image Fallbacks
  const citiesSection = document.createElement('section');
  citiesSection.className = 'section';
  citiesSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-tag">TOP DESTINATIONS</span>
        <h2 class="section-title">Popular Cities</h2>
        <p class="section-subtitle">Explore student accommodations across India's largest educational hubs.</p>
      </div>

      <div class="city-grid" id="home-city-grid">
        ${activeCities.map(c => `
          <div class="city-card" data-city-name="${c.name}" style="cursor: pointer;">
            <img src="${c.image || c.fallback}" alt="${c.name}" class="city-card-img" loading="lazy" onerror="this.onerror=null; this.src='${c.fallback}';">
            <div class="city-card-overlay">
              <h3 class="city-card-name">${c.name}</h3>
              <p style="font-size: 0.8rem; font-weight: 700; color: #cbd5e1; margin: 0 0 6px 0; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">📍 ${c.landmark || 'Famous Landmark'}</p>
              <p class="city-card-count" id="city-count-${c.name.toLowerCase()}">200 PGs & Hostels</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  if (api && api.getCities) {
    api.getCities().then(apiCities => {
      if (apiCities && apiCities.length > 0) {
        apiCities.forEach(city => {
          if (city && city.name) {
            const countElem = citiesSection.querySelector(`#city-count-${city.name.toLowerCase()}`);
            if (countElem) {
              countElem.textContent = `${city.pg_count || 200} PGs & Hostels`;
            }
          }
        });
      }
    }).catch(err => console.warn('City API non-blocking fallback:', err));
  }

  citiesSection.querySelectorAll('[data-city-name]').forEach(card => {
    card.addEventListener('click', () => {
      const city = card.getAttribute('data-city-name');
      if (city) {
        appState.updateSearchQuery({ city: city, area: '', college: '', keyword: '' });
      }
    });
  });

  page.appendChild(citiesSection);

  // Featured PGs & Hostels Section
  const currentCityName = appState.getState().searchQuery.city || 'Ahmedabad';

  const featuredSection = document.createElement('section');
  featuredSection.className = 'section';
  featuredSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-tag">HANDPICKED STAYS</span>
        <h2 class="section-title">Featured PGs & Hostels</h2>
        <p class="section-subtitle">Verified accommodations with top student ratings and modern amenities.</p>
      </div>

      <div class="card-grid" id="home-featured-grid"></div>
    </div>
  `;

  const featuredGrid = featuredSection.querySelector('#home-featured-grid');

  const populateGrid = (pgs) => {
    const listToDisplay = (pgs && pgs.length > 0) ? pgs.slice(0, 6) : activePGs.slice(0, 6);
    featuredGrid.innerHTML = '';
    listToDisplay.forEach(pg => {
      featuredGrid.appendChild(createPGCard(pg));
    });
  };

  populateGrid(activePGs); // Render original dataset PGs with local photos
  page.appendChild(featuredSection);

  // Platform Benefits Section ("Why Students Trust StayNest")
  const benefitsSection = document.createElement('section');
  benefitsSection.className = 'section bg-surface';
  benefitsSection.innerHTML = `
    <div class="container">
      <div class="section-header">
        <span class="section-tag">PLATFORM BENEFITS</span>
        <h2 class="section-title">Why Students Trust StayNest</h2>
        <p class="section-subtitle">Designed specifically for college students seeking safe, affordable housing.</p>
      </div>

      <div class="card-grid" style="grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem;">
        <div class="benefit-card" style="background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="background: rgba(99,102,241,0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">🎓</div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">College Proximity Filter</h3>
          <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5; margin: 0;">Search for PGs within 1km, 3km, or 5km of your university campus to save daily commute time.</p>
        </div>

        <div class="benefit-card" style="background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="background: rgba(59,130,246,0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">🛡️</div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Verified Properties</h3>
          <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5; margin: 0;">Physical site verification with 24/7 security checks, biometric access, and warden details.</p>
        </div>

        <div class="benefit-card" style="background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="background: rgba(245,158,11,0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">⚖️</div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Side-by-Side Comparison</h3>
          <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5; margin: 0;">Compare rent, food mess menu, AC availability, deposit fees, and student reviews in one view.</p>
        </div>

        <div class="benefit-card" style="background: white; border-radius: 20px; padding: 2rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="background: rgba(236,72,153,0.1); width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1.25rem;">⚡</div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Instant Bed Booking</h3>
          <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5; margin: 0;">Reserve your room bed online with instant confirmation and zero brokerage fees.</p>
        </div>
      </div>
    </div>
  `;

  page.appendChild(benefitsSection);

  // CTA Banner Section
  const ctaSection = document.createElement('section');
  ctaSection.className = 'container';
  ctaSection.style.margin = '3rem auto';
  ctaSection.innerHTML = `
    <div style="background: linear-gradient(135deg, var(--primary-color, #6366f1) 0%, var(--secondary-color, #7c3aed) 100%); color: white; padding: 3.5rem 1.5rem; text-align: center; border-radius: 24px; box-shadow: 0 20px 40px -15px rgba(99,102,241,0.4);">
      <h2 id="home-cta-title" style="font-size: 2rem; font-weight: 800; color: white; margin: 0 0 0.75rem 0;">Ready to Find Your Home Away From Home?</h2>
      <p id="home-cta-subtitle" style="font-size: 1.05rem; color: rgba(255,255,255,0.9); margin: 0 0 1.75rem 0; max-width: 650px; margin-left: auto; margin-right: auto;">Join over 25,000 students across India using StayNest.</p>
      <button id="btn-home-cta-explore" style="background: white; color: #4338ca; font-weight: 800; padding: 0.85rem 2.2rem; border-radius: 999px; border: none; cursor: pointer; font-size: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">Explore 1,200+ PGs Now</button>
    </div>
  `;
  ctaSection.querySelector('#btn-home-cta-explore')?.addEventListener('click', () => appState.setPage('search'));
  page.appendChild(ctaSection);

  root.appendChild(page);
}
