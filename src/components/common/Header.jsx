import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Menu, X, User, Briefcase, LogOut, Bell } from 'lucide-react'
import { useState } from 'react'

const Header = () => {
  const { user, logout, isClient, isFreelancer } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { name: 'Marketplace', path: '/marketplace', public: true },
    { name: 'Dashboard', path: user?.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard', private: true },
    { name: 'Orders', path: user?.role === 'client' ? '/client/orders' : '/freelancer/orders', private: true },
    { name: 'My Gigs', path: '/freelancer/gigs', private: true, role: 'freelancer' },
  ]

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary-600">
            FreelanceHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              // Show public items
              if (item.public) {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              }

              // Show private items based on auth and role
              if (user && item.private) {
                // If item has a specific role requirement, check it
                if (item.role && user.role !== item.role) {
                  return null
                }

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )
              }
              return null
            })}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 text-gray-600 hover:text-primary-600">
                  <Bell size={20} />
                </button>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700">
                    <User size={20} />
                    <span>{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block z-10">
                    <Link
                      to={isClient ? '/client/profile' : '/freelancer/profile'}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                if (item.public || (item.private && user) || (item.role && user?.role === item.role)) {
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="text-gray-700 hover:text-primary-600 py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                }
                return null
              })}
              {user ? (
                <>
                  <Link
                    to={isClient ? '/client/profile' : '/freelancer/profile'}
                    className="text-gray-700 hover:text-primary-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-left text-gray-700 hover:text-primary-600 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header