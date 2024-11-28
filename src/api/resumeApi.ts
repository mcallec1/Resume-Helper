import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const resumeApi = {
  async processResume(resumeFile: File, jobUrl: string) {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_url', jobUrl);

    try {
      const response = await axios.post(`${API_BASE_URL}/process-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error processing resume:', error);
      throw error;
    }
  }
};