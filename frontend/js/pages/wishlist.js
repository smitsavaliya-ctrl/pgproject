// Wishlist Saved Page Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { createPGCard } from '../components/pgCard.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderWishlistPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  const wishlistedPgs = ACCOMMODATIONS.filter(pg => state.wishlist.includes(pg.id));

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3rem 0 5rem 0';

  if (wishlistedPgs.length === 0) {
    container.innerHTML = `
      <div style="background: white; border-radius: var(--radius-xl); padding: 4rem 2rem; text-align: center; border: 1px solid var(--secondary-200); max-width: 600px; margin: 2rem auto;">
        <div style="font-size: 3.5rem; margin-bottom: 1rem;">🤍</div>
        <h2 style="font-size: 1.75rem; margin-bottom: 0.5rem;">Your Wishlist is Empty</h2>
        <p style="color: var(--secondary-600); margin-bottom: 2rem;">Save your favorite PGs and hostels while searching so you can compare and contact owners later.</p>
        <button id="btn-wishlist-explore" class="btn btn-primary btn-lg">Explore Accommodations</button>
      </div>
    `;

    container.querySelector('#btn-wishlist-explore')?.addEventListener('click', () => {
      appState.setPage('search');
    });

    root.innerHTML = '';
    root.appendChild(container);
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 2.25rem;">Saved Wishlist</h1>
      <p style="color: var(--secondary-600);">${wishlistedPgs.length} saved student accommodations</p>
    </div>

    <div class="search-results-grid" id="wishlist-grid"></div>
  `;

  const grid = container.querySelector('#wishlist-grid');
  wishlistedPgs.forEach(pg => {
    grid.appendChild(createPGCard(pg));
  });

  root.innerHTML = '';
  root.appendChild(container);
}