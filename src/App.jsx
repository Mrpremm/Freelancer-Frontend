import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/common/Layout'
import { useAuth } from './hooks/useAuth'
import { Toaster } from 'react-hot-toast'

// Public Pages
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import MarketplacePage from './pages/public/MarketplacePage'
import GigDetailPage from './pages/public/GigDetailPage'
import FreelancerProfilePage from './pages/public/FreelancerProfilePage'
import NotFoundPage from './pages/public/NotFoundPage'

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard'
import ClientOrders from './pages/client/ClientOrders'
import ClientProfile from './pages/client/ClientProfile'
import ClientSettings from './pages/client/ClientSettings'
import PaymentSuccess from './pages/client/PaymentSuccess'
import PaymentCancel from './pages/client/PaymentCancel'

// Freelancer Pages
import FreelancerDashboard from './pages/freelancer/FreelancerDashboard'
import FreelancerGigs from './pages/freelancer/FreelancerGigs'
import FreelancerOrders from './pages/freelancer/FreelancerOrders'
import FreelancerProfile from './pages/freelancer/FreelancerProfile'
import CreateGigPage from './pages/freelancer/CreateGigPage'
import OrderDetailsPage from './pages/common/OrderDetailsPage'
import InboxPage from './pages/common/InboxPage'
import ChatPage from './pages/common/ChatPage'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }

  return children
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><RegisterPage /></Layout>} />
        <Route path="/marketplace" element={<Layout><MarketplacePage /></Layout>} />
        <Route path="/gig/:id" element={<Layout><GigDetailPage /></Layout>} />
        <Route path="/freelancer/:id" element={<Layout><FreelancerProfilePage /></Layout>} />

        {/* Client Routes */}
        <Route path="/client/dashboard" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><ClientDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/client/orders" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><ClientOrders /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/client/profile" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><ClientProfile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/client/settings" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><ClientSettings /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payment/success" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><PaymentSuccess /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/payment/cancel" element={
          <ProtectedRoute allowedRoles={['client']}>
            <Layout><PaymentCancel /></Layout>
          </ProtectedRoute>
        } />

        {/* Freelancer Routes */}
        <Route path="/freelancer/dashboard" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><FreelancerDashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/freelancer/gigs" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><FreelancerGigs /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/freelancer/orders" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><FreelancerOrders /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/freelancer/profile" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><FreelancerProfile /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/freelancer/create-gig" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><CreateGigPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/gig/:id/edit" element={
          <ProtectedRoute allowedRoles={['freelancer']}>
            <Layout><CreateGigPage /></Layout>
          </ProtectedRoute>
        } />

        {/* Shared Routes */}
        <Route path="/order/:id" element={
          <ProtectedRoute allowedRoles={['client', 'freelancer']}>
            <Layout><OrderDetailsPage /></Layout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes >
    </>
  )
}

export default App