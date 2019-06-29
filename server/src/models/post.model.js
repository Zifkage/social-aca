import mongoose from 'mongoose';
import User from './user.model';
import Response from './response.model';
import Vote from './vote.model';

const PostSchema = new mongoose.Schema({
  author: {
    type: User.schema,
    required: [true, 'The post must be bind to the author'],
  },
  title: {
    type: String,
    trim: true,
    required: [true, "The 'title' field is required"],
  },
  body: {
    type: String,
    required: [true, "The 'body' field is required"],
  },
  responses: [Response.schema],
  votes: [Vote.schema],
  createdAt: {
    type: Number,
    default: Date.now,
  },
  course: {
    type: String,
    required: true,
  },
  file: '',
});

export default mongoose.model('Post', PostSchema);
