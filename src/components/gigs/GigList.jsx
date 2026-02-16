import { useState, useEffect } from 'react'
import GigCard from './GigCard'
import { gigsApi } from '../../api/gigs'
import { useToast } from '../../hooks/useToast'
import Pagination from '../common/Pagination'

const GigList = ({ filters = {} }) => {
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const { showError } = useToast()

  useEffect(() => {
    fetchGigs()
  }, [filters])

  const fetchGigs = async () => {
    try {
      setLoading(true)
      const response = await gigsApi.getAll(filters)
      setGigs(response.gigs || [])
      setPagination({
        page: response.currentPage,
        totalPages: response.totalPages,
        total: response.total
      })
    } catch (error) {
      showError('Failed to load gigs')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    )
  }

  if (gigs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No gigs found</h3>
        <p className="text-gray-500">Try adjusting your filters or search terms</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <GigCard key={gig._id} gig={gig} />
        ))}
      </div>
      
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => {}}
          />
        </div>
      )}
    </div>
  )
}

export default GigList