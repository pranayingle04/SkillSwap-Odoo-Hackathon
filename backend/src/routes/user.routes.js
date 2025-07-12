import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getUserProfile,
  updateUserProfile,
  searchUsersBySkill,
  getUserById,
  getUserRating
} from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/me', protect, getUserProfile);
router.patch('/me', protect, updateUserProfile);
router.get('/search', protect, searchUsersBySkill);
router.get('/:id', protect, getUserById);
router.get('/:id/rating', protect, getUserRating);

export default router;
