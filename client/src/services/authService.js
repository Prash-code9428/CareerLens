import api from './api.js';

export const authService = {
  /**
   * Register a new student user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Log in user with email and password
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Log out user
   */
  logout() {
    localStorage.removeItem('careerlens_token');
  }
};

export default authService;
