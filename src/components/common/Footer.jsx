import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className='text-center '>
            <h3 className="text-2xl font-bold mb-4">FreelanceHub</h3>
            <p className="text-gray-400">
              Connecting talented freelancers with clients worldwide.
            </p>
          </div>
{/*           
          <div>
            <h4 className="text-lg font-semibold mb-4">For Freelancers</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Browse Gigs</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Become a Freelancer</Link></li>
              <li><Link to="/freelancer/dashboard" className="text-gray-400 hover:text-white">Freelancer Dashboard</Link></li>
            </ul>
          </div> */}
          
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">For Clients</h4>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Find Talent</Link></li>
              <li><Link to="/register" className="text-gray-400 hover:text-white">Hire Freelancers</Link></li>
              <li><Link to="/client/dashboard" className="text-gray-400 hover:text-white">Client Dashboard</Link></li>
            </ul>
          </div> */}
          
          {/* <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={20} />
              </a>
            </div>
          </div> */}
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} FreelanceHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer