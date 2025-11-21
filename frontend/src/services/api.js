import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/password', data),
  getBookings: () => API.get('/users/bookings')
};

export const propertyAPI = {
  getAll: (params) => API.get('/properties', { params }),
  getById: (id) => API.get(`/properties/${id}`),
  create: (data) => API.post('/properties', data),
  update: (id, data) => API.put(`/properties/${id}`, data),
  delete: (id) => API.delete(`/properties/${id}`),
  getByHost: (hostId) => API.get(`/properties/host/${hostId}`)
};

export const bookingAPI = {
  getUserBookings: () => API.get('/bookings/user'),
  getPropertyBookings: (propertyId) => API.get(`/bookings/property/${propertyId}`),
  getById: (id) => API.get(`/bookings/${id}`),
  create: (data) => API.post('/bookings', data),
  cancel: (id) => API.put(`/bookings/${id}/cancel`),
  updateStatus: (id, status) => API.put(`/bookings/${id}/status`, { status })
};

export const paymentAPI = {
  createOrder: (bookingId) => API.post('/payments/create-order', { bookingId }),
  verifyPayment: (data) => API.post('/payments/verify-payment', data)
};

export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  getUserDetails: (id) => API.get(`/admin/users/${id}`),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
  updateUserRole: (id, role) => API.put(`/admin/users/${id}/role`, { role }),
  getProperties: () => API.get('/admin/properties'),
  getPropertyDetails: (id) => API.get(`/admin/properties/${id}`),
  deleteProperty: (id) => API.delete(`/admin/properties/${id}`),
  getBookings: () => API.get('/admin/bookings'),
  getBookingDetails: (id) => API.get(`/admin/bookings/${id}`),
  deleteBooking: (id) => API.delete(`/admin/bookings/${id}`),
  getRevenueStats: () => API.get('/admin/stats/revenue')
};

export default API;
