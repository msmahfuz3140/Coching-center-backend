const Course = require('../models/Course');
const CourseAccess = require('../models/CourseAccess');
const CourseRequest = require('../models/CourseRequest');

// Admin: Create Course
const createCourse = async (req, res) => {
    try {
        const { title, slug, description, category, syllabus, youtubeVideoId, youtubePlaylistId, instructor } = req.body;

        if (!title || !slug || !category) {
            return res.status(400).json({ message: 'Title, slug, and category are required' });
        }

        const existingCourse = await Course.findOne({ slug });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course with this slug already exists' });
        }

        const course = new Course({
            title,
            slug,
            description,
            category,
            syllabus,
            youtubeVideoId,
            youtubePlaylistId,
            instructor,
            createdBy: req.user.id,
        });

        await course.save();
        res.status(201).json({ success: true, course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update Course
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, syllabus, youtubeVideoId, youtubePlaylistId, instructor, isActive } = req.body;

        const course = await Course.findByIdAndUpdate(
            id,
            {
                title,
                description,
                category,
                syllabus,
                youtubeVideoId,
                youtubePlaylistId,
                instructor,
                isActive,
            },
            { new: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete Course
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findByIdAndDelete(id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Delete related data
        await CourseAccess.deleteMany({ courseId: id });
        await CourseRequest.deleteMany({ courseId: id });

        res.json({ success: true, message: 'Course deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Courses (Public)
const getAllCourses = async (req, res) => {
    try {
        const { category } = req.query;
        const filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        const courses = await Course.find(filter).select('-syllabus -youtubePlaylistId');
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Course by Slug (Public)
const getCourseBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const course = await Course.findOne({ slug, isActive: true });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if user has access
        let hasAccess = false;
        if (req.user) {
            const access = await CourseAccess.findOne({
                studentId: req.user.id,
                courseId: course._id,
                status: 'active',
            });
            hasAccess = !!access;
        }

        res.json({ success: true, course, hasAccess });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Student: Request Course Access
const requestCourseAccess = async (req, res) => {
    try {
        const { courseSlug } = req.params;
        const { requestMessage } = req.body;

        const course = await Course.findOne({ slug: courseSlug });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if already requested
        const existingRequest = await CourseRequest.findOne({
            studentId: req.user.id,
            courseId: course._id,
            status: 'pending',
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Access request already pending' });
        }

        // Check if already has access
        const hasAccess = await CourseAccess.findOne({
            studentId: req.user.id,
            courseId: course._id,
        });

        if (hasAccess) {
            return res.status(400).json({ message: 'Already have access to this course' });
        }

        const request = new CourseRequest({
            studentId: req.user.id,
            studentEmail: req.user.email,
            courseId: course._id,
            courseSlug,
            requestMessage,
        });

        await request.save();
        res.status(201).json({ success: true, message: 'Request sent', request });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Get Pending Requests
const getPendingRequests = async (req, res) => {
    try {
        const requests = await CourseRequest.find({ status: 'pending' })
            .populate('courseId', 'title category')
            .sort({ createdAt: -1 });

        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Approve Course Access
const approveCourseAccess = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { responseMessage, accessPages = 0, expiresAt } = req.body;

        const request = await CourseRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Create access record with optional limits
        const access = new CourseAccess({
            studentId: request.studentId,
            studentEmail: request.studentEmail,
            courseId: request.courseId,
            courseSlug: request.courseSlug,
            grantedBy: req.user.id,
            accessPages: accessPages || 0,
            expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        });

        await access.save();

        // Update request status
        request.status = 'approved';
        request.responseMessage = responseMessage;
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({ success: true, message: 'Access approved', access });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update an access record (pages, expiry)
const updateAccess = async (req, res) => {
    try {
        const { accessId } = req.params;
        const { accessPages, expiresAt } = req.body;

        const access = await CourseAccess.findById(accessId);
        if (!access) return res.status(404).json({ message: 'Access record not found' });

        if (typeof accessPages !== 'undefined') access.accessPages = accessPages;
        if (typeof expiresAt !== 'undefined') access.expiresAt = expiresAt ? new Date(expiresAt) : undefined;

        await access.save();
        res.json({ success: true, access });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Block or unblock an access record
const blockAccess = async (req, res) => {
    try {
        const { accessId } = req.params;
        const { blocked } = req.body; // boolean

        const access = await CourseAccess.findById(accessId);
        if (!access) return res.status(404).json({ message: 'Access record not found' });

        access.blocked = !!blocked;
        await access.save();

        res.json({ success: true, access });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: List access records
const getAccessRecords = async (req, res) => {
    try {
        const accesses = await CourseAccess.find().populate('courseId', 'title slug').sort({ createdAt: -1 });
        res.json({ success: true, accesses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete access record
const deleteAccess = async (req, res) => {
    try {
        const { accessId } = req.params;
        const access = await CourseAccess.findByIdAndDelete(accessId);
        if (!access) return res.status(404).json({ message: 'Access record not found' });
        res.json({ success: true, message: 'Access deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Reject Course Access
const rejectCourseAccess = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { responseMessage } = req.body;

        const request = await CourseRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = 'rejected';
        request.responseMessage = responseMessage;
        request.reviewedBy = req.user.id;
        request.reviewedAt = new Date();
        await request.save();

        res.json({ success: true, message: 'Request rejected' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
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
};
