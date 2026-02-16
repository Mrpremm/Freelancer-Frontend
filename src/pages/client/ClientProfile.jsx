import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { User, Mail, Save, Loader } from 'lucide-react'

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  bio: yup.string().max(500, 'Bio cannot exceed 500 characters'),
})

const ClientProfile = () => {
  const { user, updateProfile } = useAuth()
  const { showSuccess, showError } = useToast()
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
    }
  })

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      await updateProfile(data)
      showSuccess('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      showError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  if (!user) return null

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary text-sm"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="btn-outline text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit(onSubmit)}
                    disabled={loading}
                    className="btn-primary text-sm flex items-center"
                  >
                    {loading && <Loader className="animate-spin mr-2" size={16} />}
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                      <User size={48} className="text-primary-600" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700"
                    >
                      <User size={16} />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-gray-600">Client</p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      {...register('name')}
                      className="input-field"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{user.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        {...register('email')}
                        className="input-field pl-10"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <>
                    <textarea
                      {...register('bio')}
                      rows={4}
                      className="input-field"
                      placeholder="Tell us about yourself..."
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-2">{errors.bio.message}</p>
                    )}
                  </>
                ) : user.bio ? (
                  <p className="text-gray-900">{user.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">No bio added yet</p>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold mb-4">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type</span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4">Account Security</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="font-medium mb-1">Change Password</div>
                <div className="text-sm text-gray-600">Update your account password</div>
              </button>
              <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                <div className="font-medium mb-1">Two-Factor Authentication</div>
                <div className="text-sm text-gray-600">Add an extra layer of security</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClientProfile