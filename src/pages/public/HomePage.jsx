import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Briefcase, CheckCircle } from 'lucide-react'
import GigList from '../../components/gigs/GigList'
import { useAuth } from '../../hooks/useAuth'

const HomePage = () => {
  const { user, isClient, isFreelancer } = useAuth()

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Find the perfect freelance services for your business
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join millions of people using FreelanceHub to turn ideas into reality.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Link to="/register?role=client" className="btn-primary px-8 py-3">
                Hire a Freelancer
              </Link>
              <Link to="/register?role=freelancer" className="btn-outline px-8 py-3">
                Become a Freelancer
              </Link>
            </>
          ) : isClient ? (
            <Link to="/marketplace" className="btn-primary px-8 py-3">
              Browse Services
            </Link>
          ) : (
            <Link to="/freelancer/create-gig" className="btn-primary px-8 py-3">
              Create a Gig
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose FreelanceHub?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="text-primary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Work</h3>
            <p className="text-gray-600">
              Find professionals with verified skills and proven track records.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-secondary-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
            <p className="text-gray-600">
              Pay safely and only release funds when you're satisfied.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our support team is always here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Gigs Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Popular Services</h2>
          <Link to="/marketplace" className="flex items-center text-primary-600 hover:underline">
            View all <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
        <GigList
          filters={{
            sort: '-rating',
            limit: 6
          }}
        />
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white rounded-2xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of satisfied clients and freelancers who trust FreelanceHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {!user ? (
            <>
              <Link to="/register?role=client" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium">
                Join as Client
              </Link>
              <Link to="/register?role=freelancer" className="bg-transparent border-2 border-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium">
                Join as Freelancer
              </Link>
            </>
          ) : (
            <Link
              to={isClient ? '/client/dashboard' : '/freelancer/dashboard'}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
