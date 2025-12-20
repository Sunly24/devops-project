# Blog Feature Documentation

## Overview

The blog feature allows users to view blog posts, read post details, and add comments. The home page displays all blog posts in a beautiful card grid layout.

## Pages Implemented

### 1. Home Page (`/`)

**Features:**

- Displays all blog posts in a responsive grid (3 columns on desktop, 2 on tablet, 1 on mobile)
- Shows post title, excerpt, author name, publish date, and comment count
- Click "Read More" to view full post details
- Loading state with spinner
- Error handling with retry button
- Empty state when no posts available

**UI Elements:**

- Hero section with welcome message
- Post cards with hover effects
- Author avatars
- Metadata (date, comments count)

### 2. Blog Post Detail Page (`/posts/:postId`)

**Features:**

- Full post content display
- Author information with publish date
- Comments section
- Add new comments (requires authentication)
- Back navigation to home page
- Loading and error states

**Authenticated Users Can:**

- Post comments on blog posts
- View their user info in the comment form

**Unauthenticated Users:**

- Can read posts and view comments
- See login prompt to add comments
- Redirect to login page when attempting to comment

## API Integration

### Blog Service (`src/services/blog.service.ts`)

The service handles all blog-related API calls:

#### Expected Backend Endpoints

##### Content Routes

##### GET `/api/content/getAllContent`

Fetch all blog posts (content).

**Response:**

```json
[
  {
    "id": "1",
    "title": "My First Blog Post",
    "body": "This is the full content of the blog post...",
    "author": {
      "id": "user1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2025-12-19T10:00:00Z",
    "updatedAt": "2025-12-19T10:00:00Z",
    "excerpt": "Short preview of the post",
    "commentsCount": 5
  }
]
```

##### GET `/api/content/getContent/:id`

Fetch a single blog post (content) by ID.

**Response:**

```json
{
  "id": "1",
  "title": "My First Blog Post",
  "body": "This is the full content of the blog post...",
  "author": {
    "id": "user1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "createdAt": "2025-12-19T10:00:00Z",
  "updatedAt": "2025-12-19T10:00:00Z"
}
```

##### POST `/api/content/create` (Requires Authentication)

Create a new blog post (content).

**Request Body:**

```json
{
  "title": "New Blog Post",
  "body": "Full content of the blog post..."
}
```

**Response:** Same as GET single content

##### PUT `/api/content/update/:id` (Requires Authentication)

Update an existing blog post (content).

**Request Body:**

```json
{
  "title": "Updated Title",
  "body": "Updated content..."
}
```

**Response:** Updated content object

##### DELETE `/api/content/delete/:id` (Requires Authentication)

Delete a blog post (content).

**Response:** Success message or empty response

##### Comment Routes

##### GET `/api/comments/content/:contentId`

Fetch all comments for a specific content/post.

**Response:**

```json
[
  {
    "id": "c1",
    "body": "Great post!",
    "author": {
      "id": "user2",
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "createdAt": "2025-12-19T11:00:00Z"
  }
]
```

##### POST `/api/comments/create` (Requires Authentication)

Add a comment to a blog post.

**Request Body:**

```json
{
  "contentId": "1",
  "body": "This is my comment"
}
```

**Response:**

```json
{
  "id": "c2",
  "body": "This is my comment",
  "author": {
    "id": "user3",
    "name": "Current User",
    "email": "user@example.com"
  },
  "createdAt": "2025-12-19T12:00:00Z"
}
```

##### DELETE `/api/comments/delete/:id` (Requires Authentication)

Delete a comment.

**Response:** Success message or empty response

## Data Models

### BlogPost Interface

```typescript
interface BlogPost {
  id: string
  title: string
  body: string
  author: Author
  createdAt: string
  updatedAt: string
  excerpt?: string
  commentsCount?: number
}
```

### BlogPostDetail Interface

```typescript
interface BlogPostDetail extends BlogPost {
  comments: Comment[]
}
```

### Comment Interface

```typescript
interface Comment {
  id: string
  body: string
  author: Author
  createdAt: string
}
```

### Author Interface

```typescript
interface Author {
  id: string
  name: string
  email: string
  avatar?: string
}
```

## Usage Examples

### Using Blog Service in Components

