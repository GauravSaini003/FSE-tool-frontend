import api from './axios';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (credentials) => api.post('/auth/login', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (payload) => api.post('/auth/reset-password', payload),
  getMe: () => api.get('/auth/me'),
};
