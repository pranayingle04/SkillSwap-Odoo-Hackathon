// routes/adminRoutes.js
import express from 'express';
import {
  banUser,
  rejectSkills,
  getSwaps,
  sendMessage,
  getMessages,
  downloadUserReportAsPDF,
  getAllUsers,
} from '../controllers/admin.controllers.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply protection and admin check to all routes
router.use(protect, isAdmin);

//get all user
router.get('/users', getAllUsers)
// Ban or unban a user
router.patch('/ban-user/:id', banUser);

// Clear inappropriate skill descriptions
router.patch('/reject-skills/:id', rejectSkills);

// Get all swaps by status (pending, accepted, cancelled)
router.get('/swaps', getSwaps);

// Broadcast a message to all users
router.post('/messages', sendMessage);

// Get all platform-wide messages
router.get('/messages', getMessages);

// Download all users as pdf
router.get('/reports/users/pdf', isAdmin, downloadUserReportAsPDF);



export default router;
