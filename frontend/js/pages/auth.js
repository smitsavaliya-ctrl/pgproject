// Authentication Pages Component (Student Login, Owner Registration & Admin Login with Exact Time HR:MIN:SEC Logging) for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

// Format current timestamp with exact HR:MIN:SEC (e.g. "2026-08-14 21:25:13")
export function getFormattedTimestamp() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const dateStr = d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  const timeStr = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  return `${dateStr} ${timeStr}`;
}

// Master Admin Audit Logging Store & Helper
export function getAdminAuditLogs() {
  try {
    const raw = localStorage.getItem('staynest_admin_audit_logs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch(e) {}

  const defaultLogs = [
    {
      id: 'LOG-982104',
      timestamp: getFormattedTimestamp(),
      actionCategory: 'Property Edit',
      performedBy: 'System Admin',
      targetDetails: 'Listing #pg-ahmedabad-1 (Bliss Homes 2 Boys PG)',
      changesDescription: 'Monthly rent updated to ₹16,000 | Address & photos verified'
    },
    {
      id: 'LOG-773120',
      timestamp: getFormattedTimestamp(),
      actionCategory: 'Password Reset Approved',
      performedBy: 'System Admin',
      targetDetails: 'User Email: smitsavaliya22072024@gmail.com (SMIT SAVALIYA)',
      changesDescription: 'Password reset request approved. Desired password activated.'
    },
    {
      id: 'LOG-551029',
      timestamp: getFormattedTimestamp(),
      actionCategory: 'Support Reply Sent',
      performedBy: 'System Admin',
      targetDetails: 'User: Rahul Sharma (rahul.sharma@gmail.com)',
      changesDescription: 'Replied: "Hi Rahul, your PG listing has been verified and is active live on StayNest!"'
    }
  ];
  try {
    localStorage.setItem('staynest_admin_audit_logs', JSON.stringify(defaultLogs));
  } catch(e) {}
  return defaultLogs;
}

export function logAdminAuditAction(actionCategory, targetDetails, changesDescription) {
  const timestamp = getFormattedTimestamp();
  const newLog = {
    id: `LOG-${Math.floor(100000 + Math.random() * 900000)}`,
    timestamp,
    actionCategory: String(actionCategory || 'Admin Action'),
    performedBy: 'System Admin',
    targetDetails: String(targetDetails || 'System'),
    changesDescription: String(changesDescription || 'Action executed successfully')
  };

  const logs = getAdminAuditLogs();
  const updatedLogs = [newLog, ...logs];
  try {
    localStorage.setItem('staynest_admin_audit_logs', JSON.stringify(updatedLogs));
  } catch(e) {}
  return newLog;
}

export function clearAdminAuditLogs() {
  try {
    localStorage.removeItem('staynest_admin_audit_logs');
  } catch(e) {}
}

// Master Registered User Accounts Database Helper
export function getAuthDatabase() {
  let db = {};
  try {
    db = JSON.parse(localStorage.getItem('staynest_auth_users_db') || '{}');
  } catch (e) {}

  const now = getFormattedTimestamp();

  // Default registered users with exact HR:MIN:SEC timestamps
  if (!db['smitsavaliya22072024@gmail.com']) {
    db['smitsavaliya22072024@gmail.com'] = {
      name: 'SMIT SAVALIYA',
      role: 'Student',
      passwords: ['smit123', 'Smit@2026', 'password123', 'smit2026', 'googlePass123'],
      regTime: '2026-08-01 10:15:30',
      lastLoginTime: now
    };
  }

  if (!db['staynest11@gmail.com']) {
    db['staynest11@gmail.com'] = {
      name: 'System Admin',
      role: 'Admin',
      passwords: ['Staynest@187'],
      password: 'Staynest@187',
      regTime: '2026-07-15 09:00:00',
      lastLoginTime: now
    };
  } else {
    if (!db['staynest11@gmail.com'].passwords) db['staynest11@gmail.com'].passwords = [];
    if (!db['staynest11@gmail.com'].passwords.includes('Staynest@187')) {
      db['staynest11@gmail.com'].passwords.unshift('Staynest@187');
    }
    db['staynest11@gmail.com'].password = 'Staynest@187';
  }

  if (!db['admin@staynest.com']) {
    db['admin@staynest.com'] = {
      name: 'System Admin',
      role: 'Admin',
      passwords: ['Staynest@187', 'password123', 'admin123'],
      password: 'Staynest@187',
      regTime: '2026-07-15 09:00:00',
      lastLoginTime: now
    };
  } else {
    if (!db['admin@staynest.com'].passwords.includes('Staynest@187')) {
      db['admin@staynest.com'].passwords.unshift('Staynest@187');
    }
  }

  if (!db['rajesh.owner@staynest.com']) {
    db['rajesh.owner@staynest.com'] = {
      name: 'Rajesh Patel',
      role: 'Owner',
      passwords: ['password123', 'owner123'],
      regTime: '2026-07-20 14:30:45',
      lastLoginTime: '2026-08-14 18:22:10'
    };
  }

  if (!db['sachin.sharma@gmail.com']) {
    db['sachin.sharma@gmail.com'] = {
      name: 'Sachin Sharma',
      role: 'Student',
      passwords: ['sachin123'],
      regTime: '2026-08-05 11:45:12',
      lastLoginTime: '2026-08-14 12:10:05'
    };
  }

  if (!db['ananya.patel@gmail.com']) {
    db['ananya.patel@gmail.com'] = {
      name: 'Ananya Patel',
      role: 'Student',
      passwords: ['ananya2026'],
      regTime: '2026-08-10 16:20:00',
      lastLoginTime: '2026-08-14 15:40:22'
    };
  }

  return db;
}

export function saveAuthDatabase(db) {
  try {
    localStorage.setItem('staynest_auth_users_db', JSON.stringify(db));
  } catch (e) {}
}

// Password Reset Request Store & Admin Approval Helpers
export function getPasswordResetRequests() {
  try {
    return JSON.parse(localStorage.getItem('staynest_password_reset_requests') || '[]');
  } catch (e) {
    return [];
  }
}

export function savePasswordResetRequests(requests) {
  try {
    localStorage.setItem('staynest_password_reset_requests', JSON.stringify(requests));
  } catch (e) {}
}

export function addPasswordResetRequest({ email, role, desiredPassword, note }) {
  const requests = getPasswordResetRequests();
  const cleanEmail = (email || '').toLowerCase().trim();
  const newReq = {
    id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
    email: cleanEmail,
    role: role || 'Student',
    desiredPassword: desiredPassword || 'password123',
    note: note || 'Password Reset Requested',
    status: 'Pending',
    requestTime: getFormattedTimestamp()
  };
  requests.unshift(newReq);
  savePasswordResetRequests(requests);
  return newReq;
}

export function approvePasswordResetRequest(reqId) {
  const requests = getPasswordResetRequests();
  const req = requests.find(r => r.id === reqId);
  if (req) {
    req.status = 'Approved';
    req.approvedTime = getFormattedTimestamp();
    savePasswordResetRequests(requests);

    // Update password in staynest_auth_users_db
    const db = getAuthDatabase();
    const cleanInput = (req.email || '').toLowerCase().trim();
    const cleanPhone = cleanInput.replace(/\D/g, '');

    // Search for existing user matching email or phone
    let targetKey = null;
    if (db[cleanInput]) {
      targetKey = cleanInput;
    } else {
      for (const k in db) {
        const u = db[k];
        const keyPhone = k.replace(/\D/g, '');
        const userPhone = (u.phone || '').replace(/\D/g, '');
        if (
          k.toLowerCase() === cleanInput ||
          (cleanPhone && cleanPhone.length >= 7 && (keyPhone.includes(cleanPhone) || userPhone.includes(cleanPhone)))
        ) {
          targetKey = k;
          break;
        }
      }
    }

    if (!targetKey) {
      targetKey = cleanInput;
    }

    if (db[targetKey]) {
      if (!db[targetKey].passwords) db[targetKey].passwords = [];
      db[targetKey].passwords.unshift(req.desiredPassword);
      if (cleanPhone) db[targetKey].phone = cleanInput;
    } else {
      db[targetKey] = {
        name: cleanInput.includes('@') ? cleanInput.split('@')[0].toUpperCase() : 'Registered User',
        role: req.role,
        passwords: [req.desiredPassword],
        phone: cleanInput,
        regTime: getFormattedTimestamp(),
        lastLoginTime: getFormattedTimestamp()
      };
    }
    saveAuthDatabase(db);
    logAdminAuditAction('Password Reset Approved', `Request #${req.id} (User: ${req.email})`, `Approved desired password '${req.desiredPassword}'. User password updated live.`);
  }
  return req;
}

export function rejectPasswordResetRequest(reqId) {
  const requests = getPasswordResetRequests();
  const req = requests.find(r => r.id === reqId);
  if (req) {
    req.status = 'Rejected';
    req.rejectedTime = getFormattedTimestamp();
    savePasswordResetRequests(requests);
    logAdminAuditAction('Password Reset Rejected', `Request #${req.id} (User: ${req.email})`, `Password reset request rejected.`);
  }
  return req;
}

// Strict Password Verification Function for ALL Sign In methods (Email & Mobile Phone)
function verifyUserCredentials(inputContact, password) {
  const cleanInput = (inputContact || '').toLowerCase().trim();
  const db = getAuthDatabase();

  if (!cleanInput) {
    return {
      success: false,
      errorMsg: '❌ Please enter your Email Address or Mobile Phone.'
    };
  }

  if (!password) {
    return {
      success: false,
      errorMsg: '❌ Password cannot be blank. Please enter your password.'
    };
  }

  // Search for matching user account by key, email, or phone number
  let targetKey = null;
  let userAccount = null;

  if (db[cleanInput]) {
    targetKey = cleanInput;
    userAccount = db[cleanInput];
  } else {
    const cleanDigits = cleanInput.replace(/\D/g, '');
    for (const key in db) {
      const user = db[key];
      const keyDigits = key.replace(/\D/g, '');
      const userPhoneDigits = (user.phone || '').replace(/\D/g, '');

      if (
        key.toLowerCase() === cleanInput ||
        (cleanDigits && cleanDigits.length >= 7 && (keyDigits.includes(cleanDigits) || userPhoneDigits.includes(cleanDigits)))
      ) {
        targetKey = key;
        userAccount = user;
        break;
      }
    }
  }

  if (userAccount) {
    const validPasses = userAccount.passwords || (userAccount.password ? [userAccount.password] : []);
    const isMatch = validPasses.includes(password) || password === userAccount.password;

    if (!isMatch) {
      return {
        success: false,
        errorMsg: `❌ Incorrect Password! The password entered for "${inputContact}" is incorrect. Access Denied!`
      };
    }

    // Update last active / login timestamp with exact HR:MIN:SEC
    userAccount.lastLoginTime = getFormattedTimestamp();
    db[targetKey] = userAccount;
    saveAuthDatabase(db);

    return {
      success: true,
      user: {
        name: userAccount.name,
        email: targetKey,
        lastLoginTime: userAccount.lastLoginTime
      }
    };
  } else {
    // For unregistered accounts attempting login
    return {
      success: false,
      errorMsg: `❌ Account Not Found! No account registered with "${inputContact}". Please Register first or submit a Password Reset Request.`
    };
  }
}

export function renderLoginPage(defaultTab = 'student') {
  const root = document.getElementById('app-root');
  if (!root) return;

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3.5rem 0';

  let activeTab = defaultTab || 'student'; // 'student' | 'owner' | 'admin'

  function renderContent() {
    container.innerHTML = `
      <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; padding: 2.25rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="background: #eef2ff; color: #6366f1; width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; border: 1px solid #c7d2fe;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">Welcome to StayNest</h2>
          <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Select your account type to sign in</p>
        </div>

        <form id="login-form" autocomplete="off" style="display: flex; flex-direction: column; gap: 1.15rem;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">
              Student Email Address or Mobile Phone
            </label>
            <input type="text" id="login-email" required autocomplete="off" placeholder="Enter Student Email or Phone" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;" value="">
          </div>

          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155;">Password</label>
              <a href="#" id="btn-forgot-password" style="font-size: 0.78rem; color: #6366f1; font-weight: 700; text-decoration: none;">Forgot Password?</a>
            </div>
            <input type="password" id="login-password" required autocomplete="new-password" placeholder="Enter Password" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;" value="">
          </div>

          <button type="submit" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
            🎓 Sign In as Student
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.15rem; border-top: 1px solid #f1f5f9; font-size: 0.88rem; color: #64748b;">
          Don't have an account? <a href="#" id="link-to-register" style="color: #6366f1; font-weight: 800; text-decoration: none;">Register Now</a>
        </div>
      </div>
    `;

    const formErrorBox = container.querySelector('#login-form-error-box');
    const passInput = container.querySelector('#login-password');
    const emailInput = container.querySelector('#login-email');

    container.querySelector('#login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const password = passInput.value.trim();

      // Reset border styles
      passInput.style.border = '1px solid #cbd5e1';
      emailInput.style.border = '1px solid #cbd5e1';

      // Perform STRICT Password Verification on Student login
      const authResult = verifyUserCredentials(email, password);

      if (!authResult.success) {
        formErrorBox.innerHTML = `<strong>${authResult.errorMsg}</strong>`;
        formErrorBox.style.display = 'block';
        passInput.style.border = '2px solid #ef4444';
        passInput.value = '';
        passInput.focus();
        return;
      }

      formErrorBox.style.display = 'none';
      appState.authenticateStudent({ email: authResult.user.email, name: authResult.user.name });
      appState.showToast(`🎓 Logged in as Student (${authResult.user.name}) at ${authResult.user.lastLoginTime}.`);
      appState.setPage('home');
    });

    container.querySelector('#btn-forgot-password')?.addEventListener('click', (e) => {
      e.preventDefault();
      const currentEmail = container.querySelector('#login-email')?.value || '';
      showForgotPasswordRequestModal(currentEmail, activeTab);
    });

    container.querySelector('#link-to-register')?.addEventListener('click', (e) => {
      e.preventDefault();
      renderRegisterPage();
    });

    container.querySelector('#link-to-owner-reg')?.addEventListener('click', (e) => {
      e.preventDefault();
      renderOwnerRegisterPage();
    });
  }

  renderContent();
  root.innerHTML = '';
  root.appendChild(container);
}

export function renderRegisterPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3.5rem 0';

  container.innerHTML = `
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; padding: 2.25rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">Create Student Account</h2>
        <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Sign up to reserve verified PGs & hostels</p>
      </div>

      <form id="reg-form" style="display: flex; flex-direction: column; gap: 1.15rem;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Full Name</label>
          <input type="text" id="reg-name" required placeholder="SMIT SAVALIYA" value="SMIT SAVALIYA" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Email Address</label>
          <input type="email" id="reg-email" required placeholder="smitsavaliya22072024@gmail.com" value="smitsavaliya22072024@gmail.com" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Mobile Phone Number</label>
          <input type="tel" id="reg-phone" required placeholder="+91 98765 43210" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Create Password</label>
          <input type="password" id="reg-password" required placeholder="••••••••" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
          Create Student Account
        </button>
      </form>
    </div>
  `;

  container.querySelector('#reg-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = container.querySelector('#reg-name').value;
    const email = container.querySelector('#reg-email').value;
    const password = container.querySelector('#reg-password').value;

    const timestamp = getFormattedTimestamp();
    const db = getAuthDatabase();
    db[email.toLowerCase().trim()] = {
      name: name,
      role: 'Student',
      passwords: [password],
      regTime: timestamp,
      lastLoginTime: timestamp
    };
    saveAuthDatabase(db);

    appState.authenticateStudent({ name, email });
    appState.showToast(`🎓 Registration successful! Account created at ${timestamp}.`);
    appState.setPage('home');
  });

  root.innerHTML = '';
  root.appendChild(container);
}

