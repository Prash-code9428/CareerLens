import api from './api.js';

export const opportunityService = {
  /**
   * Discover live job and internship opportunities via Vertex AI query generation & Context.dev web search
   */
  async searchOpportunities(payload = {}) {
    const isEvent = payload && (payload.nativeEvent || payload.target || payload._reactName || typeof payload.preventDefault === 'function');
    const safePayload = (payload && typeof payload === 'object' && !isEvent) ? payload : {};
    const response = await api.post('/opportunities/search', safePayload);
    return response.data;
  },

  /**
   * Match & rank opportunities using Google Cloud Vertex AI
   */
  async matchOpportunities(payload = {}) {
    const response = await api.post('/opportunities/match', payload);
    return response.data;
  }
};

export default opportunityService;
