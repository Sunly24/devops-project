import { authService } from '../services/auth.service'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

interface RequestOptions extends RequestInit {
  requireAuth?: boolean
}

/**
 * Custom fetch wrapper that automatically includes authentication token
 * @param endpoint - API endpoint (relative to API_BASE_URL)
 * @param options - Fetch options with optional requireAuth flag
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { requireAuth = true, headers = {}, ...restOptions } = options

  const token = authService.getToken()

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  // Add authorization header if auth is required and token exists
  if (requireAuth && token) {
    requestHeaders['Authorization'] = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders,
  })

  // Handle unauthorized responses
  if (response.status === 401) {
    // Token might be expired or invalid
    authService.logout()
    window.location.href = '/login'
    throw new Error('Unauthorized - please login again')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`,
    }))
    throw new Error(error.message || 'Request failed')
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    return {} as T
  }

  return response.json()
}

/**
 * Example usage:
 *
 * // GET request
 * const data = await apiRequest<User>('/users/me')
 *
 * // POST request
 * const newPost = await apiRequest<Post>('/posts', {
 *   method: 'POST',
 *   body: JSON.stringify({ title: 'My Post' })
 * })
 *
 * // Request without authentication
 * const publicData = await apiRequest('/public/data', {
 *   requireAuth: false
 * })
 */