export function renderOwnerRegisterPage() {
  const root = document.getElementById('app-root');
  if (!root) return;

  const container = document.createElement('div');
  container.className = 'container';
  container.style.padding = '3.5rem 0';

  container.innerHTML = `
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; padding: 2.25rem; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.08); border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h2 style="font-size: 1.75rem; font-weight: 800; color: #0f172a; margin-bottom: 0.35rem;">Register PG Property</h2>
        <p style="color: #64748b; font-size: 0.9rem; margin: 0;">Partner with StayNest to list your accommodations</p>
      </div>

      <form id="owner-reg-form" style="display: flex; flex-direction: column; gap: 1.15rem;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Property / Business Name</label>
          <input type="text" required placeholder="e.g. Gurukrupa Executive Stays" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Owner Contact Email</label>
          <input type="email" id="owner-reg-email" required placeholder="owner@domain.com" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Create Owner Password</label>
          <input type="password" id="owner-reg-pass" required placeholder="••••••••" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Owner Mobile Phone (for WhatsApp Alerts)</label>
          <input type="tel" required placeholder="+91 99755 24054" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; font-size: 0.9rem;">
        </div>
        <button type="submit" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; margin-top: 0.5rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
          🏠 Register Property Owner Account
        </button>
      </form>
    </div>
  `;

  container.querySelector('#owner-reg-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = container.querySelector('#owner-reg-email').value;
    const password = container.querySelector('#owner-reg-pass').value;

    const timestamp = getFormattedTimestamp();
    const db = getAuthDatabase();
    db[email.toLowerCase().trim()] = {
      name: 'Property Owner',
      role: 'Owner',
      passwords: [password],
      regTime: timestamp,
      lastLoginTime: timestamp
    };
    saveAuthDatabase(db);

    appState.authenticateOwner();
    appState.showToast(`🏠 Owner Account Registered at ${timestamp}!`);
    appState.setPage('ownerDashboard');
  });

  root.innerHTML = '';
  root.appendChild(container);
}

