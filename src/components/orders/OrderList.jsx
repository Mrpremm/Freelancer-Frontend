import OrderCard from './OrderCard'
import { Package } from 'lucide-react'

const OrderList = ({ orders, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <Package className="mx-auto text-gray-300 mb-4" size={48} />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders found</h3>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </div>
  )
}

export default OrderList
