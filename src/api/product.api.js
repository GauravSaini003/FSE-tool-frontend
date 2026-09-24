import api from './axios';

export const productApi = {
  getProducts: () => api.get('/products'),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.patch(`/products/${id}`, data),
};