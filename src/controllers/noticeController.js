const Notice = require('../models/Notice');
const Course = require('../models/Course');

// @desc    Get all notices (public/student)
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res) => {
    try {
        const { courseId } = req.query;
        let query = {};
        if (courseId) query.courseId = courseId;

        const notices = await Notice.find(query)
            .populate('courseId', 'title slug')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(notices);
    } catch (error) {
        console.error('Get notices error:', error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
};

// @desc    Get all notices (Admin)
// @route   GET /api/admin/notices
// @access  Private/Admin
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.find()
            .populate('courseId', 'title slug')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(notices);
    } catch (error) {
        console.error('Get all notices error:', error);
        res.status(500).json({ error: 'Failed to fetch notices' });
    }
};

// @desc    Create notice
// @route   POST /api/admin/notices
// @access  Private/Admin
exports.createNotice = async (req, res) => {
    try {
        const { title, content, priority, courseId } = req.body;
        const createdBy = req.user.id;

        const notice = await Notice.create({
            title,
            content,
            priority: priority || 'NORMAL',
            courseId: courseId || null,
            createdBy,
        });

        await notice.populate('courseId', 'title slug');
        await notice.populate('createdBy', 'name');

        res.status(201).json({
            message: 'Notice created successfully',
            notice
        });
    } catch (error) {
        console.error('Create notice error:', error);
        res.status(500).json({ error: 'Failed to create notice' });
    }
};

// @desc    Update notice
// @route   PATCH /api/admin/notices/:id
// @access  Private/Admin
exports.updateNotice = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, priority, courseId } = req.body;

        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ error: 'Notice not found' });
        }

        notice.title = title || notice.title;
        notice.content = content || notice.content;
        if (priority) notice.priority = priority;
        if (courseId !== undefined) notice.courseId = courseId;

        await notice.save();
        await notice.populate('courseId', 'title slug');
        await notice.populate('createdBy', 'name');

        res.json({
            message: 'Notice updated successfully',
            notice
        });
    } catch (error) {
        console.error('Update notice error:', error);
        res.status(500).json({ error: 'Failed to update notice' });
    }
};

// @desc    Delete notice
// @route   DELETE /api/admin/notices/:id
// @access  Private/Admin
exports.deleteNotice = async (req, res) => {
    try {
        const { id } = req.params;

        await Notice.findByIdAndDelete(id);
        res.json({ message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Delete notice error:', error);
        res.status(500).json({ error: 'Failed to delete notice' });
    }
};