const express = require('express');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const verifyAdmin = require('../middleware/adminMiddleware');

const router = express.Router();

// Public Routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected Routes
router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);
router.put('/change-password', protect, userController.changePassword);
router.get('/me', protect, userController.getCurrentUser);
router.get('/recipes', protect, userController.getUserRecipes);

// Admin-only Routes (Using verifyAdmin middleware)
router.post('/register-admin', protect, verifyAdmin, userController.registerUser);
router.delete('/:id', protect, verifyAdmin, userController.deleteUser); 
router.get('/', protect, verifyAdmin, userController.getAllUsers);
router.put('/:id', protect, verifyAdmin, userController.updateUserByAdmin);
router.delete('/:id', protect, verifyAdmin, userController.deleteUserByAdmin);


module.exports = router;
