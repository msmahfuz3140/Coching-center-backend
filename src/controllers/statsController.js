const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();
        const approvedEnrollments = await Enrollment.countDocuments({ status: 'APPROVED' });
        const pendingEnrollments = await Enrollment.countDocuments({ status: 'PENDING' });
        const rejectedEnrollments = await Enrollment.countDocuments({ status: 'REJECTED' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                totalEnrollments,
                approvedEnrollments,
                pendingEnrollments,
                rejectedEnrollments,
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};