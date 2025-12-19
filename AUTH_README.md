# Authentication Implementation Guide

## Overview

This project includes a complete frontend authentication system with login, registration, and protected routes.

## Features Implemented

### 1. Authentication Service (`src/services/auth.service.ts`)

- Login API integration
- Register API integration
- Token management (localStorage)
- User session management

### 2. Auth Context (`src/contexts/AuthContext.tsx`)

- Global authentication state management
- React Context API for sharing auth state
- `useAuth()` hook for easy access to auth functions

### 3. UI Pages

#### Login Page (`/login`)

- Email and password inputs
- Error handling with user-friendly messages
- Loading states
- Redirect after successful login
- Link to registration page

#### Register Page (`/register`)

- Name, email, and password inputs
- Password confirmation validation
- Password strength requirements (min 6 characters)
- Error handling
- Loading states
- Link to login page

#### Profile Page (`/profile`) - Protected Route Example

- Only accessible when authenticated
- Displays user information
- Auto-redirects to login if not authenticated

### 4. Updated Components

#### Header Component

- Dynamic navigation based on auth state
- Shows login/register buttons when logged out
- Shows user profile and logout button when logged in
- Profile navigation link for authenticated users

## Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Update this with your actual backend API URL.

### 2. Backend API Expected Endpoints

The authentication service expects these endpoints on your backend:

#### POST `/api/auth/login`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### POST `/api/auth/register`

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## Usage

### Using Authentication in Components

```tsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth()

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>
  }

  return <div>Please log in</div>
}
```

### Creating Protected Routes

```tsx
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from '@tanstack/react-router'

function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />

  return <div>Protected Content</div>
}
```

### Making Authenticated API Calls

```tsx
import { authService } from '../services/auth.service'

// Get the token
const token = authService.getToken()

// Use it in your API calls
fetch('http://your-api/endpoint', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

## File Structure

```
src/
├── components/
│   └── Header.tsx              # Updated with auth navigation
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── routes/
│   ├── __root.tsx             # Wrapped with AuthProvider
│   ├── login.tsx              # Login page
│   ├── register.tsx           # Register page
│   └── profile.tsx            # Protected route example
└── services/
    └── auth.service.ts        # API integration
```

## Styling

The authentication UI uses:

- Tailwind CSS for styling
- Lucide React for icons
- Gradient backgrounds
- Responsive design
- Loading spinners
- Error messages with visual feedback

## Security Notes

1. **Token Storage**: Currently using localStorage. For production, consider:
   - httpOnly cookies for better security
   - Refresh token implementation
   - Token expiration handling

2. **Password Security**:
   - Minimum 6 characters enforced
   - Consider adding password strength indicators
   - Backend should hash passwords (bcrypt recommended)

3. **HTTPS**: Always use HTTPS in production

4. **CORS**: Ensure your backend allows requests from your frontend domain

## Customization

### Changing API Endpoints

Edit `src/services/auth.service.ts` and update the endpoint paths:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Modify these lines:
await fetch(`${API_BASE_URL}/auth/login`, ...)
await fetch(`${API_BASE_URL}/auth/register`, ...)
```

### Modifying User Data Structure

If your backend returns different user fields, update the interface in `src/services/auth.service.ts`:

```typescript
export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    // Add your custom fields here
  }
}
```

## Testing

1. Start your backend server
2. Update `.env` with correct API URL
3. Run the development server: `npm run dev`
4. Navigate to:
   - `/login` - Test login
   - `/register` - Test registration
   - `/profile` - Test protected route

## Troubleshooting

### CORS Errors

Add CORS headers to your backend:

```javascript
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Credentials: true
```

### Token Not Persisting

Check browser console for localStorage errors. Some browsers block localStorage in private mode.

### 401 Unauthorized Errors

Ensure your backend is validating the JWT token correctly.

## Next Steps

Consider adding:

- [ ] Password reset functionality
- [ ] Email verification
- [ ] Remember me checkbox
- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Token refresh mechanism
- [ ] Session timeout handling
- [ ] Two-factor authentication
