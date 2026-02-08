import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import GigDetails from './pages/GigDetails';
import CreateGig from './pages/CreateGig';
import ClientDashboard from './pages/ClientDashboard';
import FreelancerDashboard from './pages/FreelancerDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/gig/:id" element={<GigDetails />} />
              
              {/* Protected Routes - Client */}
              <Route path="/client/dashboard" element={
                <ProtectedRoute requiredRole="client">
                  <ClientDashboard />
                </ProtectedRoute>
              } />
              
              {/* Protected Routes - Freelancer */}
              <Route path="/create-gig" element={
                <ProtectedRoute requiredRole="freelancer">
                  <CreateGig />
                </ProtectedRoute>
              } />
              
              <Route path="/freelancer/dashboard" element={
                <ProtectedRoute requiredRole="freelancer">
                  <FreelancerDashboard />
                </ProtectedRoute>
              } />
              
              {/* Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          
          {/* Footer */}
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-lg font-semibold mb-2">FreelanceHub</p>
                <p className="text-gray-400">Connecting clients with talented freelancers worldwide</p>
                <div className="mt-4 text-gray-400 text-sm">
                  <p>© 2024 FreelanceHub. All rights reserved.</p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;