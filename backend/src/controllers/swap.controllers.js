import SwapRequest from '../models/SwapRequest.models.js';

//Create a new swap request
export const createSwap = async (req, res) => {
  const { toUser, offeredSkill, requestedSkill } = req.body;

  if (!toUser || !offeredSkill || !requestedSkill) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (toUser === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot request swap with yourself' });
  }

  try {
    const existing = await SwapRequest.findOne({
      fromUser: req.user._id,
      toUser,
      offeredSkill,
      requestedSkill,
      status: 'pending',
    });

    if (existing) return res.status(400).json({ message: 'Swap request already exists' });

    const swap = await SwapRequest.create({
      fromUser: req.user._id,
      toUser,
      offeredSkill,
      requestedSkill,
    });

    res.status(201).json({ message: 'Swap request sent', swap });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Accept a swap request
export const acceptSwap = async (req, res) => {
  const { id } = req.params;

  try {
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    swap.status = 'accepted';
    await swap.save();

    res.json({ message: 'Swap accepted', swap });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting swap', error: err.message });
  }
};

//Reject a swap request
export const rejectSwap = async (req, res) => {
  const { id } = req.params;

  try {
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    swap.status = 'rejected';
    await swap.save();

    res.json({ message: 'Swap rejected', swap });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting swap', error: err.message });
  }
};

// Delete or cancel a swap request
export const deleteSwap = async (req, res) => {
  const { id } = req.params;

  try {
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    const isOwner =
      swap.fromUser.toString() === req.user._id.toString() ||
      swap.toUser.toString() === req.user._id.toString();

    if (!isOwner) return res.status(403).json({ message: 'Unauthorized action' });

    await swap.deleteOne();
    res.json({ message: 'Swap deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting swap', error: err.message });
  }
};

// Get all swaps for current user (paginated)
export const getUserSwaps = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const query = {
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }],
    };

    const swaps = await SwapRequest.find(query)
      .populate('fromUser', 'name profilePhoto')
      .populate('toUser', 'name profilePhoto')
      .sort({ updatedAt: -1 })
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

// Poll for new swap updates
export const pollUpdates = async (req, res) => {
  const { since } = req.query;

  try {
    const swaps = await SwapRequest.find({
      toUser: req.user._id,
      updatedAt: { $gt: new Date(since) },
    }).populate('fromUser', 'name profilePhoto');

    res.json({ updates: swaps });
  } catch (err) {
    res.status(500).json({ message: 'Polling error', error: err.message });
  }
};

// controllers/swapController.js
export const submitFeedback = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  try {
    const swap = await SwapRequest.findById(id);
    if (!swap) return res.status(404).json({ message: 'Swap not found' });

    if (swap.status !== 'accepted') {
      return res.status(400).json({ message: 'Feedback only allowed on accepted swaps' });
    }

    if (swap.fromUser.toString() === req.user._id.toString()) {
      swap.feedback.fromUserRating = rating;
      swap.feedback.fromUserComment = comment;
    } else if (swap.toUser.toString() === req.user._id.toString()) {
      swap.feedback.toUserRating = rating;
      swap.feedback.toUserComment = comment;
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await swap.save();
    res.json({ message: 'Feedback submitted', swap });
  } catch (err) {
    res.status(500).json({ message: 'Feedback error', error: err.message });
  }
};
