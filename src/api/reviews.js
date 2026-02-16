import axiosClient from './axiosClient'

export const reviewsApi = {
  create: (data) => axiosClient.post('/reviews', data),
  getGigReviews: (gigId, params) => axiosClient.get(`/reviews/gig/${gigId}`, { params }),
  getFreelancerReviews: (freelancerId, params) => 
    axiosClient.get(`/reviews/freelancer/${freelancerId}`, { params }),
  delete: (id) => axiosClient.delete(`/reviews/${id}`),
  getByOrderId: (orderId) => axiosClient.get(`/reviews/order/${orderId}`),
}