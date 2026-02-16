import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import axiosClient from '../../api/axiosClient'
import { useToast } from '../../hooks/useToast'

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(true)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (!sessionId) {
      navigate('/')
      return
    }

    const confirmPayment = async () => {
      try {
        const response = await axiosClient.post('/payment/confirm-payment', { sessionId })
        if (response.success) {
          showSuccess('Payment confirmed! Order created successfully.')
        }
      } catch (error) {
        console.error(error)
        // If order already exists, it might return success: true but we handle it gracefully usually
        // If real error, show it.
        if (error.response?.data?.message !== 'Order already exists') {
          showError('Failed to confirm payment. Please contact support.')
        }
      } finally {
        setLoading(false)
      }
    }

    confirmPayment()
  }, [sessionId, navigate, showSuccess, showError])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-gray-600">Confirming your payment...</p>
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="text-green-600" size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your payment has been processed and your order has been created. The freelancer will start working properly soon.
      </p>
      <button
        onClick={() => navigate('/client/orders')}
        className="btn-primary flex items-center"
      >
        View My Orders
        <ArrowRight size={20} className="ml-2" />
      </button>
    </div>
  )
}

export default PaymentSuccess
