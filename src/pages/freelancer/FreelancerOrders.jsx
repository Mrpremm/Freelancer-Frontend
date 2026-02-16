import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../../api/orders'
import { useToast } from '../../hooks/useToast'
import OrderCard from '../../components/orders/OrderCard'
import { Filter, Search, CheckCircle, Clock } from 'lucide-react'

const FreelancerOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  })
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchOrders()
  }, [filters])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getFreelancerOrders(filters)
      setOrders(response.orders || [])
    } catch (error) {
      showError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersApi.updateStatus(orderId, status)
      showSuccess(`Order marked as ${status}`)
      fetchOrders()
    } catch (error) {
      showError('Failed to update order status')
    }
  }

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Approved', label: 'Approved' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Delivered', label: 'Delivered' },
    { value: 'Completed', label: 'Completed' }
  ]

  const getStatusActions = (order) => {
    switch (order.status) {
      case 'Pending':
        return (
          <button
            onClick={() => updateOrderStatus(order._id, 'Approved')}
            className="btn-primary text-sm"
          >
            Accept Order
          </button>
        )
      case 'Approved':
        return (
          <span className="text-sm text-gray-500 italic">Waiting for client payment</span>
        )
      case 'In Progress':
        return (
          <button
            onClick={() => updateOrderStatus(order._id, 'Delivered')}
            className="btn-secondary text-sm"
          >
            Mark as Delivered
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders</h1>
        <p className="text-gray-600">Manage incoming orders and track your work</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="input-field"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-gray-600">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500">
            {filters.status ? 'Try changing your filter' : 'You don\'t have any orders yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <Link to={`/order/${order._id}`} className="block">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{order.gig?.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      <span className="mr-4">Client: {order.client?.name}</span>
                      <span>Amount: ${order.amount}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <p className="text-gray-700 mb-2">
                        <strong>Requirements:</strong> {order.requirements}
                      </p>
                      <p className="text-sm text-gray-500">
                        Ordered: {new Date(order.createdAt).toLocaleDateString()} |
                        Delivery Due: {new Date(order.deliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      {getStatusActions(order)}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FreelancerOrders