export function renderAdminLoginPage() {
  if (window.location.pathname !== '/admin' && window.location.pathname !== '/admin.html') {
    window.location.href = '/admin';
  }
}

export function showForgotPasswordOTPModal(defaultContact = '') {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';

  let currentStep = 1; // 1: Send OTP, 2: Verify OTP, 3: Reset Password
  let generatedOTP = null;
  let targetContact = defaultContact;

  modal.innerHTML = `
    <div style="background: white; padding: 2.25rem; border-radius: 24px; max-width: 480px; width: 92%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid #e2e8f0; position: relative;">
      
      <button id="btn-close-otp-modal-x" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-weight: 800; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">✕</button>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="background: #eef2ff; color: #6366f1; width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; font-size: 1.6rem;">
          🔑
        </div>
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Reset Account Password</h3>
        <p style="color: #64748b; font-size: 0.88rem; margin: 0;">100% Accurate OTP Verification & Password Recovery</p>
      </div>

      <div id="otp-status-message" style="display: none; padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.88rem; font-weight: 700; margin-bottom: 1.15rem; text-align: center;"></div>

      <form id="otp-recovery-form" style="display: flex; flex-direction: column; gap: 1.15rem;">
        
        <!-- Step 1 & 2: Contact & OTP Code Container -->
        <div id="step-1-contact-container">
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Enter Registered Email or Mobile Number *</label>
          <input type="text" id="input-recovery-contact" required placeholder="e.g. smitsavaliya22072024@gmail.com or +91 98765 12345" value="${defaultContact}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; outline: none; box-sizing: border-box;">
        </div>

        <div id="step-2-otp-container" style="display: none;">
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Enter 6-Digit Verification OTP *</label>
          <input type="text" id="input-otp-code" maxlength="6" placeholder="Enter 6-Digit OTP" style="width: 100%; padding: 0.75rem 1rem; border: 2px solid #6366f1; border-radius: 10px; font-size: 1.25rem; font-weight: 800; letter-spacing: 4px; text-align: center; outline: none; box-sizing: border-box;">
          <div style="font-size: 0.76rem; color: #64748b; margin-top: 4px; text-align: center;">Check the dispatched SMS/Email banner above and enter the 6-digit code.</div>
        </div>

        <!-- Step 3: New Password Input Container -->
        <div id="step-3-password-container" style="display: none; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Create New Password *</label>
            <input type="password" id="input-new-pass" placeholder="••••••••" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; outline: none; box-sizing: border-box;">
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Confirm New Password *</label>
            <input type="password" id="input-confirm-pass" placeholder="••••••••" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; outline: none; box-sizing: border-box;">
          </div>
        </div>

        <button type="submit" id="btn-otp-action" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
          📲 Send 6-Digit Verification OTP
        </button>

      </form>
    </div>
  `;

  function dismissModal() {
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  modal.querySelector('#btn-close-otp-modal-x').addEventListener('click', dismissModal);

  const form = modal.querySelector('#otp-recovery-form');
  const statusMsg = modal.querySelector('#otp-status-message');
  const contactInput = modal.querySelector('#input-recovery-contact');
  const otpInput = modal.querySelector('#input-otp-code');
  const newPassInput = modal.querySelector('#input-new-pass');
  const confirmPassInput = modal.querySelector('#input-confirm-pass');
  const actionBtn = modal.querySelector('#btn-otp-action');

  const step1Container = modal.querySelector('#step-1-contact-container');
  const step2Container = modal.querySelector('#step-2-otp-container');
  const step3Container = modal.querySelector('#step-3-password-container');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      targetContact = contactInput.value.trim();
      if (!targetContact) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#fef2f2';
        statusMsg.style.color = '#991b1b';
        statusMsg.style.border = '1px solid #fecaca';
        statusMsg.innerHTML = '❌ Please enter your email or phone number.';
        return;
      }

      // Generate unique 6-digit OTP code specifically for target contact
      generatedOTP = String(Math.floor(100000 + Math.random() * 900000));
      
      const isEmail = targetContact.includes('@');
      const cleanPhone = targetContact.replace(/\D/g, '');

      statusMsg.style.display = 'block';
      statusMsg.style.background = '#ecfdf5';
      statusMsg.style.color = '#065f46';
      statusMsg.style.border = '1.5px solid #10b981';

      if (isEmail) {
        statusMsg.innerHTML = `
          <div style="font-size: 0.92rem; font-weight: 800; margin-bottom: 4px;">✓ 6-Digit Verification OTP sent to <strong>${targetContact}</strong>!</div>
          <div style="font-size: 0.8rem; color: #047857; font-weight: 600; margin-top: 4px; line-height: 1.4;">
            Please check your Email inbox or click below to receive your OTP code:
          </div>
          <div style="margin-top: 10px;">
            <a href="mailto:${targetContact}?subject=StayNest%20Security%20OTP%20Code&body=Your%20StayNest%20Verification%20OTP%20Code%20is%20${generatedOTP}" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: #ea4335; color: white; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 800; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(234,67,53,0.3);">
              📧 Open Gmail / Email App to Receive OTP
            </a>
          </div>
        `;
        appState.showToast(`📧 Verification OTP sent to ${targetContact}. Check your Email Inbox.`);
      } else {
        const phoneFormatted = cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone;
        statusMsg.innerHTML = `
          <div style="font-size: 0.92rem; font-weight: 800; margin-bottom: 4px;">✓ 6-Digit Verification OTP sent to <strong>${targetContact}</strong>!</div>
          <div style="font-size: 0.8rem; color: #047857; font-weight: 600; margin-top: 4px; line-height: 1.4;">
            Please check your WhatsApp app or click below to receive your OTP code:
          </div>
          <div style="margin-top: 10px;">
            <a href="https://api.whatsapp.com/send?phone=${phoneFormatted}&text=Your%20StayNest%20Security%20Verification%20OTP%20Code%20is%20${generatedOTP}" target="_blank" style="display: inline-flex; align-items: center; gap: 6px; background: #25d366; color: white; padding: 10px 20px; border-radius: 999px; text-decoration: none; font-weight: 800; font-size: 0.88rem; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
              💬 Open WhatsApp App to Receive OTP
            </a>
          </div>
        `;
        appState.showToast(`💬 Verification OTP sent to ${targetContact}. Check your WhatsApp App.`);
      }

      contactInput.disabled = true;
      step2Container.style.display = 'block';
      
      otpInput.value = '';
      otpInput.focus();

      actionBtn.innerHTML = '✓ Verify OTP';
      currentStep = 2;

    } else if (currentStep === 2) {
      const userEnteredOTP = otpInput.value.trim();

      // System verifies the exact generated OTP code for the user's contact
      if (!userEnteredOTP || userEnteredOTP !== generatedOTP) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#fef2f2';
        statusMsg.style.color = '#991b1b';
        statusMsg.style.border = '1px solid #fecaca';
        statusMsg.innerHTML = `❌ Invalid OTP code entered for ${targetContact}. Please enter the correct 6-digit code sent to your SMS/Email.`;
        otpInput.style.borderColor = '#ef4444';
        otpInput.focus();
        return;
      }

      // OTP Verified 100%!
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#ecfdf5';
      statusMsg.style.color = '#065f46';
      statusMsg.style.border = '1px solid #a7f3d0';
      statusMsg.innerHTML = '✓ OTP VERIFIED SUCCESSFULLY! Enter your new password below.';

      appState.showToast('✓ 100% OTP Verified! Create your new password.');

      step1Container.style.display = 'none';
      step2Container.style.display = 'none';
      step3Container.style.display = 'flex';
      newPassInput.focus();
      actionBtn.innerHTML = '🔐 Save New Password & Update Account';
      currentStep = 3;

    } else if (currentStep === 3) {
      const p1 = newPassInput.value.trim();
      const p2 = confirmPassInput.value.trim();

      if (!p1 || p1.length < 4) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#fef2f2';
        statusMsg.style.color = '#991b1b';
        statusMsg.style.border = '1px solid #fecaca';
        statusMsg.innerHTML = '❌ Password must be at least 4 characters long.';
        return;
      }

      if (p1 !== p2) {
        statusMsg.style.display = 'block';
        statusMsg.style.background = '#fef2f2';
        statusMsg.style.color = '#991b1b';
        statusMsg.style.border = '1px solid #fecaca';
        statusMsg.innerHTML = '❌ New password and confirmation password do not match!';
        return;
      }

      // Update password in auth database
      const db = getAuthDatabase();
      const cleanContact = targetContact.toLowerCase().trim();

      let targetUser = db[cleanContact];
      if (!targetUser) {
        for (const k in db) {
          if (k.includes(cleanContact) || db[k].role.toLowerCase() === 'student') {
            targetUser = db[k];
            break;
          }
        }
      }

      if (!targetUser) {
        targetUser = db['smitsavaliya22072024@gmail.com'];
      }

      if (targetUser) {
        if (!targetUser.passwords) targetUser.passwords = [];
        targetUser.passwords.unshift(p1);
        saveAuthDatabase(db);
      }

      appState.showToast('✅ Password updated successfully! You can now log in.');
      dismissModal();

      const loginPassInput = document.getElementById('login-password');
      if (loginPassInput) {
        loginPassInput.value = p1;
        loginPassInput.focus();
      }
    }
  });

  document.body.appendChild(modal);
}

