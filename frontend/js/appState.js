import { getFormattedTimestamp } from './pages/auth.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from './dataset.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function normalizePropertyFromDB(item) {
  if (!item) return item;

  const cityName = item.city_name || (typeof item.city === 'string' ? item.city : 'Ahmedabad');
  
  let imgList = [];
  if (Array.isArray(item.images)) {
    imgList = item.images;
  } else if (typeof item.images === 'string') {
    try {
      const parsed = JSON.parse(item.images);
      imgList = Array.isArray(parsed) ? parsed : [item.images];
    } catch(e) {
      if (item.images.trim()) imgList = [item.images];
    }
  }
  
  const cleanedImages = imgList.map(img => {
    if (!img) return '';
    let s = String(img).trim();
    if (s.startsWith('./')) s = s.substring(1);
    if (!s.startsWith('/') && !s.startsWith('http')) s = '/' + s;
    return s;
  }).filter(Boolean);

  const rentVal = parseInt(item.rent || item.minRent || 7500);

  const resObj = {
    id: item.id,
    name: item.name || 'StayNest PG',
    city: cityName,
    city_name: cityName,
    area: item.area || item.locality || 'Central Area',
    locality: item.area || item.locality || 'Central Area',
    address: item.address || `${cityName}, India`,
    gender: item.gender || 'Unisex',
    verified: item.verified !== undefined ? Boolean(item.verified) : true,
    rating: parseFloat(item.rating || 4.5),
    reviewCount: item.reviewCount || item.review_count || 45,
    rent: rentVal,
    minRent: rentVal,
    maxRent: item.maxRent || Math.round(rentVal * 1.5),
    securityDeposit: parseInt(item.security_deposit || item.securityDeposit || rentVal),
    security_deposit: parseInt(item.security_deposit || item.securityDeposit || rentVal),
    collegeName: item.college_name || item.collegeName || 'Nearby University',
    college_name: item.college_name || item.collegeName || 'Nearby University',
    distanceFromCollege: item.distance_from_college || item.distanceFromCollege || '0.5 km from campus',
    distance_from_college: item.distance_from_college || item.distanceFromCollege || '0.5 km from campus',
    roomTypes: Array.isArray(item.roomTypes) ? item.roomTypes : (Array.isArray(item.room_types) ? item.room_types : ['Single', 'Double', 'Triple']),
    room_types: Array.isArray(item.room_types) ? item.room_types : ['Single', 'Double', 'Triple'],
    amenities: Array.isArray(item.amenities) ? item.amenities : ['Wi-Fi', 'Food', 'Housekeeping', 'Security'],
    description: item.description || '',
    phone: item.phone || '+91 98765 12345',
    latitude: parseFloat(item.latitude || 23.0225),
    longitude: parseFloat(item.longitude || 72.5714),
    is_featured: item.is_featured !== undefined ? Boolean(item.is_featured) : false,
    is_active: item.is_active !== undefined ? Boolean(item.is_active) : true
  };

  if (cleanedImages.length > 0) {
    resObj.images = cleanedImages;
    resObj.photos = cleanedImages;
    resObj.image = cleanedImages[0];
    resObj.coverImage = cleanedImages[0];
  }

  return resObj;
}

