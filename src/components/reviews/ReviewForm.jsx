import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Star, Send, Loader } from 'lucide-react'
import { useState } from 'react'

const schema = yup.object({
  rating: yup.number().min(1, 'Please select a rating').required('Rating is required'),
  comment: yup.string().required('Comment is required').max(1000, 'Comment cannot exceed 1000 characters')
})

const ReviewForm = ({ onSubmit, loading = false }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      comment: ''
    }
  })

  const rating = watch('rating')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you rate this service?
        </label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setValue('rating', star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none"
            >
              <Star
                size={32}
                className={`
                  ${(hoverRating || rating) >= star 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                  }
                  transition-colors duration-200
                `}
              />
            </button>
          ))}
          <span className="ml-4 text-lg font-semibold">
            {rating > 0 ? `${rating}.0` : '0.0'}
          </span>
        </div>
        {errors.rating && (
          <p className="text-red-500 text-sm mt-2">{errors.rating.message}</p>
        )}
        <input type="hidden" {...register('rating')} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          {...register('comment')}
          rows={4}
          className="input-field"
          placeholder="Share your experience with this service..."
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-2">{errors.comment.message}</p>
        )}
        <div className="text-right text-sm text-gray-500 mt-1">
          {watch('comment')?.length || 0}/1000 characters
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center justify-center w-full"
      >
        {loading ? (
          <Loader className="animate-spin mr-2" size={20} />
        ) : (
          <Send className="mr-2" size={20} />
        )}
        Submit Review
      </button>
    </form>
  )
}

export default ReviewForm