const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: [
                'Diploma',
                'DUET Tech',
                'DUET Non-Tech',
                'SSC 9-10',
                'Polytechnic Admission',
                'Referred batch',
            ],
            required: true,
        },
        syllabus: {
            type: String,
        },
        youtubeVideoId: {
            type: String,
        },
        youtubePlaylistId: {
            type: String,
        },
        instructor: {
            type: String,
        },
        price: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