```tsx
import { blogService } from '../services/blog.service'

// Fetch all posts (content)
const posts = await blogService.getAllPosts()

// Fetch single post (content)
const post = await blogService.getPostById('post-id')

// Fetch comments for a post
const comments = await blogService.getCommentsByContentId('post-id')

// Create a new post (requires auth)
const newPost = await blogService.createPost({
  title: 'My New Post',
  body: 'Post content...',
})

// Update a post (requires auth)
const updatedPost = await blogService.updatePost('post-id', {
  title: 'Updated Title',
  body: 'Updated content...',
})

// Delete a post (requires auth)
await blogService.deletePost('post-id')

// Add a comment (requires auth)
const comment = await blogService.addComment('content-id', {
  body: 'My comment text',
})

// Delete a comment (requires auth)
await blogService.deleteComment('comment-id')

// Generate excerpt from body
const excerpt = blogService.generateExcerpt(longText, 150)
```

## Styling & Design

### Color Scheme

- Primary: Cyan (cyan-400 to cyan-700)
- Background: Dark gray gradient (gray-900 to gray-800)
- Cards: gray-800 with gray-700 borders
- Text: White for headings, gray-300/400 for body

### Responsive Design

- Mobile-first approach
- Grid layout adapts to screen size:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Padding and spacing adjust for smaller screens

### Interactive Elements

- Card hover effects (border color change, shadow)
- Button hover states
- Smooth transitions
- Loading spinners
- Form validation

## Features

### Home Page Features

✅ Responsive grid layout  
✅ Post cards with hover effects  
✅ Author display with avatar  
✅ Publish date formatting  
✅ Comment count display  
✅ Excerpt generation  
✅ Loading state  
✅ Error handling  
✅ Empty state

### Detail Page Features

✅ Full post content  
✅ Author information  
✅ Comments list  
✅ Add comment form  
✅ Authentication check for comments  
✅ Real-time comment addition  
✅ Back navigation  
✅ Loading state  
✅ Error handling  
✅ Login prompt for unauthenticated users

## Authentication Integration

The blog feature integrates with the existing authentication system:

- Public access to view posts and comments
- Authentication required to:
  - Add comments
  - Create posts (via API)
- Automatic redirect to login when attempting authenticated actions
- User info displayed in comment form and comments

## Configuration

### API Base URL

Set in `.env` file:

```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Authentication

The blog service uses the `apiRequest` utility which:

- Automatically includes JWT tokens for authenticated requests
- Handles 401 responses (token expiration)
- Can make public requests with `requireAuth: false`

## Testing

### Manual Testing Steps

1. **View Blog Posts**
   - Visit homepage `/`
   - Verify posts load correctly
   - Check loading state appears first
   - Verify error handling (disconnect backend)

2. **View Post Details**
   - Click "Read More" on any post
   - Verify post content displays
   - Check comments section loads
   - Verify back button works

3. **Add Comments (Authenticated)**
   - Log in to the application
   - Navigate to a blog post
   - Add a comment
   - Verify comment appears immediately
   - Check error handling

4. **Add Comments (Unauthenticated)**
   - Log out of the application
   - Navigate to a blog post
   - Verify login prompt appears
   - Click "Sign In" to redirect to login

## File Structure

```
src/
├── routes/
│   ├── index.tsx                    # Home page with blog post list
│   └── posts.$postId.tsx            # Blog post detail page
├── services/
│   ├── blog.service.ts              # Blog API service
│   └── auth.service.ts              # Authentication service
└── utils/
    └── api.ts                       # API request helper
```

## Future Enhancements

Consider adding:

- [ ] Pagination for blog posts
- [ ] Search functionality
- [ ] Filter by author or date
- [ ] Categories/tags
- [ ] Edit/delete comments
- [ ] Edit/delete posts
- [ ] Rich text editor for posts
- [ ] Image uploads
- [ ] Like/reaction system
- [ ] Share functionality
- [ ] Related posts
- [ ] Author profiles
- [ ] Draft posts
- [ ] Markdown support

## Troubleshooting

### Posts Not Loading

- Check API endpoint is correct in `.env`
- Verify backend is running
- Check browser console for errors
- Verify CORS is configured on backend

### Comments Not Posting

- Ensure user is authenticated
- Check JWT token is valid
- Verify comment API endpoint
- Check browser network tab for errors

### Routing Issues

- Make sure TanStack Router is properly configured
- Verify route files are in correct location
- Check route paths match navigation links
