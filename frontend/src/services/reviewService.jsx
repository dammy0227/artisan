import api from './api';

const reviewService = {
  create: async (data) => {
    const res = await api.post('/reviews', data);
    return res.data;
  },

  getForArtisan: async (artisanId) => {
    const res = await api.get(`/reviews/${artisanId}`);
    return res.data;
  },

 
  getForStudent: async () => {
    const res = await api.get('/reviews/student/me');
    return res.data;
  },


 getForLoggedArtisan: async () => {
    const token = localStorage.getItem('artisanToken');
    const res = await api.get('/reviews/artisan/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};


export default reviewService;
