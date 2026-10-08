import api from './api.js';

export const opportunityService = {
  /**
   * Discover live job and internship opportunities via Vertex AI query generation & Context.dev web search
   */
  async searchOpportunities(payload = {}) {
    const response = await api.post('/opportunities/search', payload);
    return response.data;
  }
};

export default opportunityService;
