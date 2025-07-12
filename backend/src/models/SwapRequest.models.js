import mongoose from 'mongoose';

const swapRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredSkill: { type: String, required: true },
    requestedSkill: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
    },
    feedback: {
      fromUserRating: { type: Number, min: 1, max: 5 },
      fromUserComment: String,
      toUserRating: { type: Number, min: 1, max: 5 },
      toUserComment: String,
    },
  },
  { timestamps: true }
); // enables polling with `createdAt`/`updatedAt`

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
