import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gigService } from '../services/gig.service';
import { orderService } from '../services/order.service';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const GigDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isClient } = useAuth();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);
      const data = await gigService.getGigById(id);
      setGig(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gig details');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isClient) {
      setError('Only clients can place orders');
      return;
    }

    try {
      setOrderLoading(true);
      await orderService.createOrder({ gig: id });
      navigate('/client/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrderLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <ErrorMessage message={error} onRetry={fetchGigDetails} />
    </div>
  );

  if (!gig) return null;

  const averageRating = gig.reviews?.length 
    ? (gig.reviews.reduce((sum, review) => sum + review.rating, 0) / gig.reviews.length).toFixed(1)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>
          
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-semibold">
              {gig.createdBy?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-4">
              <h3 className="font-semibold">{gig.createdBy?.name || 'Unknown'}</h3>
              <div className="flex items-center">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{averageRating}</span>
                <span className="mx-2 text-gray-300">•</span>
                <span>{gig.reviews?.length || 0} reviews</span>
              </div>
            </div>
          </div>

          {/* Gig Images */}
          <div className="mb-8">
            {gig.images && gig.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {gig.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${gig.title} ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                No images available
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Gig</h2>
            <p className="text-gray-700 whitespace-pre-line">{gig.description}</p>
          </div>

          {/* Reviews */}
          {gig.reviews && gig.reviews.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews ({gig.reviews.length})</h2>
              <div className="space-y-6">
                {gig.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                        {review.client?.name?.charAt(0) || 'C'}
                      </div>
                      <div className="ml-3">
                        <h4 className="font-semibold">{review.client?.name || 'Client'}</h4>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">${gig.price}</span>
                <span className="text-gray-600 ml-2">one-time payment</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>High quality work</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>On-time delivery</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Unlimited revisions</span>
                </div>
              </div>

              {user?.role === 'client' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={orderLoading}
                  className="w-full btn-primary py-3 text-lg"
                >
                  {orderLoading ? 'Processing...' : 'Continue ($' + gig.price + ')'}
                </button>
              )}

              {user?.role === 'freelancer' && user?._id === gig.createdBy?._id && (
                <button
                  onClick={() => navigate(`/edit-gig/${gig._id}`)}
                  className="w-full btn-secondary py-3 text-lg"
                >
                  Edit Gig
                </button>
              )}

              {!user && (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn-primary py-3 text-lg"
                >
                  Login to Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetails;