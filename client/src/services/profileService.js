import api from './api.js';

export const profileService = {
  /**
   * Fetch authenticated candidate profile
   */
  async getProfile() {
    const response = await api.get('/profile');
    return response.data;
  },

  /**
   * Update candidate profile details
   */
  async updateProfile(profileData) {
    const response = await api.put('/profile', profileData);
    return response.data;
  }
};

export default profileService;