class AppState {
  constructor() {
    let savedBookings = [];
    let savedInquiries = [];
    let savedSupportMessages = [];
    let savedViews = 0;
    let isOwnerAuth = false;
    let isAdminAuth = false;
    let isStudentAuth = false;

    try {
      savedBookings = JSON.parse(localStorage.getItem('staynest_bookings') || '[]');
      savedInquiries = JSON.parse(localStorage.getItem('staynest_inquiries') || '[]');
      savedSupportMessages = JSON.parse(localStorage.getItem('staynest_support_messages') || '[]');
      
      const rawViews = localStorage.getItem('staynest_total_student_views');
      if (rawViews === null || parseInt(rawViews) >= 40000) {
        savedViews = 0; // Reset starting counter to 0 so first view becomes 1
      } else {
        savedViews = parseInt(rawViews);
        if (isNaN(savedViews) || savedViews < 0) savedViews = 0;
      }

      isOwnerAuth = sessionStorage.getItem('staynest_auth_owner') === 'true';
      isAdminAuth = sessionStorage.getItem('staynest_auth_admin') === 'true';
      isStudentAuth = sessionStorage.getItem('staynest_auth_student') === 'true';
    } catch (e) {
      savedBookings = [];
      savedInquiries = [];
      savedSupportMessages = [];
      savedViews = 0;
    }

    let savedThemeConfig = {
      themeMode: 'light',
      primaryColor: '#6366f1',
      secondaryColor: '#7c3aed',
      siteName: 'StayNest',
      siteTagline: 'Smart Student Accommodation Platform',
      announcementEnabled: true,
      announcementText: '🎉 Welcome to StayNest! Verified PGs & Hostels with Zero Hidden Charges & Instant Direct Contact.'
    };

    try {
      const storedTheme = localStorage.getItem('staynest_theme_config');
      if (storedTheme) {
        savedThemeConfig = { ...savedThemeConfig, ...JSON.parse(storedTheme) };
      }
    } catch(e) {}

    // Initial mock bookings with exact full timestamps if empty
    if (savedBookings.length === 0) {
      savedBookings = [
        { id: 'STN-108241', pgId: 'pg-ahmedabad-1', pgName: 'Bliss Homes 2 Boys PG', roomType: 'Single Sharing', moveInDate: '2026-08-15', rent: 16000, studentName: 'SMIT SAVALIYA', phone: '+91 98765 11223', createdAt: '2026-08-09T18:15:30Z', status: 'Pending' },
        { id: 'STN-294102', pgId: 'pg-mumbai-1', pgName: 'Seven Bungalows Marina Base', roomType: 'Double Sharing', moveInDate: '2026-08-20', rent: 44000, studentName: 'Aarav Gupta', phone: '+91 98111 44556', createdAt: '2026-08-08T14:30:12Z', status: 'Confirmed' }
      ];
    }

    // Initial mock inquiries with exact full timestamps if empty
    if (savedInquiries.length === 0) {
      savedInquiries = [
        { id: 'INQ-948120', pgId: 'pg-ahmedabad-1', pgName: 'Bliss Homes 2 Boys PG', studentName: 'Ananya Sharma', phone: '+91 98765 11223', date: '2026-08-12', timeSlot: 'Morning (10:00 AM - 1:00 PM)', createdAt: '2026-08-09T17:45:00Z', status: 'Pending' },
        { id: 'INQ-381044', pgId: 'pg-pune-1', pgName: 'Gurukrupa Executive Boys PG', studentName: 'Rahul Verma', phone: '+91 98111 44556', date: '2026-08-15', timeSlot: 'Afternoon (2:00 PM - 5:00 PM)', createdAt: '2026-08-08T16:20:05Z', status: 'Contacted' }
      ];
    }

    // Initial mock support messages with exact HR:MIN:SEC timestamps if empty
    if (savedSupportMessages.length === 0) {
      savedSupportMessages = [
        {
          id: 'MSG-882101',
          userName: 'SMIT SAVALIYA',
          userEmail: 'smitsavaliya22072024@gmail.com',
          phone: '+91 98765 12345',
          subject: 'Inquiry regarding PG Deposit Refund',
          message: 'Hi Support, I want to know if the security deposit is 100% refundable on 1-month notice?',
          timestamp: '2026-08-17 14:30:15',
          status: 'Pending',
          adminReply: null,
          repliedAt: null
        },
        {
          id: 'MSG-554192',
          userName: 'Rahul Sharma',
          userEmail: 'rahul.sharma@gmail.com',
          phone: '+91 98111 22334',
          subject: 'Property Listing Assistance',
          message: 'Hello Admin, I registered Gurukrupa Stays yesterday. Please verify my owner listing.',
          timestamp: '2026-08-17 10:15:00',
          status: 'Replied',
          adminReply: 'Hi Rahul, your PG listing has been verified and is active live on StayNest!',
          repliedAt: '2026-08-17 11:00:22'
        }
      ];
    }

    this.state = {
      currentPage: 'home',
      selectedPgId: 'pg-ahmedabad-1',
      selectedPGId: 'pg-ahmedabad-1',
      wishlist: [],
      compareList: [],
      theme: 'light',
      userRole: isOwnerAuth ? 'owner' : (isAdminAuth ? 'admin' : 'student'),
      isAuthenticatedStudent: isStudentAuth,
      isAuthenticatedOwner: isOwnerAuth,
      isAuthenticatedAdmin: isAdminAuth,
      userProfile: {
        name: 'SMIT SAVALIYA',
        email: 'smitsavaliya22072024@gmail.com',
        phone: '+91 98765 12345'
      },
      searchQuery: {
        city: 'Ahmedabad',
        area: '',
        college: '',
        keyword: ''
      },
      filters: {
        minRent: 0,
        maxRent: 100000,
        gender: 'All',
        roomTypes: [],
        amenities: [],
        minRating: 0,
        sortBy: 'Recommended'
      },
      bookings: savedBookings,
      inquiries: savedInquiries,
      supportMessages: savedSupportMessages,
      totalStudentViews: savedViews,
      themeConfig: savedThemeConfig
    };
    this.applyThemeStyle();

    this.listeners = [];

    // Increment live student view count ONCE strictly per website load / refresh (+1)
    this.incrementStudentViews(false);

    // Cross-tab / cross-window real-time synchronization
    window.addEventListener('storage', (e) => {
      if (e.key === 'staynest_total_student_views') {
        const val = parseInt(e.newValue || '0');
        if (!isNaN(val)) {
          this.state.totalStudentViews = val;
          this.notify();
          const liveEl1 = document.getElementById('live-monthly-views-count');
          if (liveEl1) liveEl1.textContent = val.toLocaleString();
          const liveEl2 = document.getElementById('admin-live-views-count');
          if (liveEl2) liveEl2.textContent = val.toLocaleString();
        }
      }
    });
  }

