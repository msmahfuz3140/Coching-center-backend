const express = require('express');
const multer = require('multer');
const path = require('path');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Import controllers
const courseController = require('../controllers/courseController');
const enrollmentController = require('../controllers/enrollmentController');
const noticeController = require('../controllers/noticeController');
const notificationController = require('../controllers/notificationController');
const userController = require('../controllers/userController');
const statsController = require('../controllers/statsController');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

// ============ PUBLIC ROUTES ============

// Courses
router.get('/courses', courseController.getAllCourses);
router.get('/courses/:slug', courseController.getCourseBySlug);

// Notices (public)
router.get('/notices', noticeController.getNotices);

// ============ AUTH REQUIRED ROUTES ============

// Enrollments
router.post('/enrollments', authMiddleware, enrollmentController.requestEnrollment);
router.get('/enrollments', authMiddleware, enrollmentController.getMyEnrollments);
router.patch('/enrollments', authMiddleware, enrollmentController.updateEnrollment);

// Notifications
router.get('/notifications', authMiddleware, notificationController.getNotifications);
router.patch('/notifications/:id/read', authMiddleware, notificationController.markAsRead);

// User profile
router.get('/users/me', authMiddleware, userController.getMe);
router.patch('/users/me', authMiddleware, userController.updateMe);

// ============ ADMIN ROUTES ============

// Admin Stats
router.get('/admin/stats', authMiddleware, adminMiddleware, statsController.getStats);

// Admin Users
router.get('/admin/users', authMiddleware, adminMiddleware, userController.getAllUsers);
router.patch('/admin/users', authMiddleware, adminMiddleware, userController.updateUser);
router.delete('/admin/users', authMiddleware, adminMiddleware, userController.deleteUser);

// Admin Courses
router.post('/admin/courses', authMiddleware, adminMiddleware, courseController.createCourse);
router.patch('/admin/courses/:id', authMiddleware, adminMiddleware, courseController.updateCourse);
router.delete('/admin/courses/:id', authMiddleware, adminMiddleware, courseController.deleteCourse);
router.get('/admin/courses', authMiddleware, adminMiddleware, courseController.getAllCoursesAdmin);

// Admin Enrollments
router.get('/admin/enrollments', authMiddleware, adminMiddleware, enrollmentController.getAllEnrollments);
router.patch('/admin/enrollments', authMiddleware, adminMiddleware, enrollmentController.updateEnrollmentStatus);
router.delete('/admin/enrollments', authMiddleware, adminMiddleware, enrollmentController.deleteEnrollment);

// Admin Notices
router.post('/admin/notices', authMiddleware, adminMiddleware, noticeController.createNotice);
router.patch('/admin/notices/:id', authMiddleware, adminMiddleware, noticeController.updateNotice);
router.delete('/admin/notices/:id', authMiddleware, adminMiddleware, noticeController.deleteNotice);
router.get('/admin/notices', authMiddleware, adminMiddleware, noticeController.getAllNotices);

// Admin Videos - TODO: Implement video controller
// router.post('/admin/videos', authMiddleware, adminMiddleware, courseController.addVideo);
// router.delete('/admin/videos/:id', authMiddleware, adminMiddleware, courseController.deleteVideo);

// Upload routes
router.post('/upload/thumbnail', upload.single('file'), uploadController.uploadThumbnail);
router.post('/upload/profile', upload.single('file'), uploadController.uploadProfile);

module.exports = router;