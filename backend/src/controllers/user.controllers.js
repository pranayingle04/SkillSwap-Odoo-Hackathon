import User from '../models/User.models.js';
import SwapRequest from '../models/SwapRequest.models.js';


// Get user's profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile', error: err.message });
  }
};

// Update logged-in user's profile
export const updateUserProfile = async (req, res) => {
  const updateFields = {
    name: req.body.name,
    location: req.body.location,
    profilePhoto: req.body.profilePhoto,
    skillsOffered: req.body.skillsOffered,
    skillsWanted: req.body.skillsWanted,
    availability: req.body.availability,
    isPublic: req.body.isPublic,
  };

  // Remove undefined fields
  Object.keys(updateFields).forEach(
    (key) => updateFields[key] === undefined && delete updateFields[key]
  );

  try {
    const user = await User.findByIdAndUpdate(req.user._id, updateFields, { new: true }).select(
      '-password'
    );
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};


// Search users by skill (skillsOffered or skillsWanted) with pagination
export const searchUsersBySkill = async (req, res) => {
  const { skill, page = 1, limit = 10 } = req.query;

  if (!skill) return res.status(400).json({ message: 'Skill query parameter is required' });

  const query = {
    isPublic: true,
    isBanned: false,
    $or: [{ skillsOffered: skill }, { skillsWanted: skill }],
  };

  try {
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// Get public profile by user id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user || user.isBanned || !user.isPublic) {
      return res.status(404).json({ message: 'User not found or not public' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

export const getUserRating = async (req, res) => {
  const { id } = req.params;

  const swaps = await SwapRequest.find({
    $or: [{ fromUser: id }, { toUser: id }],
    status: 'accepted',
  });

  const ratings = swaps.reduce(
    (acc, swap) => {
      if (swap.fromUser.toString() === id && swap.feedback?.toUserRating) {
        acc.total += swap.feedback.toUserRating;
        acc.count++;
      }
      if (swap.toUser.toString() === id && swap.feedback?.fromUserRating) {
        acc.total += swap.feedback.fromUserRating;
        acc.count++;
      }
      return acc;
    },
    { total: 0, count: 0 }
  );

  const avgRating = ratings.count ? (ratings.total / ratings.count).toFixed(1) : null;

  res.json({ averageRating: avgRating });
};
