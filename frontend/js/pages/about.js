// About Page Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderAboutPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '4rem 0 6rem 0';

  container.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; text-align: center; margin-bottom: 4rem;">
      <span class="section-tag">Our Mission</span>
      <h1 style="font-size: 2.75rem; margin-bottom: 1rem;">Making Student Living Effortless, Safe & Transparent</h1>
      <p style="font-size: 1.15rem; color: var(--secondary-600); line-height: 1.7;">StayNest was founded to solve a fundamental problem every student faces when moving to a new city: finding a trustworthy, affordable, and safe PG near their university without brokerage traps.</p>
    </div>

    <div class="feature-grid" style="margin-bottom: 4rem;">
      <div class="feature-card">
        <div class="feature-icon-wrapper">🛡️</div>
        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">100% Physical Verification</h3>
        <p style="font-size: 0.9rem; color: var(--secondary-600);">Our local field teams personally inspect every property for hygiene, safety measures, food quality, and amenities before listing.</p>
      </div>

      <div class="feature-card">
        <div class="feature-icon-wrapper">💰</div>
        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">Zero Brokerage Guarantee</h3>
        <p style="font-size: 0.9rem; color: var(--secondary-600);">Students connect directly with verified property owners. No middlemen, no hidden commissions.</p>
      </div>
    </div>
  `;

  root.innerHTML = '';
  root.appendChild(container);
}