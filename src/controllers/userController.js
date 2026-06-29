const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

// @desc    Update current user profile
// @route   PATCH /api/users/me
// @access  Private
exports.updateMe = async (req, res) => {
    try {
        const { name, email, image } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (email) user.email = email;
        if (image !== undefined) user.image = image;

        await user.save();
        await user.populate('role');

        res.json({
            message: 'Profile updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// @desc    Get all users (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        let query = {};
        if (role) query.role = role;

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ success: true, users });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

// @desc    Update user (Admin)
// @route   PATCH /api/admin/users
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const { userId, role, isBlocked } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (role) user.role = role;
        if (isBlocked !== undefined) user.isBlocked = isBlocked;

        await user.save();
        await user.populate('role');

        res.json({
            message: 'User updated successfully',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/admin/users
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.query;

        await User.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};