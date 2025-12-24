import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/')({
  component: WelcomePage,
})

function WelcomePage() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-full flex items-center">
        <div className="absolute inset-0 bg-linear-to-r from-cyan-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-5xl sm:text-7xl font-bold text-white mb-6 animate-fade-in">
              Welcome to{' '}
              <span className="bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Blog Platform
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Share your knowledge, discover insights, and connect with a
              community of developers and tech enthusiasts.
            </p>

            {/* CTA Buttons */}
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link
                  to="/register"
                  className="group w-full sm:w-auto px-8 py-4 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105"
                >
                  Get Started
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 border border-gray-600 hover:border-cyan-500"
                >
                  <Lock size={20} />
                  Sign In
                </Link>
              </div>
            ) : (
              <div className="mb-12">
                <Link
                  to="/blog"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105"
                >
                  Explore Blog Posts
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
