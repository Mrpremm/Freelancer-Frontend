import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  DollarSign, 
  Briefcase, 
  Star, 
  Clock, 
  TrendingUp,
  Eye,
  MessageSquare,
  Package
} from 'lucide-react'
import { gigsApi } from '../../api/gigs'
import { ordersApi } from '../../api/orders'
import { useToast } from '../../hooks/useToast'

const FreelancerDashboard = () => {
  const [stats, setStats] = useState({
    totalGigs: 0,
    activeOrders: 0,
    totalEarnings: 0,
    avgRating: 0
  })
  const [recentGigs, setRecentGigs] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { showError } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch gigs
      const myGigs = await gigsApi.getMyGigs()
      const gigs = myGigs.gigs || []
      
      // Fetch orders
      const ordersResponse = await ordersApi.getFreelancerOrders({ limit: 5 })
      const orders = ordersResponse.orders || []
      
      // Calculate stats
      const activeOrders = orders.filter(order => 
        ['Pending', 'In Progress', 'Delivered'].includes(order.status)
      ).length
      
      const totalEarnings = orders
        .filter(order => order.status === 'Completed')
        .reduce((sum, order) => sum + order.amount, 0)
      
      const avgRating = gigs.length > 0 
        ? gigs.reduce((sum, gig) => sum + gig.rating, 0) / gigs.length
        : 0

      setStats({
        totalGigs: gigs.length,
        activeOrders,
        totalEarnings,
        avgRating: parseFloat(avgRating.toFixed(1))
      })
      
      setRecentGigs(gigs.slice(0, 3))
      setRecentOrders(orders.slice(0, 5))
    } catch (error) {
      showError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Gigs',
      value: stats.totalGigs,
      icon: <Briefcase className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: <Clock className="text-yellow-500" size={24} />,
      color: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings}`,
      icon: <DollarSign className="text-green-500" size={24} />,
      color: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Average Rating',
      value: stats.avgRating,
      icon: <Star className="text-purple-500" size={24} />,
      color: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <Link to="/freelancer/create-gig" className="btn-primary">
          Create New Gig
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-xl`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.textColor.replace('text-', 'bg-')} bg-opacity-20`}>
                {stat.icon}
              </div>
              <TrendingUp className="text-gray-400" size={20} />
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Gigs */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Gigs</h2>
            <Link to="/freelancer/gigs" className="text-primary-600 hover:underline text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentGigs.length > 0 ? (
              recentGigs.map((gig) => (
                <div key={gig._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {gig.images && gig.images.length > 0 ? (
                        <img src={gig.images[0]} alt={gig.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-full h-full p-2 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{gig.title}</h3>
                      <p className="text-sm text-gray-600">${gig.price}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400" />
                      <span className="font-medium">{gig.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{gig.totalReviews} reviews</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Package className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No gigs created yet</p>
                <Link to="/freelancer/create-gig" className="text-primary-600 hover:underline">
                  Create your first gig
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/freelancer/orders" className="text-primary-600 hover:underline text-sm">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                      order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-600' :
                      order.status === 'Delivered' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">{order.gig?.title}</h3>
                      <p className="text-sm text-gray-600">${order.amount}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'Delivered' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="mx-auto mb-4 text-gray-400" size={48} />
                <p>No orders yet</p>
                <p className="text-sm">When you get orders, they'll appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            to="/freelancer/create-gig" 
            className="p-6 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Briefcase className="mx-auto mb-4 text-primary-600" size={32} />
            <h3 className="font-semibold mb-2">Create New Gig</h3>
            <p className="text-sm text-gray-600">Offer a new service to clients</p>
          </Link>
          
          <Link 
            to="/freelancer/orders" 
            className="p-6 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Package className="mx-auto mb-4 text-primary-600" size={32} />
            <h3 className="font-semibold mb-2">Manage Orders</h3>
            <p className="text-sm text-gray-600">View and update your orders</p>
          </Link>
          
          <Link 
            to="/freelancer/profile" 
            className="p-6 border border-gray-200 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors text-center"
          >
            <Eye className="mx-auto mb-4 text-primary-600" size={32} />
            <h3 className="font-semibold mb-2">View Profile</h3>
            <p className="text-sm text-gray-600">See how clients view your profile</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FreelancerDashboard