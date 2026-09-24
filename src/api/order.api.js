import api from './axios';

export const orderApi = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrderStatus: (id, payload) => api.patch(`/orders/${id}/status`, payload),
};