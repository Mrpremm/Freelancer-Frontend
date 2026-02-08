import api from './api';

export const gigService = {
  getAllGigs: async (filters = {}) => {
    const response = await api.get('/gigs', { params: filters });
    return response.data;
  },

  getGigById: async (id) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  createGig: async (gigData) => {
    const response = await api.post('/gigs', gigData);
    return response.data;
  },

  updateGig: async (id, gigData) => {
    const response = await api.put(`/gigs/${id}`, gigData);
    return response.data;
  },

  deleteGig: async (id) => {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  },

  getMyGigs: async () => {
    const response = await api.get('/gigs/my-gigs');
    return response.data;
  }
};