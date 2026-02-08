import { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import { gigService } from '../services/gig.service';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const FreelancerDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else {
      fetchGigs();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getFreelancerOrders();
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const data = await gigService.getMyGigs();
      setGigs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await orderService.updateOrderStatus(orderId, newStatus);
      await fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const renderOrders = () => {
    if (loading) return <Loader />;

    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No orders received yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{order.gig?.title}</h3>
                <p className="text-gray-600">Order from: {order.client?.name}</p>
                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium">{order.client?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-500">{order.client?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Price</p>
                <p className="font-medium text-lg text-primary-600">${order.gig?.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Order Details</h4>
                {order.status !== 'completed' && order.status !== 'cancelled' && (
                  <div className="space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      disabled={updatingOrder === order._id}
                      className="px-3 py-1 border rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {updatingOrder === order._id && (
                      <span className="text-sm text-gray-500">Updating...</span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-gray-700 mt-2">{order.gig?.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderGigs = () => {
    if (loading) return <Loader />;

    if (gigs.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No gigs created yet.</p>
          <a href="/create-gig" className="btn-primary mt-4 inline-block">
            Create Your First Gig
          </a>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div key={gig._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{gig.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3">{gig.description}</p>
            
            <div className="flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-primary-600">${gig.price}</span>
                <span className="text-gray-500 ml-2">one-time</span>
              </div>
              <div className="text-sm text-gray-500">
                {gig.orders?.length || 0} orders
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Freelancer Dashboard</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {orders.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('gigs')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'gigs'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Gigs
            <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
              {gigs.length}
            </span>
          </button>
        </nav>
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={activeTab === 'orders' ? fetchOrders : fetchGigs} />
      )}

      {activeTab === 'orders' ? renderOrders() : renderGigs()}
    </div>
  );
};

export default FreelancerDashboard;