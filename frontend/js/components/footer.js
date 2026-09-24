// Footer Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderFooter() {
  let container = document.getElementById('footer-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'footer-container';
    const appRoot = document.getElementById('app-root');
    if (appRoot && appRoot.nextSibling) {
      document.body.insertBefore(container, appRoot.nextSibling);
    } else {
      document.body.appendChild(container);
    }
  }

  container.innerHTML = `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="#" class="brand-logo" style="color: white;">
              <div class="brand-logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span>StayNest</span>
            </a>
            <p>StayNest is India's leading student accommodation discovery platform, empowering students to find verified PGs and hostels near top universities.</p>
          </div>

          <div>
            <h4 class="footer-title">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="#" data-footer-page="home">Home</a></li>
              <li><a href="#" data-footer-page="search">Search PGs</a></li>
              <li><a href="#" data-footer-page="compare">Compare PGs</a></li>
              <li><a href="#" data-footer-page="wishlist">Saved Wishlist</a></li>
              <li><a href="#" data-footer-page="about">About Us</a></li>
              <li><a href="#" data-footer-page="contact">Contact & Support</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-title">Top Student Cities</h4>
            <ul class="footer-links">
              <li><a href="#" data-footer-city="Ahmedabad">Ahmedabad PGs</a></li>
              <li><a href="#" data-footer-city="Mumbai">Mumbai PGs</a></li>
              <li><a href="#" data-footer-city="Bengaluru">Bengaluru PGs</a></li>
              <li><a href="#" data-footer-city="Delhi">Delhi PGs</a></li>
              <li><a href="#" data-footer-city="Pune">Pune PGs</a></li>
              <li><a href="#" data-footer-city="Jaipur">Jaipur PGs</a></li>
            </ul>
          </div>

          <div>
            <h4 class="footer-title">Portals & System</h4>
            <ul class="footer-links">
              <li><a href="/admin" target="_blank" id="footer-admin-login">System Admin Portal</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom" style="margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; color: #94a3b8; font-size: 0.85rem;">
          <p>© 2026 StayNest. All rights reserved. Find verified student stays across India.</p>
        </div>
      </div>
    </footer>
  `;

  container.querySelectorAll('[data-footer-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-footer-page');
      if (page) appState.setPage(page);
    });
  });

  container.querySelectorAll('[data-footer-city]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const city = link.getAttribute('data-footer-city');
      if (city) {
        appState.updateSearchQuery({ city });
      }
    });
  });

  container.querySelector('#footer-admin-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    appState.setPage('admin-login');
  });
}