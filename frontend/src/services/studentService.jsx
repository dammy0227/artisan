import api from './api';

const studentService = {

  register: async (data) => {
    const res = await api.post('/student/register', data);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/student/login', credentials);
    return res.data;
  },

  update: async (data) => {
    const res = await api.put('/student/update', data);
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/student/${id}`);
    return res.data;
  },


  getArtisans: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await api.get(`/student/artisans?${params}`);
    return res.data;
  },

  getArtisanById: async (id) => {
    const res = await api.get(`/student/artisans/${id}`);
    return res.data;
  },

  
  getPreviousWorksByArtisan: async (artisanId) => {
    const res = await api.get(`/student/artisans/${artisanId}/previous-works`);
    return res.data;
  },

  getPreviousWorkById: async (workId) => {
    const res = await api.get(`/student/artisans/previous-works/${workId}`);
    return res.data;
  },
};

export default studentService;
