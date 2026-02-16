import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { gigsApi } from '../../api/gigs'
import { useToast } from '../../hooks/useToast'
import FileUpload from '../../components/common/FileUpload'
import { Save, Loader } from 'lucide-react'

const schema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: yup.string().required('Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  price: yup.number().required('Price is required').min(5, 'Price must be at least $5'),
  category: yup.string().required('Category is required'),
  deliveryTime: yup.number().required('Delivery time is required').min(1, 'Delivery time must be at least 1 day'),
})

const categories = [
  { value: 'graphics-design', label: 'Graphics & Design' },
  { value: 'digital-marketing', label: 'Digital Marketing' },
  { value: 'writing-translation', label: 'Writing & Translation' },
  { value: 'video-animation', label: 'Video & Animation' },
  { value: 'music-audio', label: 'Music & Audio' },
  { value: 'programming-tech', label: 'Programming & Tech' },
  { value: 'business', label: 'Business' },
  { value: 'lifestyle', label: 'Lifestyle' },
]

const CreateGigForm = ({ onSuccess, onCancel }) => {
  const { showSuccess, showError } = useToast()
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data) => {
    if (images.length === 0) {
      showError('Please upload at least one image')
      return
    }

    try {
      setLoading(true)
      const formData = {
        ...data,
        price: parseFloat(data.price),
        deliveryTime: parseInt(data.deliveryTime),
        images
      }

      await gigsApi.create(formData)
      showSuccess('Gig created successfully!')
      if (onSuccess) onSuccess()
    } catch (error) {
      showError(error.message || 'Failed to create gig')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gig Title *
            </label>
            <input
              type="text"
              {...register('title')}
              className="input-field"
              placeholder="What service do you offer?"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="input-field"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-2">{errors.category.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={6}
              className="input-field"
              placeholder="Describe your service in detail. What will the client receive?"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-2">{errors.description.message}</p>
            )}
            <div className="text-sm text-gray-500 mt-2">
              Be specific about what you'll deliver and any requirements
            </div>
          </div>
        </div>
      </div>

      {/* Pricing & Delivery */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Pricing & Delivery</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                {...register('price')}
                className="input-field pl-10"
                placeholder="50"
                step="0.01"
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-2">{errors.price.message}</p>
            )}
            <div className="text-sm text-gray-500 mt-2">
              Minimum price is $5
            </div>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Time (Days) *
            </label>
            <input
              type="number"
              {...register('deliveryTime')}
              className="input-field"
              placeholder="3"
              min="1"
            />
            {errors.deliveryTime && (
              <p className="text-red-500 text-sm mt-2">{errors.deliveryTime.message}</p>
            )}
            <div className="text-sm text-gray-500 mt-2">
              Number of days to complete the work
            </div>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Gallery</h2>
        <p className="text-gray-600 mb-4">
          Upload up to 5 images showcasing your work. The first image will be the cover.
        </p>

        <FileUpload
          files={images}
          onChange={setImages}
          maxFiles={5}
          maxSize={5 * 1024 * 1024} // 5MB
        />

        {images.length === 0 && (
          <p className="text-red-500 text-sm mt-4">
            Please upload at least one image
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-outline px-8"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || images.length === 0}
          className="btn-primary px-8 flex items-center"
        >
          {loading ? (
            <Loader className="animate-spin mr-2" size={20} />
          ) : (
            <Save className="mr-2" size={20} />
          )}
          Create Gig
        </button>
      </div>
    </form>
  )
}

export default CreateGigForm
