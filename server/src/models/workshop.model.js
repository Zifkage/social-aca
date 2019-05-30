import mongoose from 'mongoose';
import User from './user.model';

const WorkshopSchema = new mongoose.Schema({
  author: {
    type: User.schema,
    required: [true, 'The workshop must be bind to the author']
  },
  dateStart: {
    type: String,
    required: [true, "The 'dateStart' field is missing"]
  },
  duration: {
    type: String,
    required: [true, "The 'duration' field is missing"]
  },
  title: {
    type: String,
    required: [true, "The 'title' field is missing"]
  },
  description: {
    type: String,
    required: [true, "The 'description' field is missing"]
  },
  location: {
    type: String,
    required: [true, "The 'location' field is missing"]
  },
  participants: [User.schema],
  createdAt: {
    type: Number,
    default: Date.now
  },
  course: {
    type: String,
    required: true
  }
});

export default mongoose.model('Workshop', WorkshopSchema);
