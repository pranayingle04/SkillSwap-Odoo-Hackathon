import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getUserProfile,
  updateUserProfile,
  searchUsersBySkill,
  getUserById,
} from '../controllers/user.controllers.js';

const router = express.Router();

router.get('/me', protect, getUserProfile);
router.patch('/me', protect, updateUserProfile);
router.get('/search', searchUsersBySkill);
router.get('/:id', getUserById);

export default router;
