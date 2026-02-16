import { Link } from 'react-router-dom'
import { Calendar, DollarSign, Package, User } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const OrderCard = ({ order }) => {
  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-purple-100 text-purple-800',
      'Completed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Link to={`/order/${order._id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{order.gig?.title}</h3>
            <div className="flex items-center space-x-4 text-gray-600 text-sm">
              <div className="flex items-center">
                <DollarSign size={16} className="mr-1" />
                <span>${order.amount}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-1" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <div className="flex items-center space-x-2">
            {order.freelancer?.profilePicture ? (
              <img
                src={order.freelancer.profilePicture}
                alt={order.freelancer.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
            )}
            <span className="text-sm text-gray-600">{order.freelancer?.name}</span>
          </div>
          <div className="text-sm text-gray-500">
            Delivery: {formatDate(order.deliveryDate)}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default OrderCard