// StayNest Full-Stack API Client Layer
// Connects Vanilla JS Frontend to Django REST Framework Backend (http://localhost:8000/api/)

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class StayNestAPI {
  constructor() {
    this.token = localStorage.getItem('staynest_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) localStorage.setItem('staynest_token', token);
    else localStorage.removeItem('staynest_token');
  }

  getHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...(options.headers || {})
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      console.warn(`[StayNest API Fallback for ${endpoint}]:`, err.message);
      return null;
    }
  }

  // Auth Endpoints
  async register(data) {
    return await this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(username, password) {
    const res = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res && res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  // City API (Returns dynamic PG count calculated directly from database)
  async getCities() {
    const res = await this.request('/cities/');
    return res ? (res.results || res) : null;
  }

  // Locality API
  async getLocalities(cityName = '') {
    const query = cityName ? `?city=${encodeURIComponent(cityName)}` : '';
    const res = await this.request(`/localities/${query}`);
    return res ? (res.results || res) : null;
  }

  // Institutions / Colleges API
  async getInstitutions(cityName = '') {
    const query = cityName ? `?city=${encodeURIComponent(cityName)}` : '';
    const res = await this.request(`/institutions/${query}`);
    return res ? (res.results || res) : null;
  }

  // Property Search & Filters API
  async getProperties(filters = {}) {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.area || filters.locality) params.append('locality', filters.area || filters.locality);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.maxRent) params.append('max_rent', filters.maxRent);
    if (filters.minRating) params.append('min_rating', filters.minRating);
    if (filters.roomType) params.append('room_type', filters.roomType);
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.collegeId) params.append('college_id', filters.collegeId);
    if (filters.maxDistance) params.append('max_distance', filters.maxDistance);
    if (filters.userLat && filters.userLng) {
      params.append('user_lat', filters.userLat);
      params.append('user_lng', filters.userLng);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request(`/properties/${query}`);
    return res ? (res.results || res) : null;
  }

  // Alias for getProperties to ensure backwards compatibility across all page components
  async getAccommodations(filters = {}) {
    return await this.getProperties(filters);
  }

  // Single Property Details API
  async getAccommodationById(id) {
    const res = await this.request(`/properties/${id}/`);
    return res ? res : null;
  }

  // Recommendation Engine API (Calculates 5-factor score match)
  async getRecommendations(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await this.request(`/properties/recommendations/?${query}`);
    return res ? (res.results || res) : null;
  }

  // Booking API (Atomic database transaction)
  async createBooking(data) {
    return await this.request('/bookings/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Inquiry API
  async createInquiry(data) {
    return await this.request('/inquiries/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Favorite / Wishlist API
  async toggleFavorite(propertyId) {
    return await this.request('/favorites/', {
      method: 'POST',
      body: JSON.stringify({ property: propertyId })
    });
  }

  // Reviews API
  async createReview(data) {
    return await this.request('/reviews/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Complaints API
  async createComplaint(data) {
    return await this.request('/complaints/', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Admin Stats API
  async getAdminStats() {
    return await this.request('/admin/stats/');
  }
}

export const api = new StayNestAPI();