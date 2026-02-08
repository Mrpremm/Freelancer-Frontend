import axiosClient from './axiosClient'

export const gigsApi = {
  getAll: (params) => axiosClient.get('/gigs', { params }),
  getById: (id) => axiosClient.get(`/gigs/${id}`),
  create: (data) => {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'images' && Array.isArray(data[key])) {
        data[key].forEach(file => formData.append('images', file))
      } else {
        formData.append(key, data[key])
      }
    })
    return axiosClient.post('/gigs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  update: (id, data) => axiosClient.put(`/gigs/${id}`, data),
  delete: (id) => axiosClient.delete(`/gigs/${id}`),
  getMyGigs: () => axiosClient.get('/gigs/freelancer/me'),
}