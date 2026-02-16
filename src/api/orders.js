import axiosClient from './axiosClient'

export const ordersApi = {
  create: (data) => axiosClient.post('/orders', data),
  getClientOrders: (params) => axiosClient.get('/orders/client', { params }),
  getFreelancerOrders: (params) => axiosClient.get('/orders/freelancer', { params }),
  getById: (id) => axiosClient.get(`/orders/${id}`),
  updateStatus: (id, status) => axiosClient.put(`/orders/${id}/status`, { status }),
  acceptOrder: async (id) => {
    return axiosClient.put(`/orders/${id}/accept`)
  },
  
  cancelOrder: async (id) => {
    return axiosClient.put(`/orders/${id}/cancel`)
  },
}