const express = require('express');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const {
    createCourse,
    updateCourse,
    deleteCourse,
    getAllCourses,
    getCourseBySlug,
    requestCourseAccess,
    getPendingRequests,
    approveCourseAccess,
    rejectCourseAccess,
    updateAccess,
    blockAccess,
    getAccessRecords,
    deleteAccess,
} = require('../controllers/courseController');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);
router.get('/:slug', getCourseBySlug);

// Admin routes
router.post('/', authMiddleware, adminMiddleware, createCourse);
router.patch('/:id', authMiddleware, adminMiddleware, updateCourse);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourse);

// Admin: Access management
router.get('/admin/requests', authMiddleware, adminMiddleware, getPendingRequests);
router.post('/admin/requests/:requestId/approve', authMiddleware, adminMiddleware, approveCourseAccess);
router.post('/admin/requests/:requestId/reject', authMiddleware, adminMiddleware, rejectCourseAccess);

// Admin: manage access records
router.patch('/admin/access/:accessId', authMiddleware, adminMiddleware, updateAccess);
router.post('/admin/access/:accessId/block', authMiddleware, adminMiddleware, blockAccess);
router.get('/admin/accesses', authMiddleware, adminMiddleware, getAccessRecords);
router.delete('/admin/access/:accessId', authMiddleware, adminMiddleware, deleteAccess);

// Student: Request access
router.post('/:courseSlug/request-access', authMiddleware, requestCourseAccess);

module.exports = router;
