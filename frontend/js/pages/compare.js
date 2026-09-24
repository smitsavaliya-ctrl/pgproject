// Compare Accommodations Page Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderComparePage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  const comparedPgs = ACCOMMODATIONS.filter(pg => state.compareList.includes(pg.id));

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3rem 0 5rem 0';

  if (comparedPgs.length === 0) {
    container.innerHTML = `
      <div style="background: white; border-radius: var(--radius-xl); padding: 4rem 2rem; text-align: center; border: 1px solid var(--secondary-200); max-width: 600px; margin: 2rem auto;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚖️</div>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">No PGs Selected for Comparison</h2>
        <p style="color: var(--secondary-600); margin-bottom: 2rem;">Select up to 3 accommodations from the search results or PG cards to compare rent, deposit, amenities, and room availability side-by-side.</p>
        <button id="btn-compare-explore" class="btn btn-primary btn-lg">Explore Accommodations</button>
      </div>
    `;

    container.querySelector('#btn-compare-explore')?.addEventListener('click', () => {
      appState.setPage('search');
    });

    root.innerHTML = '';
    root.appendChild(container);
    return;
  }

  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <div>
        <h1 style="font-size: 2.25rem;">Compare Accommodations</h1>
        <p style="color: var(--secondary-600);">Side-by-side breakdown of features and pricing</p>
      </div>

      <button id="btn-clear-compare" class="btn btn-outline-primary btn-sm">Clear Comparison List</button>
    </div>

    <div style="overflow-x: auto;">
      <table class="compare-matrix-table">
        <thead>
          <tr>
            <th style="width: 220px;">Feature / Spec</th>
            ${comparedPgs.map(pg => `
              <th>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                  <span class="badge badge-gender-${pg.gender.toLowerCase()}">${pg.gender}</span>
                  <button class="btn-remove-compare" data-remove-id="${pg.id}" style="color: var(--danger-500); font-weight: 700;">✕</button>
                </div>
                <h3 style="font-size: 1.15rem; margin-bottom: 0.25rem;">${pg.name}</h3>
                <span style="font-size: 0.85rem; color: var(--secondary-600); font-weight: 400;">${pg.area}, ${pg.city}</span>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Monthly Rent</strong></td>
            ${comparedPgs.map(pg => `
              <td class="highlight">
                <span style="font-size: 1.25rem; font-weight: 800;">₹${pg.rent.toLocaleString()}</span>/mo
              </td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Security Deposit</strong></td>
            ${comparedPgs.map(pg => `
              <td>₹${pg.securityDeposit.toLocaleString()}</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Student Rating</strong></td>
            ${comparedPgs.map(pg => `
              <td>⭐ ${pg.rating} (${pg.reviewCount} reviews)</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Distance from Campus</strong></td>
            ${comparedPgs.map(pg => `
              <td>📍 ${pg.distanceFromCollege}</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Room Types Offered</strong></td>
            ${comparedPgs.map(pg => `
              <td>${pg.roomTypes.join(', ')} Sharing</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Food / Mess Service</strong></td>
            ${comparedPgs.map(pg => `
              <td>${pg.amenities.includes('Food') ? '✅ 3 Meals Included' : '❌ Not Included'}</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>High-Speed Wi-Fi</strong></td>
            ${comparedPgs.map(pg => `
              <td>${pg.amenities.includes('Wi-Fi') ? '✅ Included (5G Fiber)' : '❌ Not Available'}</td>
            `).join('')}
          </tr>

          <tr>
            <td><strong>Action</strong></td>
            ${comparedPgs.map(pg => `
              <td>
                <button class="btn btn-primary btn-sm btn-compare-details" data-pg-id="${pg.id}" style="width: 100%;">
                  View Full Details
                </button>
              </td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.btn-remove-compare').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-remove-id');
      if (id) appState.toggleCompare(id);
    });
  });

  container.querySelectorAll('.btn-compare-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-pg-id');
      if (id) appState.setPage('details', id);
    });
  });

  container.querySelector('#btn-clear-compare')?.addEventListener('click', () => {
    state.compareList = [];
    appState.showToast('Comparison list cleared.');
    appState.notify();
  });

  root.innerHTML = '';
  root.appendChild(container);
}