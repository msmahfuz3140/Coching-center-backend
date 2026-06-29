const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Upload thumbnail image
// @route   POST /api/upload/thumbnail
// @access  Private/Admin
exports.uploadThumbnail = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'course-thumbnails',
            width: 800,
            height: 450,
            crop: 'fill',
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Thumbnail uploaded successfully',
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Upload thumbnail error:', error);

        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Failed to upload thumbnail' });
    }
};

// @desc    Upload profile image
// @route   POST /api/upload/profile
// @access  Private
exports.uploadProfile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'profile-images',
            width: 400,
            height: 400,
            crop: 'fill',
        });

        // Delete local file
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Profile image uploaded successfully',
            imageUrl: result.secure_url,
        });
    } catch (error) {
        console.error('Upload profile error:', error);

        // Clean up file if it exists
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(500).json({ error: 'Failed to upload profile image' });
    }
};