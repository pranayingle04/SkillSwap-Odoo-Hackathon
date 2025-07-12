import User from '../models/User.models.js';
import SwapRequest from '../models/SwapRequest.models.js';
import AdminMessage from '../models/admin.models.js';
import PDFDocument from 'pdfkit';

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  const query = {
    name: { $regex: search, $options: 'i' },
  };

  try {
    const users = await User.find(query)
      .select('-password -__v')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Ban or Unban a User
export const banUser = async (req, res) => {
  const { id } = req.params;
  const { ban } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, { isBanned: ban }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: ban ? 'User banned' : 'User unbanned', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Reject Inappropriate Skills
export const rejectSkills = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        skillsOffered: [],
        skillsWanted: [],
      },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'Skills cleared by admin', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Monitor Swaps by Status with pagination
export const getSwaps = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};

  try {
    const swaps = await SwapRequest.find(query)
      .populate('fromUser', 'name email')
      .populate('toUser', 'name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await SwapRequest.countDocuments(query);

    res.json({
      swaps,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching swaps', error: err.message });
  }
};

// Send Platform-Wide Message
export const sendMessage = async (req, res) => {
  const { message, type } = req.body;

  if (!message) return res.status(400).json({ message: 'Message is required' });

  try {
    const newMessage = await AdminMessage.create({ message, type });
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// All Admin Messages polling supported
export const getMessages = async (req, res) => {
  const { since } = req.query;

  try {
    const query = since ? { createdAt: { $gt: new Date(since) } } : {};
    const messages = await AdminMessage.find(query).sort({ createdAt: -1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// Download Users Report using pdf 

export const downloadUserReportAsPDF = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    const doc = new PDFDocument({ margin: 30 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=user-report.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('User Report', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text('Name | Email | Role | Banned | Public', { underline: true });
    doc.moveDown(0.5);

    users.forEach((user) => {
      const line = `${user.name} | ${user.email} | ${user.role} | ${user.isBanned ? 'Yes' : 'No'} | ${
        user.isPublic ? 'Yes' : 'No'
      }`;
      doc.text(line);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate PDF', error: err.message });
  }
};
