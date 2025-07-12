import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: String,
    profilePhoto: String,
    skillsOffered: [String],
    skillsWanted: [String],
    availability: {
      weekends: {
        type: Boolean,
        default: false,
      },
      evenings: {
        type: Boolean,
        default: false,
      },
      custom: String,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
