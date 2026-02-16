import { Star } from 'lucide-react'

const RatingStars = ({ rating, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  
  return (
    <div className="flex items-center">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`
              ${i < fullStars ? 'text-yellow-400 fill-yellow-400' : 
                (i === fullStars && hasHalfStar ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')}
            `}
          />
        ))}
      </div>
      {showNumber && (
        <span className="ml-2 text-sm font-medium">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

export default RatingStars