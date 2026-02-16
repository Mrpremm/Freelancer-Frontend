import { User } from 'lucide-react'
import RatingStars from '../common/RatingStars'
import { formatDate } from '../../utils/helpers'

const ReviewCard = ({ review, onDelete, showDelete = false }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          {review.client?.profilePicture ? (
            <img
              src={review.client.profilePicture}
              alt={review.client.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={24} className="text-gray-500" />
            </div>
          )}
          <div>
            <h4 className="font-semibold">{review.client?.name}</h4>
            <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <RatingStars rating={review.rating} />
      </div>
      
      <p className="text-gray-700 mb-4">{review.comment}</p>
      
      {showDelete && onDelete && (
        <div className="border-t pt-4">
          <button
            onClick={() => onDelete(review._id)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete Review
          </button>
        </div>
      )}
    </div>
  )
}

export default ReviewCard