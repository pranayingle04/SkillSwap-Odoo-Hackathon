import mongoose from 'mongoose';

const adminMessageSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['update', 'downtime', 'alert'],
      default: 'update',
    },
  },
  { timestamps: true }
);

const AdminMessage = mongoose.model('AdminMessage', adminMessageSchema);

export default AdminMessage;
