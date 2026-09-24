// Contact & Support Page Component for StayNest (Live Admin Support Message Dispatch)

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderContactPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const state = appState.getState();
  const profile = state.userProfile || {};

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3rem 0 5rem 0';
  container.style.animation = 'fadeIn 0.3s ease-out';

  container.innerHTML = `
    <div style="max-width: 650px; margin: 0 auto 3rem auto; text-align: center;">
      <span style="background: #e0e7ff; color: #4338ca; font-weight: 800; font-size: 0.78rem; padding: 4px 12px; border-radius: 999px; text-transform: uppercase;">
        24/7 StayNest Support
      </span>
      <h1 style="font-size: 2.2rem; font-weight: 800; margin: 0.5rem 0 0.5rem 0; color: #0f172a;">We're Here to Help You</h1>
      <p style="color: #64748b; font-size: 1rem; margin: 0;">Have questions about a PG, room booking, or listing your property? Send us a message and our admin support team will review and reply directly!</p>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1.6fr; gap: 2.5rem; align-items: start;">
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">📞</div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Student & Hosteller Support</h3>
          <p style="color: #6366f1; font-weight: 800; font-size: 1rem; margin-bottom: 4px;">+91 8980016300</p>
          <span style="font-size: 0.8rem; color: #64748b;">Available 9:00 AM - 9:00 PM IST</span>
        </div>

        <div style="background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="font-size: 2rem; margin-bottom: 0.5rem;">✉️</div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Official Support Email</h3>
          <p style="color: #4338ca; font-weight: 700; font-size: 0.95rem; margin-bottom: 4px;">staynest11@gmail.com</p>
          <span style="font-size: 0.8rem; color: #64748b;">Direct response guaranteed within 24 hours</span>
        </div>

        <div style="background: #f8fafc; border-radius: 20px; padding: 1.25rem; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #475569;">
          🛡️ <strong>Admin Live Support Panel:</strong> Messages submitted via this support portal are logged instantly in the Admin Control Dashboard with exact HR:MIN:SEC timestamps. Admin team replies directly to your email/account!
        </div>
      </div>

      <div style="background: white; border-radius: 24px; padding: 2.25rem; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);">
        <h3 style="font-size: 1.4rem; font-weight: 800; color: #0f172a; margin-bottom: 1.25rem;">Send a Support Message</h3>

        <form id="contact-page-form" style="display: flex; flex-direction: column; gap: 1.1rem;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Your Full Name *</label>
              <input type="text" id="contact-name" required value="${profile.name || 'SMIT SAVALIYA'}" placeholder="Enter full name" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600;">
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Email Address *</label>
              <input type="email" id="contact-email" required value="${profile.email || 'smitsavaliya22072024@gmail.com'}" placeholder="name@domain.com" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Phone Number *</label>
              <input type="tel" id="contact-phone" required value="${profile.phone || '+91 98765 12345'}" placeholder="+91 89800 16300" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600;">
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Inquiry Subject *</label>
              <input type="text" id="contact-subject" required placeholder="e.g. PG Booking / Refund Inquiry" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600;">
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Detailed Message *</label>
            <textarea id="contact-message" required rows="4" placeholder="Type your inquiry or issue here..." style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-family: inherit; font-weight: 500; resize: vertical;"></textarea>
          </div>

          <button type="submit" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.9rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
            ✉️ Send Support Message to Admin
          </button>
        </form>
      </div>
    </div>
  `;

  container.querySelector('#contact-page-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameVal = container.querySelector('#contact-name').value;
    const emailVal = container.querySelector('#contact-email').value;
    const phoneVal = container.querySelector('#contact-phone').value;
    const subjectVal = container.querySelector('#contact-subject').value;
    const messageVal = container.querySelector('#contact-message').value;

    const newMsg = appState.addSupportMessage({
      userName: nameVal,
      userEmail: emailVal,
      phone: phoneVal,
      subject: subjectVal,
      message: messageVal
    });

    appState.showToast(`📩 Message sent to Admin! Ref ID: #${newMsg.id}`);
    e.target.reset();
  });

  root.innerHTML = '';
  root.appendChild(container);
}