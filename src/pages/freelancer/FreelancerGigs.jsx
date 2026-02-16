import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gigsApi } from '../../api/gigs'
import { useToast } from '../../hooks/useToast'
import GigCard from '../../components/gigs/GigCard'
import { Plus, Filter, Edit, Trash2 } from 'lucide-react'

const FreelancerGigs = () => {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const { showSuccess, showError } = useToast()

  useEffect(() => {
    fetchGigs()
  }, [])

  const fetchGigs = async () => {
    try {
      setLoading(true)
      const response = await gigsApi.getMyGigs()
      setGigs(response.gigs || [])
    } catch (error) {
      showError('Failed to load gigs')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (gigId) => {
    if (!window.confirm('Are you sure you want to delete this gig?')) return
    
    try {
      await gigsApi.delete(gigId)
      showSuccess('Gig deleted successfully')
      fetchGigs()
    } catch (error) {
      showError('Failed to delete gig')
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Gigs</h1>
          <p className="text-gray-600">Manage your services and track performance</p>
        </div>
        <Link to="/freelancer/create-gig" className="btn-primary flex items-center">
          <Plus size={20} className="mr-2" />
          Create New Gig
        </Link>
      </div>

      {gigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter size={32} className="text-primary-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs yet</h3>
          <p className="text-gray-500 mb-6">Create your first service to start earning</p>
          <Link to="/freelancer/create-gig" className="btn-primary">
            Create Your First Gig
          </Link>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">{gigs.length}</div>
              <div className="text-gray-600">Total Gigs</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {gigs.filter(g => g.isActive).length}
              </div>
              <div className="text-gray-600">Active</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {gigs.reduce((sum, gig) => sum + gig.totalReviews, 0)}
              </div>
              <div className="text-gray-600">Total Reviews</div>
            </div>
          </div>

          {/* Gigs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map(gig => (
              <div key={gig._id} className="relative group">
                <GigCard gig={gig} />
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    to={`/gig/${gig._id}/edit`}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <Edit size={16} className="text-gray-600" />
                  </Link>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default FreelancerGigs