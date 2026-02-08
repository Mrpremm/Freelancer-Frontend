import { useState, useEffect } from 'react';
import GigCard from '../components/GigCard';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import { gigService } from '../services/gig.service';

const Home = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  const fetchGigs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await gigService.getAllGigs(filters);
      setGigs(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="search"
              placeholder="Search gigs..."
              value={filters.search}
              onChange={handleFilterChange}
              className="input-field flex-grow"
            />
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="input-field md:w-48"
            >
              <option value="">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
              <option value="marketing">Marketing</option>
            </select>
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="input-field md:w-32"
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="input-field md:w-32"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage message={error} onRetry={fetchGigs} />
      )}

      {/* Gigs Grid */}
      {gigs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No gigs found. Try different filters.</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6">Featured Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;