// scripts/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

import User from '../models/User.models.js';
import SwapRequest from '../models/SwapRequest.models.js';
import AdminMessage from '../models/admin.models.js';

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(' MongoDB Connected');
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear old data
    await User.deleteMany();
    await SwapRequest.deleteMany();
    await AdminMessage.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create users
    const users = await User.insertMany([
      {
        name: 'Alice Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isPublic: true,
      },
      {
        name: 'Bob Builder',
        email: 'bob@example.com',
        password: hashedPassword,
        skillsOffered: ['Carpentry', 'Welding'],
        skillsWanted: ['Photoshop'],
        availability: { weekends: true },
        isPublic: true,
      },
      {
        name: 'Charlie Chef',
        email: 'charlie@example.com',
        password: hashedPassword,
        skillsOffered: ['Cooking'],
        skillsWanted: ['Excel'],
        availability: { evenings: true },
        isPublic: true,
      },
      {
        name: 'Dave Developer',
        email: 'dave@example.com',
        password: hashedPassword,
        skillsOffered: ['JavaScript', 'React'],
        skillsWanted: ['UI Design'],
        isPublic: true,
      },
      {
        name: 'Banned User',
        email: 'banned@example.com',
        password: hashedPassword,
        isBanned: true,
        isPublic: true,
      },
    ]);

    console.log('Users seeded');

    // Create swap requests
    await SwapRequest.insertMany([
      {
        fromUser: users[1]._id, // Bob → Charlie
        toUser: users[2]._id,
        offeredSkill: 'Carpentry',
        requestedSkill: 'Cooking',
        status: 'pending',
      },
      {
        fromUser: users[2]._id, // Charlie → Dave
        toUser: users[3]._id,
        offeredSkill: 'Cooking',
        requestedSkill: 'JavaScript',
        status: 'accepted',
        feedback: {
          fromUserRating: 5,
          fromUserComment: 'Loved the JS tips!',
          toUserRating: 4,
          toUserComment: 'Cooking session was great!',
        },
      },
      {
        fromUser: users[3]._id, // Dave → Bob
        toUser: users[1]._id,
        offeredSkill: 'React',
        requestedSkill: 'Welding',
        status: 'accepted',
        feedback: {
          fromUserRating: 4,
          fromUserComment: 'Bob is skilled and clear.',
          // ToUser hasn't rated yet
        },
      },
    ]);

    console.log('SwapRequests (with feedback) seeded');

    // Create admin messages
    await AdminMessage.insertMany([
      {
        message: ' System will be down for maintenance on Saturday.',
        type: 'downtime',
      },
      {
        message: ' New feature: Ratings and feedback added!',
        type: 'update',
      },
    ]);

    console.log(' AdminMessages seeded');

    process.exit();
  } catch (err) {
    console.error(' Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
