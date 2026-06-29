# Coaching Center Backend

Express.js backend API for the Coaching Center Management System.

## Features

- User authentication & authorization (JWT)
- Course management (CRUD operations)
- Enrollment system with approval workflow
- Notice management system
- Notification system
- Admin dashboard with statistics
- File upload (Cloudinary integration)
- MongoDB database

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Deployment**: Vercel / Railway / Render

## Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── courseController.js  # Course operations
│   ├── enrollmentController.js  # Enrollment management
│   ├── noticeController.js  # Notice operations
│   ├── notificationController.js  # Notification system
│   ├── userController.js    # User management
│   ├── statsController.js   # Admin statistics
│   └── uploadController.js  # File upload handling
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── Course.js            # Course schema
│   ├── CourseAccess.js      # Course access control
│   ├── CourseRequest.js     # Course access requests
│   ├── Enrollment.js        # Enrollment schema
│   ├── Notice.js            # Notice schema
│   ├── Notification.js      # Notification schema
│   └── User.js              # User schema
├── routes/
│   └── index.js             # All API routes
└── server.js                # Express server entry point
```

## API Endpoints

### Public Routes
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:slug` - Get course by slug
- `GET /api/notices` - Get public notices

### Student Routes (Authenticated)
- `POST /api/enrollments` - Request course enrollment
- `GET /api/enrollments` - Get my enrollments
- `PATCH /api/enrollments` - Update enrollment
- `GET /api/notifications` - Get my notifications
- `PATCH /api/notifications/:id/read` - Mark notification as read
- `GET /api/users/me` - Get my profile
- `PATCH /api/users/me` - Update my profile

### Admin Routes (Authenticated + Admin)
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users` - Update user
- `DELETE /api/admin/users` - Delete user
- `POST /api/admin/courses` - Create course
- `PATCH /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/courses` - Get all courses (including drafts)
- `GET /api/admin/enrollments` - Get all enrollments
- `PATCH /api/admin/enrollments` - Update enrollment status
- `DELETE /api/admin/enrollments` - Delete enrollment
- `POST /api/admin/notices` - Create notice
- `PATCH /api/admin/notices/:id` - Update notice
- `DELETE /api/admin/notices/:id` - Delete notice
- `GET /api/admin/notices` - Get all notices
- `POST /api/upload/thumbnail` - Upload thumbnail
- `POST /api/upload/profile` - Upload profile image

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://your-connection-string
DB_NAME=coching_center

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_super_secret_jwt_key

# CORS
FRONTEND_URL=http://localhost:3000

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or use nodemon for auto-reload
npm run dev
```

## Deployment

### Option 1: Vercel (Recommended for this project)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --yes
   ```

4. Add environment variables in Vercel dashboard

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Option 2: Railway

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project from GitHub repo
4. Add environment variables
5. Deploy

### Option 3: Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Add environment variables
6. Deploy

## Testing

Once deployed, test the API:

```bash
# Health check
curl https://your-backend-url.vercel.app/api/health

# Get courses
curl https://your-backend-url.vercel.app/api/courses
```

## Frontend Integration

Update your frontend's `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

Then redeploy the frontend.

## Current Status

✅ Backend code complete
✅ All routes configured
✅ All controllers implemented
✅ All models created
✅ Authentication middleware ready
✅ File upload configured
✅ CORS configured
✅ Deployment configs created (Vercel, Railway)
⏳ **Backend needs to be deployed**
⏳ **Frontend needs to be updated with backend URL**

## Next Steps

1. **Deploy the backend** using one of the methods above
2. **Get the backend URL** (e.g., `https://coching-center-backend.vercel.app`)
3. **Update frontend** `.env.production` with the backend URL
4. **Redeploy frontend** to Vercel
5. **Test the connection** - The "failed to fetch" error should be resolved

## Support

For deployment issues, check:
- MongoDB Atlas IP whitelist (add 0.0.0.0/0)
- Environment variables are set correctly
- Backend URL is accessible
- CORS settings include your frontend domain