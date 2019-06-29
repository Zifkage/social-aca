import mongoose from 'mongoose';
import User from './user.model';
import Vote from './vote.model';

const ResponseSchema = new mongoose.Schema({
  author: {
    type: User.schema,
    required: [true, 'The response must be bind to the author'],
  },
  body: {
    type: String,
    required: [true, "The 'body' field is required"],
  },
  createdAt: {
    type: Number,
    default: Date.now,
  },
  solution: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  votes: [Vote.schema],
  file: '',
});

export default {
  model: mongoose.model('Response', ResponseSchema),
  schema: ResponseSchema,
};
