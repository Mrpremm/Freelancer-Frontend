import * as yup from 'yup'

export const gigSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: yup.string().required('Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  price: yup.number().required('Price is required').min(5, 'Price must be at least $5'),
  category: yup.string().required('Category is required'),
  deliveryTime: yup.number().required('Delivery time is required').min(1, 'Delivery time must be at least 1 day'),
})

export const orderSchema = yup.object({
  requirements: yup.string().required('Requirements are required').max(1000, 'Requirements cannot exceed 1000 characters'),
})

export const reviewSchema = yup.object({
  rating: yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  comment: yup.string().required('Comment is required').max(1000, 'Comment cannot exceed 1000 characters'),
})