  getState() {
    return this.state;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  incrementStudentViews(notifyListeners = true) {
    this.state.totalStudentViews = (this.state.totalStudentViews || 0) + 1;
    try {
      localStorage.setItem('staynest_total_student_views', String(this.state.totalStudentViews));
    } catch (e) {}
    
    // Direct DOM update for live counter elements if present
    const liveEl1 = document.getElementById('live-monthly-views-count');
    if (liveEl1) liveEl1.textContent = this.state.totalStudentViews.toLocaleString();
    const liveEl2 = document.getElementById('admin-live-views-count');
    if (liveEl2) liveEl2.textContent = this.state.totalStudentViews.toLocaleString();

    if (notifyListeners) {
      this.notify();
    }
  }

  setPage(page, id = null) {
    this.state.currentPage = page;
    if (id !== null && id !== undefined) {
      const realId = (typeof id === 'object' && id !== null) ? (id.id || id.slug || id) : id;
      this.state.selectedPgId = realId;
      this.state.selectedPGId = realId;
    }
    this.notify();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setUserRole(role) {
    this.state.userRole = role;
    this.notify();
  }

  authenticateStudent(profileData = {}) {
    this.state.isAuthenticatedStudent = true;
    this.state.userRole = 'student';
    this.state.userProfile = {
      name: profileData.name || 'SMIT SAVALIYA',
      email: profileData.email || 'smitsavaliya22072024@gmail.com',
      phone: profileData.phone || '+91 98765 12345'
    };
    sessionStorage.setItem('staynest_auth_student', 'true');
    this.notify();
  }

  authenticateOwner() {
    this.state.isAuthenticatedOwner = true;
    this.state.userRole = 'owner';
    sessionStorage.setItem('staynest_auth_owner', 'true');
    this.notify();
  }

  authenticateAdmin(token = '') {
    this.state.isAuthenticatedAdmin = true;
    this.state.userRole = 'admin';
    sessionStorage.setItem('staynest_auth_admin', 'true');
    if (token) {
      sessionStorage.setItem('staynest_admin_token', token);
      localStorage.setItem('staynest_admin_token', token);
    }
    this.notify();
  }

  logoutUser() {
    this.state.isAuthenticatedStudent = false;
    this.state.isAuthenticatedOwner = false;
    this.state.isAuthenticatedAdmin = false;
    this.state.userRole = 'student';
    sessionStorage.removeItem('staynest_auth_student');
    sessionStorage.removeItem('staynest_auth_owner');
    sessionStorage.removeItem('staynest_auth_admin');
    sessionStorage.removeItem('staynest_admin_token');
    localStorage.removeItem('staynest_admin_token');
    this.notify();
  }

  updateSearchQuery(query) {
    this.state.searchQuery = { ...this.state.searchQuery, ...query };
    this.state.currentPage = 'city';
    this.notify();
  }

  setFilters(filters) {
    this.state.filters = { ...this.state.filters, ...filters };
    this.notify();
  }

  updateFilters(filters) {
    this.setFilters(filters);
  }

  toggleWishlist(pgId) {
    const list = this.state.wishlist || [];
    const idx = list.indexOf(pgId);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(pgId);
    }
    this.state.wishlist = [...list];
    this.notify();
    return idx === -1;
  }

  toggleCompare(pgId) {
    const targetStr = String(pgId);
    let list = (this.state.compareList || []).map(id => String(id));
    const idx = list.indexOf(targetStr);
    if (idx > -1) {
      list.splice(idx, 1);
      this.showToast('Removed from comparison matrix.');
    } else {
      if (list.length >= 4) {
        this.showToast('⚠️ Maximum 4 accommodations can be compared simultaneously.');
        return false;
      }
      list.push(targetStr);
      this.showToast('⚖️ Added to comparison matrix!');
    }
    this.state.compareList = [...list];
    this.notify();
    return idx === -1;
  }

  addBooking(bookingData) {
    const newBooking = {
      id: `STN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      ...bookingData
    };
    this.state.bookings = [newBooking, ...this.state.bookings];
    try {
      localStorage.setItem('staynest_bookings', JSON.stringify(this.state.bookings));
    } catch (e) {}
    this.notify();
    return newBooking;
  }

  addVisitSchedule(inquiryData) {
    const newInquiry = {
      id: `INQ-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: 'Scheduled',
      ...inquiryData
    };
    this.state.inquiries = [newInquiry, ...this.state.inquiries];
    try {
      localStorage.setItem('staynest_inquiries', JSON.stringify(this.state.inquiries));
    } catch (e) {}
    this.notify();
    return newInquiry;
  }

  addSupportMessage(msgData) {
    const nowTimestamp = getFormattedTimestamp();
    const newMsg = {
      id: `MSG-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: nowTimestamp,
      status: 'Pending',
      adminReply: null,
      repliedAt: null,
      ...msgData
    };
    this.state.supportMessages = [newMsg, ...(this.state.supportMessages || [])];
    try {
      localStorage.setItem('staynest_support_messages', JSON.stringify(this.state.supportMessages));
    } catch (e) {}
    this.notify();
    return newMsg;
  }

  replyToSupportMessage(msgId, replyText) {
    const msgList = this.state.supportMessages || [];
    const target = msgList.find(m => m.id === msgId);
    if (target) {
      target.status = 'Replied';
      target.adminReply = replyText;
      target.repliedAt = getFormattedTimestamp();
      try {
        localStorage.setItem('staynest_support_messages', JSON.stringify(this.state.supportMessages));
      } catch (e) {}
      this.notify();
      return target;
    }
    return null;
  }

  showToast(message) {
    let container = document.getElementById('staynest-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'staynest-toast-container';
      container.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 10000; display: flex; flex-direction: column; gap: 8px; pointer-events: none;';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'staynest-toast';
    toast.style.cssText = 'background: #0f172a; color: white; padding: 12px 20px; border-radius: 12px; font-weight: 600; font-size: 0.9rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3); border: 1px solid #334155; pointer-events: auto; animation: slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;';
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
  getThemeConfig() {
    return this.state.themeConfig || {
      themeMode: 'light',
      primaryColor: '#6366f1',
      secondaryColor: '#7c3aed',
      siteName: 'StayNest',
      siteTagline: 'Smart Student Accommodation Platform',
      announcementEnabled: true,
      announcementText: '🎉 Welcome to StayNest! Verified PGs & Hostels with Zero Hidden Charges & Instant Direct Contact.'
    };
  }

  updateThemeConfig(newConfig) {
    this.state.themeConfig = { ...this.getThemeConfig(), ...newConfig };
    try {
      localStorage.setItem('staynest_theme_config', JSON.stringify(this.state.themeConfig));
    } catch (e) {}

    this.applyThemeStyle();
    this.notify();
  }

  applyThemeStyle() {
    const cfg = this.getThemeConfig();
    let themeStyle = document.getElementById('staynest-dynamic-theme-style');
    if (!themeStyle) {
      themeStyle = document.createElement('style');
      themeStyle.id = 'staynest-dynamic-theme-style';
      document.head.appendChild(themeStyle);
    }

    const p = cfg.primaryColor || '#6366f1';
    const s = cfg.secondaryColor || '#7c3aed';
    const isDark = cfg.themeMode === 'dark';

    themeStyle.innerHTML = `
      :root {
        --primary-color: ${p};
        --secondary-color: ${s};
      }
      ${isDark ? `
        body { background-color: #0f172a !important; color: #f8fafc !important; }
        .hero-section, .navbar, header, .card, div[style*="background: white"], div[style*="background:#ffffff"] { background-color: #1e293b !important; color: #f8fafc !important; border-color: #334155 !important; }
        h1, h2, h3, h4, h5, h6, strong, th { color: #f8fafc !important; }
        p, span, td, label { color: #cbd5e1 !important; }
        input, select, textarea { background-color: #334155 !important; color: white !important; border-color: #475569 !important; }
      ` : ''}
    `;
  }

  loadCMSTheme() {
    try {
      const raw = localStorage.getItem('staynest_cms_theme');
      if (raw) {
        const data = JSON.parse(raw);
        if (data) {
          if (data.primary_color) document.documentElement.style.setProperty('--primary-color', data.primary_color);
          if (data.secondary_color) document.documentElement.style.setProperty('--secondary-color', data.secondary_color);
          if (data.accent_color) document.documentElement.style.setProperty('--accent-color', data.accent_color);

          this.state.themeConfig = {
            primaryColor: data.primary_color || '#6366f1',
            secondaryColor: data.secondary_color || '#7c3aed',
            themeMode: data.theme_mode || 'light',
            siteName: data.brand_name || data.site_name || 'StayNest',
            siteTagline: data.site_tagline || 'Smart Student Accommodation Platform',
            announcementEnabled: data.announcement_enabled !== undefined ? data.announcement_enabled : true,
            announcementText: data.announcement_text || '🎉 Welcome to StayNest!'
          };
          this.applyThemeStyle();
        }
      }
    } catch(e) {}
  }

  loadCMSSeo() {
    try {
      const raw = localStorage.getItem('staynest_cms_seo');
      if (raw) {
        const data = JSON.parse(raw);
        if (data) {
          if (data.meta_title) {
            document.title = data.meta_title;
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
              ogTitle = document.createElement('meta');
              ogTitle.setAttribute('property', 'og:title');
              document.head.appendChild(ogTitle);
            }
            ogTitle.setAttribute('content', data.meta_title);
          }
          if (data.meta_description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', data.meta_description);
          }
          if (data.canonical_url) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
              canonical = document.createElement('link');
              canonical.setAttribute('rel', 'canonical');
              document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', data.canonical_url);
          }
          if (data.og_image_url) {
            let ogImg = document.querySelector('meta[property="og:image"]');
            if (!ogImg) {
              ogImg = document.createElement('meta');
              ogImg.setAttribute('property', 'og:image');
              document.head.appendChild(ogImg);
            }
            ogImg.setAttribute('content', data.og_image_url);
          }
        }
      }
    } catch (e) {}
  }

  syncPropertiesFromDatabase() {
    try {
      const cached = localStorage.getItem('staynest_cms_edits_cache');
      if (cached) {
        const edits = JSON.parse(cached);
        if (Array.isArray(edits)) {
          edits.forEach(item => {
            const norm = normalizePropertyFromDB(item);
            const idx = ACCOMMODATIONS.findIndex(p => String(p.id) === String(norm.id) || (p.name && norm.name && p.name.toLowerCase().trim() === norm.name.toLowerCase().trim()));
            if (idx !== -1) {
              ACCOMMODATIONS[idx] = { ...ACCOMMODATIONS[idx], ...norm };
            }
          });
        }
      }
    } catch(e) {}
  }

}

export const appState = new AppState();
appState.loadCMSTheme();
appState.loadCMSSeo();
appState.syncPropertiesFromDatabase();

if (typeof window !== 'undefined') {
  const syncChannel = 'BroadcastChannel' in window ? new BroadcastChannel('staynest_cms_sync') : null;

  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'cms-data-updated') {
        window.dispatchEvent(new CustomEvent('cms-data-updated-internal'));
      }
    };
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'staynest_cms_sync_timestamp') {
      window.dispatchEvent(new CustomEvent('cms-data-updated-internal'));
    }
  });

  window.addEventListener('cms-data-updated', () => {
    if (syncChannel) {
      try { syncChannel.postMessage({ type: 'cms-data-updated', timestamp: Date.now() }); } catch(e){}
    }
    try { localStorage.setItem('staynest_cms_sync_timestamp', String(Date.now())); } catch(e){}
    appState.loadCMSTheme();
    appState.loadCMSSeo();
    appState.syncPropertiesFromDatabase();
    appState.notify();
  });
  
  window.addEventListener('cms-data-updated-internal', () => {
    appState.loadCMSTheme();
    appState.loadCMSSeo();
    appState.syncPropertiesFromDatabase();
    appState.notify();
  });
}
