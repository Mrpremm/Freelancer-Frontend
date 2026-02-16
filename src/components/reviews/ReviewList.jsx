import ReviewCard from './ReviewCard'

const ReviewList = ({ reviews, onDelete, showDelete = false }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => (
        <ReviewCard
          key={review._id}
          review={review}
          onDelete={onDelete}
          showDelete={showDelete}
        />
      ))}
    </div>
  )
}

export default ReviewList