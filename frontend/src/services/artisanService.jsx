import api from './api';

const artisanService = {
  // --------------------------
  // Auth & Profile
  // --------------------------
  register: async (formData) => {
    const res = await api.post('/artisan/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post('/artisan/login', credentials);
    return res.data;
  },

  update: async (formData) => {
    const res = await api.put('/artisan/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // --------------------------
  // Previous Works
  // --------------------------
  addPreviousWork: async (formData) => {
    const res = await api.post('/artisan/previous-work', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  getPreviousWorks: async () => {
    const res = await api.get('/artisan/previous-works');
    return res.data;
  },

  getPreviousWorkById: async (workId) => {
    const res = await api.get(`/artisan/previous-works/${workId}`);
    return res.data;
  },

  updatePreviousWork: async (workId, formData) => {
    const res = await api.put(`/artisan/previous-works/${workId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  deletePreviousWork: async (workId) => {
    const res = await api.delete(`/artisan/previous-works/${workId}`);
    return res.data;
  }
};

export default artisanService;
