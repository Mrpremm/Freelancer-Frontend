import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

const PaymentCancel = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
        <XCircle className="text-red-600" size={40} />
      </div>
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        You have cancelled the payment process. No charges were made.
      </p>
      <button
        onClick={() => navigate('/marketplace')}
        className="btn-outline flex items-center"
      >
        <ArrowLeft size={20} className="mr-2" />
        Return to Marketplace
      </button>
    </div>
  )
}

export default PaymentCancel
