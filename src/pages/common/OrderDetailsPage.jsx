import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ordersApi } from '../../api/orders';
import { reviewsApi } from '../../api/reviews';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import ChatBox from '../../components/chat/ChatBox';
import Loader from '../../components/common/LoadingSpinner';
import ReviewForm from '../../components/reviews/ReviewForm';
import { Package, Clock, DollarSign, CheckCircle, Star } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showError, showSuccess } = useToast();
  const [order, setOrder] = useState(null);
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  useEffect(() => {
    if (order && order.status === 'Completed') {
      fetchReview();
    }
  }, [order]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await ordersApi.getById(id);
      setOrder(data.order);
    } catch (error) {
      showError(error.message || 'Failed to load order details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchReview = async () => {
    try {
      const data = await reviewsApi.getByOrderId(id);
      if (data.success) {
        setReview(data.review);
      }
    } catch (error) {
      // Ignore 404 for review not found
      if (error.response?.status !== 404) {
        console.error('Failed to fetch review:', error);
      }
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (newStatus === 'Completed') {
        await ordersApi.acceptOrder(id);
      } else {
        await ordersApi.updateStatus(id, newStatus);
      }
      showSuccess(`Order status updated to ${newStatus}`);
      fetchOrderDetails();
    } catch (error) {
      showError(error.message || 'Failed to update status');
    }
  };

  const handleReviewSubmit = async (data) => {
    try {
      await reviewsApi.create({
        orderId: id,
        rating: data.rating,
        comment: data.comment,
      });
      showSuccess('Review submitted successfully');
      setShowReviewForm(false);
      fetchReview();
    } catch (error) {
      showError(error.message || 'Failed to submit review');
    }
  };

  if (loading) return <Loader />;

  if (!order) return null;

  const isClient = user._id === order.client._id;
  const otherUser = isClient ? order.freelancer : order.client;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold">Order Details #{order._id.slice(-6)}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : order.status === 'In Progress'
                    ? 'bg-blue-100 text-blue-800'
                    : order.status === 'Cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={order.gig.images[0]}
                alt={order.gig.title}
                className="w-20 h-20 object-cover rounded-md"
              />
              <div>
                <h2 className="font-semibold text-lg">{order.gig.title}</h2>
                <p className="text-gray-600 line-clamp-2">{order.gig.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Amount</p>
                <p className="font-semibold flex items-center">
                  <DollarSign size={16} className="mr-1" />
                  {order.amount}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Delivery Date</p>
                <p className="font-semibold flex items-center">
                  <Clock size={16} className="mr-1" />
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Created</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm">Requirements</p>
                <p className="font-semibold truncate" title={order.requirements}>
                  {order.requirements || 'None'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-4 flex justify-end gap-3 flex-wrap">
              {/* Cancel Button - Available to both if not completed/cancelled */}
              {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                      ordersApi.cancelOrder(id).then(() => {
                        showSuccess('Order cancelled successfully');
                        fetchOrderDetails();
                      }).catch(err => showError(err.message));
                    }
                  }}
                  className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200"
                >
                  Cancel Order
                </button>
              )}

              {!isClient && order.status === 'Pending' && (
                <button
                  onClick={() => handleStatusUpdate('In Progress')}
                  className="btn-primary"
                >
                  Accept & Start
                </button>
              )}
              {!isClient && order.status === 'In Progress' && (
                <button
                  onClick={() => handleStatusUpdate('Delivered')}
                  className="btn-primary"
                >
                  Mark as Delivered
                </button>
              )}
              {isClient && order.status === 'Delivered' && (
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Accept Delivery
                </button>
              )}
            </div>
          </div>

          {/* Review Section */}
          {order.status === 'Completed' && (
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-xl font-bold mb-4">Review</h3>
              {review ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                          className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{review.rating}.0</span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{review.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Posted on {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ) : isClient ? (
                !showReviewForm ? (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="btn-primary"
                  >
                    Leave a Review
                  </button>
                ) : (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <ReviewForm onSubmit={handleReviewSubmit} />
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )
              ) : (
                <p className="text-gray-500 italic">Client has not left a review yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Chat Column */}
        <div className="lg:col-span-1">
          <ChatBox
            orderId={id}
            receiverName={otherUser.name}
            receiverId={otherUser._id}
            orderStatus={order.status}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
