import api from './api';

const ensureAdminAuth = () => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    throw new Error("Admin not logged in. Please log in as admin.");
  }
};

const adminService = {
  login: async (credentials) => {
    const res = await api.post('/admin/login', credentials);
    return res.data;
  },

  getAnalytics: async () => {
    ensureAdminAuth();
    const res = await api.get('/admin/analytics');
    return res.data;
  },

getAllArtisans: async () => {
  ensureAdminAuth();
  const res = await api.get('/admin/artisans'); 
  return res.data;
},


  approveArtisan: async (artisanId) => {
    ensureAdminAuth();
    const res = await api.put(`/admin/artisan/approve/${artisanId}`);
    return res.data;
  },

  rejectArtisan: async (artisanId) => {
    ensureAdminAuth();
    const res = await api.put(`/admin/artisan/reject/${artisanId}`);
    return res.data;
  },

  getAllStudents: async () => {
    ensureAdminAuth();
    const res = await api.get('/admin/students');
    return res.data;
  },

  deleteStudent: async (studentId) => {
    ensureAdminAuth();
    const res = await api.delete(`/admin/students/${studentId}`);
    return res.data;
  }
};

export default adminService;
