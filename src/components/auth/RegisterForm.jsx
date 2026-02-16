import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { User, Mail, Lock, Briefcase, Loader } from 'lucide-react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().oneOf(['client', 'freelancer']).required('Role is required'),
})

const RegisterForm = () => {
  const { register: registerUser } = useAuth()
  const { showError, showSuccess } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      role: searchParams.get('role') || 'client',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...userData } = data
      await registerUser(userData)
      showSuccess('Registration successful!')
      navigate('/')
    } catch (error) {
      showError(error.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 text-center">Join FreelanceHub</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                {...register('name')}
                className="input-field pl-10"
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                {...register('email')}
                className="input-field pl-10"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  {...register('password')}
                  className="input-field pl-10"
                  placeholder="Create password"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="input-field pl-10"
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              I want to join as
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('role', 'client')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                } ${
                  !errors.role && 'hover:border-primary-500'
                }`}
              >
                <input
                  type="radio"
                  {...register('role')}
                  value="client"
                  className="sr-only"
                />
                <Briefcase className="mx-auto mb-2" size={24} />
                <span className="font-medium">Client</span>
                <p className="text-sm text-gray-600 mt-1">I want to hire freelancers</p>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'freelancer')}
                className={`p-4 border rounded-lg text-center transition-colors ${
                  errors.role ? 'border-red-300' : 'border-gray-300'
                } ${
                  !errors.role && 'hover:border-primary-500'
                }`}
              >
                <input
                  type="radio"
                  {...register('role')}
                  value="freelancer"
                  className="sr-only"
                />
                <Briefcase className="mx-auto mb-2" size={24} />
                <span className="font-medium">Freelancer</span>
                <p className="text-sm text-gray-600 mt-1">I want to offer my services</p>
              </button>
            </div>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {loading ? <Loader className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>
            By creating an account, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm