import { Navigate, createFileRoute } from '@tanstack/react-router'
import { Mail, Shield, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { isAuthenticated, user, loading } = useAuth()

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full mb-4">
            <User size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Profile</h1>
          <p className="text-gray-400">Your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-linear-to-r from-cyan-600 to-cyan-800"></div>

          {/* Profile Content */}
          <div className="p-8 -mt-16">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center border-4 border-gray-800 shadow-xl">
                <User size={64} className="text-white" />
              </div>
            </div>

            {/* User Info */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {user?.name}
                </h2>
                <p className="text-gray-400">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                      <Mail size={24} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">
                        Email Address
                      </p>
                      <p className="text-white font-medium">{user?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                      <Shield size={24} className="text-cyan-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">
                        Account Status
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        <p className="text-white font-medium">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            This is a protected page. Only authenticated users can view this
            content.
          </p>
        </div>
      </div>
    </div>
  )
}
