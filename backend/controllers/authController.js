const User = require('../model/User');
const generateToken = require('../utils/generatetoken');
const { successResponse, errorResponse } = require('../utils/response');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json(
                errorResponse('Invalid credentials')
            );
        }

        if (!user.isActive) {
            return res.status(401).json(
                errorResponse('Account is deactivated. Please contact administrator')
            );

        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json(
                errorResponse('Invalid credentials')
            );
        }

        await user.updateLastLogin();
        res.json(
            successResponse('Login successful', {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token: generateToken(user._id)
            })
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json(
            errorResponse('Server error during login')
        );
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(
            successResponse('User data retrieved', {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    lastLogin: user.lastLogin
                }
            })
        );
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json(
            errorResponse('Server error')
        );
    }
};