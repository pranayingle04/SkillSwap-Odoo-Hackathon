import User from '../models/User.models.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils.js';

// Register Controller
export const register = async (req, res) => {
  const {
    name,
    email,
    password,
    location,
    profilePhoto,
    skillsOffered,
    skillsWanted,
    availability,
    isPublic,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      location,
      profilePhoto,
      skillsOffered: skillsOffered || [],
      skillsWanted: skillsWanted || [],
      availability: availability || {},
      isPublic: isPublic !== undefined ? isPublic : true,
    });

    const token = generateToken(user._id); // pass user._id, not user object

    res.status(201).json({
      user: {
        ...user.toObject(),
        password: undefined,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    if (user.isBanned) return res.status(403).json({ message: 'Your account has been banned' });

    const token = generateToken(user._id);

    res.json({
      user: {
        ...user.toObject(),
        password: undefined,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
