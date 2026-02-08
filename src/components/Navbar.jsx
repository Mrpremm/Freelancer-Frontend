import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              FreelanceHub
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-primary-600">
              Browse Gigs
            </Link>
            
            {isAuthenticated && user?.role === 'freelancer' && (
              <>
                <Link to="/create-gig" className="text-gray-700 hover:text-primary-600">
                  Create Gig
                </Link>
                <Link to="/freelancer/dashboard" className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'client' && (
              <Link to="/client/dashboard" className="text-gray-700 hover:text-primary-600">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Hi, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;