const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Request enrollment in a course
// @route   POST /api/enrollments
// @access  Private
exports.requestEnrollment = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Check if already enrolled
        const existing = await Enrollment.findOne({ userId, courseId });
        if (existing) {
            return res.status(400).json({ error: 'You have already requested enrollment for this course' });
        }

        const enrollment = await Enrollment.create({
            userId,
            courseId,
            status: 'PENDING',
        });

        res.status(201).json({
            message: 'Enrollment request sent successfully',
            enrollment
        });
    } catch (error) {
        console.error('Request enrollment error:', error);
        res.status(500).json({ error: 'Failed to request enrollment' });
    }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments
// @access  Private
exports.getMyEnrollments = async (req, res) => {
    try {
        const userId = req.user.id;
        const enrollments = await Enrollment.find({ userId })
            .populate('courseId', 'title slug category thumbnail price')
            .sort({ enrolledAt: -1 });

        res.json(enrollments);
    } catch (error) {
        console.error('Get enrollments error:', error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
};

// @desc    Update enrollment
// @route   PATCH /api/enrollments
// @access  Private
exports.updateEnrollment = async (req, res) => {
    try {
        const { enrollmentId } = req.body;
        const userId = req.user.id;

        const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId });
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        // Students can only update their own enrollments (e.g., progress)
        const updated = await Enrollment.findByIdAndUpdate(
            enrollmentId,
            { $set: req.body },
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        console.error('Update enrollment error:', error);
        res.status(500).json({ error: 'Failed to update enrollment' });
    }
};

// @desc    Get all enrollments (Admin)
// @route   GET /api/admin/enrollments
// @access  Private/Admin
exports.getAllEnrollments = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) query.status = status;

        const enrollments = await Enrollment.find(query)
            .populate('userId', 'name email')
            .populate('courseId', 'title category')
            .sort({ enrolledAt: -1 });

        res.json(enrollments);
    } catch (error) {
        console.error('Get all enrollments error:', error);
        res.status(500).json({ error: 'Failed to fetch enrollments' });
    }
};

// @desc    Update enrollment status (Admin)
// @route   PATCH /api/admin/enrollments
// @access  Private/Admin
exports.updateEnrollmentStatus = async (req, res) => {
    try {
        const { enrollmentId, status, responseMessage } = req.body;

        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ error: 'Enrollment not found' });
        }

        enrollment.status = status;
        if (responseMessage) enrollment.responseMessage = responseMessage;
        await enrollment.save();

        res.json({
            message: `Enrollment ${status.toLowerCase()} successfully`,
            enrollment
        });
    } catch (error) {
        console.error('Update enrollment status error:', error);
        res.status(500).json({ error: 'Failed to update enrollment status' });
    }
};

// @desc    Delete enrollment (Admin)
// @route   DELETE /api/admin/enrollments
// @access  Private/Admin
exports.deleteEnrollment = async (req, res) => {
    try {
        const { id } = req.query;

        await Enrollment.findByIdAndDelete(id);
        res.json({ message: 'Enrollment deleted successfully' });
    } catch (error) {
        console.error('Delete enrollment error:', error);
        res.status(500).json({ error: 'Failed to delete enrollment' });
    }
};