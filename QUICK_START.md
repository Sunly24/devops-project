# Quick Start Guide - Authentication

## 🎉 What's Been Implemented

Your authentication system is now complete with:

✅ **Login Page** (`/login`)  
✅ **Register Page** (`/register`)  
✅ **Profile Page** (`/profile`) - Protected route example  
✅ **Authentication Service** - API integration  
✅ **Auth Context** - Global state management  
✅ **Updated Header** - Dynamic navigation based on auth state  
✅ **API Helper Utility** - Easy authenticated requests

## 🚀 Quick Start

### 1. Configure Backend URL

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:3000

### 3. Test the Features

- Navigate to `/login` to test the login page
- Navigate to `/register` to test registration
- Navigate to `/profile` (requires authentication)
- Open the sidebar menu to see auth navigation

## 📂 New Files Created

```
src/
├── contexts/
│   └── AuthContext.tsx          # Auth state management
├── routes/
│   ├── login.tsx               # Login page
│   ├── register.tsx            # Register page
│   └── profile.tsx             # Protected route example
├── services/
│   └── auth.service.ts         # API integration
└── utils/
    └── api.ts                  # Helper for authenticated API calls
```

## 🔌 Backend API Requirements

Your backend should implement these endpoints:

### POST /api/auth/login

```json
// Request
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### POST /api/auth/register

```json
// Request
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

// Response (same as login)
{
  "token": "jwt_token_here",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

## 💡 Usage Examples

### Check if User is Authenticated

```tsx
import { useAuth } from './contexts/AuthContext'

function MyComponent() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div>
      {isAuthenticated ? <p>Welcome, {user?.name}!</p> : <p>Please log in</p>}
    </div>
  )
}
```

### Make Authenticated API Requests

```tsx
import { apiRequest } from './utils/api'

// GET request
const data = await apiRequest('/users/me')

// POST request
const result = await apiRequest('/api/endpoint', {
  method: 'POST',
  body: JSON.stringify({ data: 'value' }),
})
```

### Create Protected Routes

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

## 🎨 UI Features

- Modern gradient backgrounds
- Responsive design (mobile-friendly)
- Loading states with spinners
- Error messages with visual feedback
- Form validation
- Icons from Lucide React
- Smooth transitions and animations
- Slide-out navigation menu

## 🔧 Customization

### Change API Endpoints

Edit `src/services/auth.service.ts`:

```typescript
const API_BASE_URL = 'https://your-api.com/api'
```

### Modify User Fields

Edit the `AuthResponse` interface in `src/services/auth.service.ts`:

```typescript
export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    // Add your custom fields
  }
}
```

### Update Styling

The components use Tailwind CSS classes. Edit the className props to customize colors, spacing, etc.

## 📝 Next Steps

Consider implementing:

- [ ] Password reset/forgot password
- [ ] Email verification
- [ ] OAuth integration (Google, GitHub, etc.)
- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Session timeout handling
- [ ] Two-factor authentication

## 📚 More Information

See [AUTH_README.md](./AUTH_README.md) for detailed documentation.

## 🐛 Troubleshooting

### CORS Errors

Configure your backend to allow requests from `http://localhost:3000`

### 401 Errors

Check that your backend is correctly validating JWT tokens

### Build Errors

Run `npm run build` to check for TypeScript errors

## ✅ Build Status

The project builds successfully with no errors! ✨
