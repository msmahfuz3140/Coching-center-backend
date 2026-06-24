const mongoose = require('mongoose');

const courseAccessSchema = new mongoose.Schema(
    {
        studentId: {
            type: String,
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        courseSlug: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'suspended', 'expired'],
            default: 'active',
        },
        grantedBy: {
            type: String,
            required: true,
        },
        grantedAt: {
            type: Date,
            default: Date.now,
        },
        expiresAt: {
            type: Date,
        },
        accessPages: {
            type: Number,
            default: 0, // 0 means full access
        },
        blocked: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('CourseAccess', courseAccessSchema);
