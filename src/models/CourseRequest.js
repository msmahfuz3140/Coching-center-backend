const mongoose = require('mongoose');

const courseRequestSchema = new mongoose.Schema(
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
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        requestMessage: {
            type: String,
        },
        responseMessage: {
            type: String,
        },
        reviewedBy: {
            type: String,
        },
        reviewedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('CourseRequest', courseRequestSchema);
