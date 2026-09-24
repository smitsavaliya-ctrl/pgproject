// SearchBar Hero Widget Component for StayNest (Smart Auto-Clear on City Change)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { api } from '../api.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function createSearchBar() {
  const wrapper = document.createElement('div');
  wrapper.style.width = '100%';
  
  const currentQuery = appState.getState().searchQuery;

  wrapper.innerHTML = `
    <div class="hero-search-box">
      <div class="search-field-group">
        <label class="search-field-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          City
        </label>
        <select id="search-city-select" class="search-field-input">
          <option value="Ahmedabad" ${currentQuery.city === 'Ahmedabad' ? 'selected' : ''}>Ahmedabad</option>
          <option value="Mumbai" ${currentQuery.city === 'Mumbai' ? 'selected' : ''}>Mumbai</option>
          <option value="Pune" ${currentQuery.city === 'Pune' ? 'selected' : ''}>Pune</option>
          <option value="Delhi" ${currentQuery.city === 'Delhi' ? 'selected' : ''}>Delhi</option>
          <option value="Bengaluru" ${currentQuery.city === 'Bengaluru' ? 'selected' : ''}>Bengaluru</option>
          <option value="Jaipur" ${currentQuery.city === 'Jaipur' ? 'selected' : ''}>Jaipur</option>
        </select>
      </div>

      <div class="search-field-group">
        <label class="search-field-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M15 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
          Area / Locality
        </label>
        <input type="text" id="search-area-input" class="search-field-input" placeholder="e.g. Navrangpura, Andheri West..." value="${currentQuery.area || ''}">
      </div>

      <div class="search-field-group">
        <label class="search-field-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          College / University
        </label>
        <input type="text" id="search-college-input" class="search-field-input" placeholder="e.g. Nirma, NMIMS, IIT..." value="${currentQuery.college || ''}">
      </div>

      <div class="search-field-group">
        <label class="search-field-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 21-4.3-4.3"/><circle cx="11" cy="11" r="8"/></svg>
          PG or Hostel Name
        </label>
        <input type="text" id="search-keyword-input" class="search-field-input" placeholder="e.g. Urban Nest, Stanza..." value="${currentQuery.keyword || ''}">
      </div>

      <button id="btn-hero-search" class="btn btn-primary btn-search-trigger">
        Search Stay
      </button>
    </div>

    <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;">
      <button id="btn-use-location" class="use-location-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></svg>
        📍 Use My Location
      </button>

      <div style="display: inline-flex; align-items: center; gap: 0.4rem; background: white; padding: 0.4rem 0.85rem; border-radius: var(--radius-full); border: 1px solid var(--primary-100); font-size: 0.85rem; font-weight: 600; color: var(--secondary-700);">
        <span>College Distance:</span>
        <select id="search-dist-select" style="border: none; background: transparent; font-weight: 700; color: var(--primary-600); cursor: pointer;">
          <option value="10">Within 10 km</option>
          <option value="5">Within 5 km</option>
          <option value="3">Within 3 km</option>
          <option value="1">Within 1 km</option>
        </select>
      </div>
    </div>
  `;

  const citySelect = wrapper.querySelector('#search-city-select');
  const areaInput = wrapper.querySelector('#search-area-input');
  const collegeInput = wrapper.querySelector('#search-college-input');
  const keywordInput = wrapper.querySelector('#search-keyword-input');

  // Automatically clear sub-fields whenever user picks a different city in the dropdown
  citySelect?.addEventListener('change', () => {
    if (areaInput) areaInput.value = '';
    if (collegeInput) collegeInput.value = '';
    if (keywordInput) keywordInput.value = '';
  });

  // Attach search trigger
  wrapper.querySelector('#btn-hero-search')?.addEventListener('click', () => {
    const city = citySelect ? citySelect.value : 'Ahmedabad';
    const area = areaInput ? areaInput.value.trim() : '';
    const college = collegeInput ? collegeInput.value.trim() : '';
    const keyword = keywordInput ? keywordInput.value.trim() : '';
    const maxDistance = wrapper.querySelector('#search-dist-select')?.value;

    appState.updateSearchQuery({ city, area, college, keyword, maxDistance });
  });

  // Attach "Use My Location" HTML5 Geolocation API helper
  wrapper.querySelector('#btn-use-location')?.addEventListener('click', () => {
    if (!navigator.geolocation) {
      appState.showToast('Browser location unavailable. Search by city instead.');
      return;
    }

    appState.showToast('Getting high-accuracy GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        appState.updateSearchQuery({
          userLat: latitude,
          userLng: longitude
        });
        appState.showToast(`Centered on your GPS location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
      },
      (err) => {
        appState.showToast('Location permission denied. Continuing with manual search.');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });

  return wrapper;
}
