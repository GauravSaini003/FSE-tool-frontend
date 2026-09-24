import api from './axios';

export const userApi = {
  getUsers: () => api.get('/users'),
  createUser: (userData) => api.post('/users', userData),
  updateStatus: (userId, status) => api.patch(`/users/${userId}/status`, { status }),
};