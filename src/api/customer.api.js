import api from './axios';

export const customerApi = {
  getCustomers: (params) => api.get('/customers', { params }),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.patch(`/customers/${id}`, data),
  getCustomerOrders: (id) => api.get(`/customers/${id}/orders`),
};