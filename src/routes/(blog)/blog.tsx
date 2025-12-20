import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  BookOpen,
  Calendar,
  MessageSquare,
  User as UserIcon,
} from 'lucide-react'
import { blogService } from '../../services/blog.service'
import type { BlogPost } from '../../services/blog.service'

export const Route = createFileRoute('/(blog)/blog')({
  component: BlogListPage,
})

function BlogListPage() {
  const [posts, setPosts] = useState<Array<BlogPost>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await blogService.getAllPosts()
      setPosts(data)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load blog posts. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={loadPosts}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-cyan-600 to-cyan-800 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <BookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">Blog Posts</h1>
          <p className="text-xl text-cyan-100 max-w-2xl mx-auto">
            Discover insightful articles, stories, and ideas from our community
            of writers
          </p>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Posts Yet</h2>
            <p className="text-gray-400">Check back soon for new content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 group"
              >
                <div className="p-6">
                  {/* Post Title */}
                  <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Post Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {post.excerpt ||
                      blogService.generateExcerpt(post.body, 120)}
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-700">
                    <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shrink-0">
                      <UserIcon size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {post.author.name}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={12} />
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer with Comments & Read More */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MessageSquare size={16} />
                      <span>
                        {post.commentsCount || 0}{' '}
                        {post.commentsCount === 1 ? 'comment' : 'comments'}
                      </span>
                    </div>
                    <Link
                      to="/posts/$postId"
                      params={{ postId: post.id }}
                      className="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
