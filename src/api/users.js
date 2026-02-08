import axiosClient from './axiosClient'

export const usersApi = {
  getFreelancers: (params) => axiosClient.get('/users/freelancers', { params }),
  getFreelancerById: (id) => axiosClient.get(`/users/freelancers/${id}`),
}