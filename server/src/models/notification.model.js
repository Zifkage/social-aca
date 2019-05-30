import mongoose from 'mongoose';
import User from './user.model';

const NotificationSchema = new mongoose.Schema({
  author: {
    type: User.schema,
    required: true
  },
  targetUser: {
    type: String,
    required: true
  },
  targetEntity: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  body: {
    type: String,
    trim: true,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Number,
    default: Date.now
  }
});

export default mongoose.model('Notification', NotificationSchema);
