const express = require('express');
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/login', authValidation.login, handleValidationErrors, login);
router.get('/me', protect, getMe);

module.exports = router;