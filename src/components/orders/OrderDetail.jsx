import { Calendar, DollarSign, Package, MessageSquare, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '../../utils/helpers'
import OrderStatus from './OrderStatus'

const OrderDetail = ({ order, isClient, onStatusUpdate }) => {
  if (!order) return null

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8 border-b">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>
          <OrderStatus status={order.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-gray-500 mb-4">Order Details</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium">{order.gig?.title}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-5 h-5 text-gray-400 mr-3" />
                <span className="font-medium">${order.amount}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                <span>Ordered: {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <span>Delivery: {formatDate(order.deliveryDate)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500 mb-4">
              {isClient ? 'Freelancer' : 'Client'}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">
                  {(isClient ? order.freelancer?.name : order.client?.name)?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  {isClient ? order.freelancer?.name : order.client?.name}
                </p>
                <button className="text-primary-600 hover:text-primary-700 text-sm flex items-center mt-1">
                  <MessageSquare size={16} className="mr-1" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <h3 className="text-xl font-bold mb-4">Requirements</h3>
        <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
          {order.requirements || 'No specific requirements provided.'}
        </div>
      </div>

      {!isClient && order.status === 'In Progress' && (
        <div className="p-8 border-t bg-gray-50">
          <button
            onClick={() => onStatusUpdate('Delivered')}
            className="btn-primary w-full md:w-auto"
          >
            Mark as Delivered
          </button>
        </div>
      )}

      {isClient && order.status === 'Delivered' && (
        <div className="p-8 border-t bg-gray-50 flex gap-4">
          <button
            onClick={() => onStatusUpdate('Completed')}
            className="btn-primary flex-1"
          >
            Approve & Complete
          </button>
          <button
            className="btn-outline flex-1"
          >
            Request Revision
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderDetail
