// API Base URL
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.herokuapp.com/api' 
  : 'http://localhost:5000/api';

// API Client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  // Get authentication headers
  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Make API request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: this.getAuthHeaders(),
      credentials: 'include', // Include cookies
      ...options,
    };

    console.log('🔗 Making API request:', { url, config });

    try {
      const response = await fetch(url, config);
      console.log('📡 Response status:', response.status, response.statusText);
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text);
        throw new Error(`Server returned non-JSON response: ${text}`);
      }

      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API Request failed:', {
        url,
        error: error.message,
        stack: error.stack
      });
      
      // Provide more user-friendly error messages
      if (error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Auth methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    if (response.success && response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async register(userData) {
    return this.post('/auth/register', userData);
  }

  async logout() {
    const response = await this.post('/auth/logout');
    this.setToken(null);
    return response;
  }

  async getProfile() {
    return this.get('/auth/profile');
  }

  // Package methods
  async getPackages(query = '') {
    return this.get(`/packages${query}`);
  }

  async getPackage(id) {
    return this.get(`/packages/${id}`);
  }

  async getFeaturedPackages() {
    return this.get('/packages/featured');
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.post('/bookings', bookingData);
  }

  async getBookings() {
    return this.get('/bookings');
  }

  async getBooking(id) {
    return this.get(`/bookings/${id}`);
  }

  // Tourism data methods
  async getDestinations() {
    return this.get('/destinations');
  }

  async searchTourism(query) {
    return this.get(`/tourism/search?q=${encodeURIComponent(query)}`);
  }
}

// Create global API client instance
const api = new ApiClient();

// Export for use in React components
export default api;

// Also attach to window for global access (optional)
if (typeof window !== 'undefined') {
  window.api = api;
}

// Example usage functions for your existing components
export const authService = {
  login: api.login.bind(api),
  register: api.register.bind(api),
  logout: api.logout.bind(api),
  getProfile: api.getProfile.bind(api),
};

export const packageService = {
  getAll: api.getPackages.bind(api),
  getById: api.getPackage.bind(api),
  getFeatured: api.getFeaturedPackages.bind(api),
};

export const bookingService = {
  create: api.createBooking.bind(api),
  getAll: api.getBookings.bind(api),
  getById: api.getBooking.bind(api),
};