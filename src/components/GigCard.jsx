import { Link } from 'react-router-dom';

const GigCard = ({ gig }) => {
  const averageRating = gig.reviews?.length 
    ? (gig.reviews.reduce((sum, review) => sum + review.rating, 0) / gig.reviews.length).toFixed(1)
    : 'No reviews';

  return (
    <Link to={`/gig/${gig._id}`} className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200">
          {gig.images && gig.images.length > 0 ? (
            <img 
              src={gig.images[0]} 
              alt={gig.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
              {gig.createdBy?.name?.charAt(0) || 'U'}
            </div>
            <span className="ml-2 text-sm text-gray-600">{gig.createdBy?.name || 'Unknown'}</span>
          </div>
          
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{gig.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="ml-1 text-sm">{averageRating}</span>
              <span className="mx-2 text-gray-300">•</span>
              <span className="text-sm text-gray-500">({gig.reviews?.length || 0})</span>
            </div>
            <div className="text-lg font-bold text-primary-600">
              ${gig.price}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigCard;