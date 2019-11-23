import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    // Notification content
    content: {
      type: String,
      required: true,
    },
    // User destinated
    user: {
      type: Number,
      required: true,
    },
    // If read
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    // all registers will have "created_at" and "updated_at"
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema);
