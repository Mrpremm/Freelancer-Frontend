import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  Star,
  Clock,
  User,
  DollarSign,
  ShoppingCart,
  ArrowLeft,
  Package,
  Shield,
  MessageSquare
} from 'lucide-react'
import { gigsApi } from '../../api/gigs'
import { ordersApi } from '../../api/orders'
import { reviewsApi } from '../../api/reviews'
import { useAuth } from '../../hooks/useAuth'
import axiosClient from '../../api/axiosClient'
import { useToast } from '../../hooks/useToast'
import RatingStars from '../../components/common/RatingStars'
import ReviewList from '../../components/reviews/ReviewList'
import CreateOrderForm from '../../components/orders/CreateOrderForm'

const GigDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isClient } = useAuth()
  const { showSuccess, showError } = useToast()

  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [loadingPayment, setLoadingPayment] = useState(false)

  useEffect(() => {
    fetchGigDetails()
    fetchReviews()
  }, [id])

  const fetchGigDetails = async () => {
    try {
      setLoading(true)
      const data = await gigsApi.getById(id)
      setGig(data.gig)
    } catch (error) {
      showError('Failed to load gig details')
      navigate('/marketplace')
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      const response = await reviewsApi.getGigReviews(id)
      setReviews(response.reviews || [])
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setReviewsLoading(false)
    }
  }

  const handleOrderSubmit = async (data) => {
    try {
      // data might be { requirements: '...' } or just '...'
      const requirements = typeof data === 'object' ? data.requirements : data

      await ordersApi.create({
        gigId: id,
        requirements
      })
      showSuccess('Order placed successfully!')
      setShowOrderForm(false)
      navigate('/client/orders')
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order';

      if (errorMessage.includes('active order')) {
        showError('You already have an active order for this gig. Redirecting to your orders...');
        setTimeout(() => navigate('/client/orders'), 2000);
        return;
      }

      showError(errorMessage);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!gig) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-600 mb-4">Gig not found</h2>
        <Link to="/marketplace" className="btn-primary">
          Browse Services
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link to="/marketplace" className="inline-flex items-center text-primary-600 hover:underline">
        <ArrowLeft size={20} className="mr-2" />
        Back to Marketplace
      </Link>

      {/* Gig Header */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Gig Images */}
          <div className="md:w-1/2">
            <div className="h-64 md:h-96 bg-gray-100">
              {gig.images && gig.images.length > 0 ? (
                <img
                  src={gig.images[0]}
                  alt={gig.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={64} className="text-gray-400" />
                </div>
              )}
            </div>
            {gig.images && gig.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {gig.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-200 rounded overflow-hidden">
                    <img src={image} alt={`Gig ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Gig Info */}
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4">{gig.title}</h1>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center">
                {gig.freelancer?.profilePicture ? (
                  <img
                    src={gig.freelancer.profilePicture}
                    alt={gig.freelancer.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <User size={20} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{gig.freelancer?.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <RatingStars rating={gig.freelancer?.rating || 0} size={14} />
                    <span className="ml-2">({gig.freelancer?.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
            </div>



            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="text-yellow-400" size={20} />
                  <span className="font-semibold">{gig.rating.toFixed(1)}</span>
                  <span className="text-gray-600">({gig.totalReviews} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="text-gray-400" size={20} />
                  <span>{gig.deliveryTime} day delivery</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary-600">
                ${gig.price}
              </div>
            </div>

            {/* Action Buttons */}
            {isClient ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowOrderForm(true)}
                  className="btn-primary w-full flex items-center justify-center py-4 text-lg"
                >
                  <ShoppingCart className="mr-3" size={24} />
                  Book Order ($ {gig.price})
                </button>

                <Link
                  to={`/freelancer/${gig.freelancer?._id}`}
                  className="w-full flex items-center justify-center py-3 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
                >
                  <User className="mr-2" size={20} />
                  View Freelancer Profile
                </Link>
              </div>
            ) : user ? (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800">
                  This service is for clients only. Switch to a client account to order.
                </p>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary w-full flex items-center justify-center py-4 text-lg"
              >
                Login to Order
              </Link>
            )}

            {/* Trust Badges */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Shield className="text-green-500" size={24} />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-sm text-gray-600">Payment protection</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="text-blue-500" size={24} />
                  <div>
                    <p className="font-medium">Quality Guarantee</p>
                    <p className="text-sm text-gray-600">Satisfaction guaranteed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >

      {/* Description & Details */}
      < div className="grid grid-cols-1 lg:grid-cols-3 gap-8" >
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">About This Service</h2>
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{gig.description}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Reviews ({gig.totalReviews})</h2>
            {reviewsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : reviews.length > 0 ? (
              <ReviewList reviews={reviews} />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No reviews yet</p>
                <p className="text-sm">Be the first to review this service</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Freelancer Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-bold text-lg mb-4">About The Freelancer</h3>
            <div className="flex items-center space-x-4 mb-4">
              {gig.freelancer?.profilePicture ? (
                <img
                  src={gig.freelancer.profilePicture}
                  alt={gig.freelancer.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={32} className="text-gray-500" />
                </div>
              )}
              <div>
                <h4 className="font-semibold">{gig.freelancer?.name}</h4>
                <RatingStars rating={gig.freelancer?.rating || 0} />
              </div>
            </div>
            {gig.freelancer?.bio && (
              <p className="text-gray-600 mb-4">{gig.freelancer.bio}</p>
            )}
            <Link
              to={`/freelancer/${gig.freelancer?._id}`}
              className="btn-outline w-full"
            >
              View Profile
            </Link>
          </div>

          {/* What's Included */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">What's Included</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>High-quality delivery</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>{gig.revisions || 1} revision{gig.revisions !== 1 ? 's' : ''}</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>{gig.deliveryTime} day delivery</span>
              </li>
              <li className="flex items-center">
                <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">
                  ✓
                </div>
                <span>24/7 support</span>
              </li>
            </ul>
          </div>
        </div>
      </div >

      {/* Order Modal */}
      {
        showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Place Order</h2>
                  <button
                    onClick={() => setShowOrderForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <CreateOrderForm
                  gig={gig}
                  onSubmit={handleOrderSubmit}
                  onCancel={() => setShowOrderForm(false)}
                />
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}

export default GigDetailPage