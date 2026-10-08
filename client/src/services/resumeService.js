import api from './api.js';

export const resumeService = {
  /**
   * Upload or replace resume PDF
   * @param {File} file - PDF file object
   * @param {Function} [onProgress] - Optional upload progress callback (0 - 100)
   */
  async uploadResume(file, onProgress) {
    const formData = new FormData();
    formData.append('resume', file);

    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      }
    });

    return response.data;
  },

  /**
   * Fetch current resume status
   */
  async getResumeStatus() {
    const response = await api.get('/resume/status');
    return response.data;
  }
};

export default resumeService;
