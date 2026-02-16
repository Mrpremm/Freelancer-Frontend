import { useState } from 'react'
import GigList from '../../components/gigs/GigList'
import GigFilters from '../../components/gigs/GigFilters'
import { Filter } from 'lucide-react'

const MarketplacePage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: '-createdAt',
    page: 1,
    limit: 12
  })

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 })
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: '-createdAt',
      page: 1,
      limit: 12
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketplace</h1>
          <p className="text-gray-600">Find the perfect service for your needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <GigFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={resetFilters}
          />
        </div>

        {/* Gigs Grid */}
        <div className="lg:col-span-3">
          <GigList 
            filters={filters}
            onPageChange={(page) => setFilters({ ...filters, page })}
          />
        </div>
      </div>
    </div>
  )
}

export default MarketplacePage