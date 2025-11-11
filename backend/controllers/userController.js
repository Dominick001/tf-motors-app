const User = require('../model/User');
const { successResponse, errorResponse } = require('../utils/response');

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json(
                errorResponse('User already exists with this email')
            );
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            createdBy: req.user.id
        });

        res.status(201).json(
            successResponse('User created successfully', {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive
                }
            })
        );
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json(
            errorResponse('Server error during user creation')
        );

    }
};

exports.getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;
        const query = {};
        if (role) {
            query.role = role;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json(
            successResponse('User retrieved successfully', {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalUsers: total
                }
            })
        );

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json(
            errorResponse('Server error fetching users')
        );
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, role, isActive, password } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json(
                errorResponse('User not found')
            );
        }

        if (id === req.user.id && (role || isActive !== undefined)) {
            return res.status(400).json(
                errorResponse('Cannot modify your own role or status')
            );
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (role) updateData.role = role;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (password && password.length >= 6) updateData.password = password;

        const updatedUser = await User.findByIdAndDelete(
            id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json(
            successResponse('User updated successfully', {
                user: updatedUser
            })
        );
    } catch (error) {
        console.error('Update user error:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json(
                errorResponse('Validation Error', error.errors)
            );
        }
        res.status(500).json(
            errorResponse('Server error during user update')
        );
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (id === req.user.id) {
            return res.status(400).json(
                errorResponse('Cannot delete your own account')
            );
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json(
                errorResponse('User not found')
            );
        }

        if (user.role === 'admin' && req.user.role !== 'admin') {
            return res.status(403).json(
                errorResponse('Only admin cna delete admin users')
            );
        }

        await User.findByIdAndDelete(id);

        res.json(
            successResponse('User deleted successfully')
        );

    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json(
            errorResponse('Server error during user deletion')
        );
    }
};