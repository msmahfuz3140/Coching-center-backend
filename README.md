# Coaching Center Backend

Express.js + MongoDB backend for course management system.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment variable

Create `.env` file:

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://coching-center:xOpJ1xoCTs3KHx0B@ac-5ppqbt1-shard-00-00.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-01.lwxgi8z.mongodb.net:27017,ac-5ppqbt1-shard-00-02.lwxgi8z.mongodb.net:27017/coching_center?ssl=true&replicaSet=atlas-l7hopv-shard-0&authSource=admin&appName=Cluster0
DB_NAME=coching_center

# JWT
JWT_SECRET=your-secret-key-here

# CORS
FRONTEND_URL=http://localhost:3000
```

### 3. Start Server

```bash
npm run dev
```

Server will start on **<http://localhost:5000>**

## Project Structure

```
src/
├── config/
│   └── database.js           # MongoDB connection
├── models/
│   ├── Course.js            # Course schema
│   ├── CourseAccess.js       # Access tracking
│   └── CourseRequest.js      # Requests
├── controllers/
│   └── courseController.js   # Business logic
├── routes/
│   └── courseRoutes.js       # API routes
├── middleware/
│   └── auth.js              # JWT auth
└── server.js                # Entry point
```

## API Endpoints

### Public

- `GET /api/courses` - List all courses
- `GET /api/courses/:slug` - Get course details

### Student (Auth Required)

- `POST /api/courses/:courseSlug/request-access` - Request access

### Admin (Admin Auth Required)

- `POST /api/courses` - Create course
- `PATCH /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course
- `GET /api/courses/admin/requests` - Get pending requests
- `POST /api/courses/admin/requests/:requestId/approve` - Approve
- `POST /api/courses/admin/requests/:requestId/reject` - Reject

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | No | 5000 | Server port |
| NODE_ENV | No | development | Environment |
| MONGODB_URI | Yes | - | MongoDB connection string |
| DB_NAME | Yes | - | Database name |
| JWT_SECRET | Yes | - | JWT signing key |
| FRONTEND_URL | Yes | - | Frontend URL for CORS |

## Testing

Use curl or Postman:

```bash
# Get all courses
curl http://localhost:5000/api/courses

# Create course (requires auth)
curl -X POST http://localhost:5000/api/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Diploma Course",
    "slug": "diploma-1",
    "category": "Diploma",
    "instructor": "John Doe"
  }'
```

## Models

### Course

- title (required)
- slug (required, unique)
- description
- category (required)
- syllabus
- youtubeVideoId
- youtubePlaylistId
- instructor
- price
- isActive
- createdBy

### CourseAccess

- studentId
- studentEmail
- courseId
- courseSlug
- status (active/suspended/expired)
- grantedBy
- grantedAt
- expiresAt

### CourseRequest

- studentId
- studentEmail
- courseId
- courseSlug
- status (pending/approved/rejected)
- requestMessage
- responseMessage
- reviewedBy
- reviewedAt

## Troubleshooting

### MongoDB Connection Failed

- Check MONGODB_URI is correct
- Ensure database user has correct permissions
- Verify IP is whitelisted in MongoDB Atlas

### Port Already in Use

- Change PORT in .env
- Or kill existing process: `lsof -ti:5000 | xargs kill`

### CORS Issues

- Ensure FRONTEND_URL in .env matches your frontend
- Check Authorization header is included

---

Made with ❤️ for Coaching Center
