import { apiRequest } from '../utils/api'

export interface Author {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface Comment {
  id: string
  body: string
  author: Author
  createdAt: string
}

export interface BlogPost {
  id: string
  title: string
  body: string
  author: Author
  createdAt: string
  updatedAt: string
  excerpt?: string
  commentsCount?: number
}

export interface BlogPostDetail extends BlogPost {
  comments: Array<Comment>
}

class BlogService {
  /**
   * Fetch all blog posts (content)
   */
  async getAllPosts(): Promise<Array<BlogPost>> {
    try {
      const response = await apiRequest<{ message: string; data: Array<any> }>('/content/getAllContent', {
        requireAuth: false,
      })
      
      // Transform the backend response to match our BlogPost interface
      const posts: Array<BlogPost> = response.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        body: item.body,
        author: {
          id: item.authorId,
          name: 'Author', // Backend doesn't return author details
          email: '',
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }))
      
      return posts
    } catch (error) {
      console.error('Error fetching blog posts:', error)
      throw error
    }
  }

  /**
   * Fetch a single blog post by ID
   */
  async getPostById(id: string): Promise<BlogPost> {
    try {
      const response = await apiRequest<{ message: string; data: any }>(`/content/getContent/${id}`, {
        requireAuth: false,
      })
      
      // Transform the backend response
      const item = response.data
      const post: BlogPost = {
        id: item._id,
        title: item.title,
        body: item.body,
        author: {
          id: item.authorId,
          name: 'Author',
          email: '',
        },
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }
      
      return post
    } catch (error) {
      console.error('Error fetching blog post:', error)
      throw error
    }
  }

  /**
   * Fetch comments for a specific content/post
   */
  async getCommentsByContentId(contentId: string): Promise<Array<Comment>> {
    try {
      const comments = await apiRequest<Array<Comment>>(
        `/comments/content/${contentId}`,
        {
          requireAuth: false,
        }
      )
      return comments
    } catch (error) {
      console.error('Error fetching comments:', error)
      throw error
    }
  }

  /**
   * Create a new blog post (content)
   */
  async createPost(data: {
    title: string
    body: string
  }): Promise<BlogPost> {
    try {
      const post = await apiRequest<BlogPost>('/content/create', {
        method: 'POST',
        body: JSON.stringify(data),
        requireAuth: true,
      })
      return post
    } catch (error) {
      console.error('Error creating blog post:', error)
      throw error
    }
  }

  /**
   * Update a blog post (content)
   */
  async updatePost(
    id: string,
    data: { title: string; body: string }
  ): Promise<BlogPost> {
    try {
      const post = await apiRequest<BlogPost>(`/content/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        requireAuth: true,
      })
      return post
    } catch (error) {
      console.error('Error updating blog post:', error)
      throw error
    }
  }

  /**
   * Delete a blog post (content)
   */
  async deletePost(id: string): Promise<void> {
    try {
      await apiRequest<void>(`/content/delete/${id}`, {
        method: 'DELETE',
        requireAuth: true,
      })
    } catch (error) {
      console.error('Error deleting blog post:', error)
      throw error
    }
  }

  /**
   * Add a comment to a blog post
   */
  async addComment(
    contentId: string,
    data: { body: string }
  ): Promise<Comment> {
    try {
      const comment = await apiRequest<Comment>('/comments/create', {
        method: 'POST',
        body: JSON.stringify({ ...data, contentId }),
        requireAuth: true,
      })
      return comment
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  /**
   * Delete a comment
   */
  async deleteComment(id: string): Promise<void> {
    try {
      await apiRequest<void>(`/comments/delete/${id}`, {
        method: 'DELETE',
        requireAuth: true,
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  /**
   * Generate excerpt from body text
   */
  generateExcerpt(body: string, maxLength: number = 150): string {
    if (body.length <= maxLength) return body
    return body.substring(0, maxLength).trim() + '...'
  }
}

export const blogService = new BlogService()
