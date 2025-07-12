import express from 'express';
import {
  createSwap,
  acceptSwap,
  rejectSwap,
  deleteSwap,
  getUserSwaps,
  pollUpdates,
  submitFeedback,
} from '../controllers/swap.controllers.js';

import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.use(protect);

router.post('/', createSwap);
router.get('/', getUserSwaps);
router.get('/updates', pollUpdates);
router.patch('/:id/accept', acceptSwap);
router.patch('/:id/reject', rejectSwap);
router.post('/:id/feedback', protect, submitFeedback);
router.delete('/:id', deleteSwap);

export default router;
