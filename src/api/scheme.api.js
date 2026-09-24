import api from './axios';

export const schemeApi = {
  getSchemes: () => api.get('/schemes'),
  createScheme: (data) => api.post('/schemes', data),
};