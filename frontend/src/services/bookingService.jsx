import api from './api';

const bookingService = {
  create: async (data) => {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  getByStudent: async () => {
    const res = await api.get('/bookings/student');
    return res.data;
  },

  getByArtisan: async () => {
    const res = await api.get('/bookings/artisan');
    return res.data;
  },

  updateStatus: async (bookingId, status) => {
    const res = await api.put(`/bookings/artisan/${bookingId}`, { status });
    return res.data;
  }
};

export default bookingService;
