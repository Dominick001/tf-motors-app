const express = require('express');
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { authValidation, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager'));

router.post('/', authValidation.register, handleValidationErrors, createUser);
router.get('/', getUsers);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;