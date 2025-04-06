import express from 'express';
import {
  authUser,
  getUserProfile,
  registerUser,
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// @route   POST /api/users
router.post('/', registerUser);

// @route   POST /api/users/signup
router.post('/signup', registerUser);

// @route   POST /api/users/login
router.post('/login', authUser);

// @route   GET /api/users/profile
// Protected route - requires authentication
router.get('/profile', protect, getUserProfile);

export default router;