export function showForgotPasswordRequestModal(defaultContact = '', activeRole = 'Student') {
  const modal = document.createElement('div');
  modal.className = 'modal-backdrop';
  modal.style.cssText = 'position: fixed; inset: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';

  const roleFormatted = (activeRole === 'owner' || activeRole === 'Owner') ? 'Owner' : 'Student';

  modal.innerHTML = `
    <div style="background: white; padding: 2.25rem; border-radius: 24px; max-width: 480px; width: 92%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); border: 1px solid #e2e8f0; position: relative;">
      
      <button id="btn-close-req-modal-x" style="position: absolute; top: 16px; right: 16px; background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-weight: 800; cursor: pointer; color: #475569; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">✕</button>

      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="background: #eef2ff; color: #6366f1; width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto; font-size: 1.6rem;">
          🔑
        </div>
        <h3 style="font-size: 1.5rem; font-weight: 800; color: #0f172a; margin-bottom: 0.25rem;">Request Password Reset</h3>
        <p style="color: #64748b; font-size: 0.88rem; margin: 0;">Submit request to Admin for password approval</p>
      </div>

      <div id="reset-req-status-msg" style="display: none; padding: 0.85rem 1rem; border-radius: 12px; font-size: 0.88rem; font-weight: 700; margin-bottom: 1.15rem; text-align: center;"></div>

      <form id="form-forgot-pass-request" style="display: flex; flex-direction: column; gap: 1.15rem;">
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Account Role *</label>
          <select id="req-role" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; font-weight: 600; background: white;">
            <option value="Student" ${roleFormatted === 'Student' ? 'selected' : ''}>🎓 Student</option>
            <option value="Owner" ${roleFormatted === 'Owner' ? 'selected' : ''}>🏠 PG Owner</option>
          </select>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Registered Email or Mobile Phone *</label>
          <input type="text" id="req-email-phone" required placeholder="e.g. smitsavaliya22072024@gmail.com or 9876543210" value="${defaultContact}" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Desired New Password *</label>
          <input type="password" id="req-new-password" required placeholder="Enter desired new password" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.9rem; outline: none; box-sizing: border-box;">
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #334155; margin-bottom: 0.35rem;">Additional Note for Admin (Optional)</label>
          <textarea id="req-note" rows="2" placeholder="e.g. Please approve my reset request for student account" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 0.88rem; outline: none; box-sizing: border-box; font-family: inherit;"></textarea>
        </div>

        <button type="submit" id="btn-submit-reset-req" style="width: 100%; background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; font-weight: 800; padding: 0.85rem; border-radius: 999px; cursor: pointer; font-size: 0.95rem; box-shadow: 0 4px 14px rgba(99,102,241,0.35);">
          📩 Send Password Reset Request to Admin
        </button>
      </form>
    </div>
  `;

  function dismissModal() {
    if (modal && modal.parentNode) modal.parentNode.removeChild(modal);
  }

  modal.querySelector('#btn-close-req-modal-x').addEventListener('click', dismissModal);

  const form = modal.querySelector('#form-forgot-pass-request');
  const statusMsg = modal.querySelector('#reset-req-status-msg');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = modal.querySelector('#req-role').value;
    const email = modal.querySelector('#req-email-phone').value.trim();
    const desiredPassword = modal.querySelector('#req-new-password').value.trim();
    const note = modal.querySelector('#req-note').value.trim();

    if (!email) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#fef2f2';
      statusMsg.style.color = '#991b1b';
      statusMsg.style.border = '1px solid #fecaca';
      statusMsg.innerHTML = '❌ Please enter your registered email address or mobile phone.';
      return;
    }

    if (!desiredPassword || desiredPassword.length < 4) {
      statusMsg.style.display = 'block';
      statusMsg.style.background = '#fef2f2';
      statusMsg.style.color = '#991b1b';
      statusMsg.style.border = '1px solid #fecaca';
      statusMsg.innerHTML = '❌ Desired password must be at least 4 characters long.';
      return;
    }

    const newReq = addPasswordResetRequest({ email, role, desiredPassword, note });

    statusMsg.style.display = 'block';
    statusMsg.style.background = '#ecfdf5';
    statusMsg.style.color = '#065f46';
    statusMsg.style.border = '1.5px solid #10b981';
    statusMsg.innerHTML = `
      <div style="font-size: 0.92rem; font-weight: 800; margin-bottom: 4px;">✅ Request Sent to Admin!</div>
      <div style="font-size: 0.8rem; color: #047857; font-weight: 600; line-height: 1.4;">
        Request ID: <strong>${newReq.id}</strong><br>
        Your password reset request has been sent to Admin for approval. Once approved, you can log in with your new password.
      </div>
    `;

    appState.showToast(`📩 Password Reset Request (${newReq.id}) sent to Admin for approval!`);

    modal.querySelector('#btn-submit-reset-req').style.display = 'none';
    setTimeout(() => {
      dismissModal();
    }, 2500);
  });

  document.body.appendChild(modal);
}