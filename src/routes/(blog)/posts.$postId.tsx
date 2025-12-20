import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Send,
  User as UserIcon,
} from 'lucide-react'
import { blogService } from '../../services/blog.service'
import { useAuth } from '../../contexts/AuthContext'
import type { FormEvent } from 'react'
import type { BlogPostDetail } from '../../services/blog.service'

export const Route = createFileRoute('/(blog)/posts/$postId')({
  component: BlogPostDetailPage,
})

function BlogPostDetailPage() {
  const { postId } = Route.useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch post and comments separately
      const [postData, commentsData] = await Promise.all([
        blogService.getPostById(postId),
        blogService.getCommentsByContentId(postId),
      ])

      // Combine post with comments
      setPost({
        ...postData,
        comments: commentsData,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load blog post. Please try again later.',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }

    try {
      setSubmittingComment(true)
      setCommentError(null)
      const newComment = await blogService.addComment(postId, {
        body: commentText,
      })

      // Add the new comment to the post
      if (post) {
        setPost({
          ...post,
          comments: [...post.comments, newComment],
        })
      }
      setCommentText('')
    } catch (err) {
      setCommentError(
        err instanceof Error ? err.message : 'Failed to add comment',
      )
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500 rounded-2xl p-8 text-center">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Post Not Found</h2>
          <p className="text-red-200 mb-6">
            {error || 'This post could not be found.'}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to All Posts</span>
        </Link>

        {/* Blog Post Card */}
        <article className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden mb-8">
          <div className="p-8">
            {/* Post Title */}
            <h1 className="text-4xl font-bold text-white mb-6">{post.title}</h1>

            {/* Author & Date */}
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-700">
              <div className="w-14 h-14 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center">
                <UserIcon size={24} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-white">
                  {post.author.name}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar size={14} />
                  <span>Published on {formatDate(post.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Post Body */}
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                {post.body}
              </p>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="p-8">
            {/* Comments Header */}
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare size={24} className="text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">
                Comments ({post.comments.length})
              </h2>
            </div>

            {/* Comment Form */}
            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-8">
                {commentError && (
                  <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                    {commentError}
                  </div>
                )}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shrink-0">
                    <UserIcon size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      rows={3}
                      disabled={submittingComment}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="mt-3 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {submittingComment ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Posting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Post Comment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-6 bg-gray-700/50 border border-gray-600 rounded-lg text-center">
                <p className="text-gray-300 mb-4">
                  Please log in to leave a comment
                </p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {post.comments.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-4xl mb-3">💬</div>
                  <p className="text-gray-400">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 bg-gray-700/50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-cyan-700 rounded-full flex items-center justify-center shrink-0">
                      <UserIcon size={20} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-white">
                          {comment.author.name}
                        </span>
                        <span className="text-gray-500 text-xs">•</span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300">{comment.body}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
