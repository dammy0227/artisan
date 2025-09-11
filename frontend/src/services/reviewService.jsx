import api from './api';

const reviewService = {
  // Create a review (Student only)
  create: async (data) => {
    const res = await api.post('/reviews', data);
    return res.data;
  },

  // Get reviews for a specific artisan (public)
  getForArtisan: async (artisanId) => {
    const res = await api.get(`/reviews/${artisanId}`);
    return res.data;
  },

  // Get reviews for logged-in student
  getForStudent: async () => {
    const res = await api.get('/reviews/student/me');
    return res.data;
  },

  // Get reviews for logged-in artisan
 getForLoggedArtisan: async () => {
    const token = localStorage.getItem('artisanToken');
    const res = await api.get('/reviews/artisan/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};


export default reviewService;
