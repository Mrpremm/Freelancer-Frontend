import { Link } from 'react-router-dom'
import { Star, Clock, User } from 'lucide-react'
import RatingStars from '../common/RatingStars'

const GigCard = ({ gig }) => {
  return (
    <Link to={`/gig/${gig._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Gig Image */}
        <div className="h-48 bg-gray-200 relative">
          {gig.images && gig.images.length > 0 ? (
            <img
              src={gig.images[0]}
              alt={gig.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Gig Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              {gig.freelancer?.profilePicture ? (
                <img
                  src={gig.freelancer.profilePicture}
                  alt={gig.freelancer.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={16} className="text-gray-500" />
                </div>
              )}
              <span className="text-sm text-gray-600">{gig.freelancer?.name}</span>
            </div>
            <RatingStars rating={gig.rating} />
          </div>

          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {gig.title}
          </h3>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock size={16} />
                <span className="text-sm">{gig.deliveryTime} days</span>
              </div>
              <div className="flex items-center space-x-1 text-gray-600">
                <Star size={16} className="text-yellow-400" />
                <span className="text-sm">{gig.rating.toFixed(1)}</span>
                <span className="text-sm text-gray-400">({gig.totalReviews})</span>
              </div>
            </div>
            <div className="text-lg font-bold text-primary-600">
              ${gig.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default GigCard