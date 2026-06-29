const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING',
    },
    requestMessage: {
        type: String,
        default: null,
    },
    responseMessage: {
        type: String,
        default: null,
    },
    enrolledAt: {
        type: Date,
        default: Date.now,
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
    },
});

// Prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);