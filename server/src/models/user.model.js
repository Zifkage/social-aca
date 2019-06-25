import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    match: [/^[\w\.+]+@\w+\.\w+$/, "The 'email' field must be a valid email"],
    required: [true, "The 'email' field is missing"],
  },
  password: {
    type: String,
    required: [true, "The 'password' field is missing"],
  },
  name: { type: String, required: [true, "The 'name' field is missing"] },
  contact: { type: String, required: [true, "The 'contact' field is missing"] },
  bio: { type: String, required: [true, "The 'bio' field is missing"] },
  followers: [],
  following: [],
  trackcourses: [],
  points: {
    type: Number,
    default: 0,
  },
  admin: false,
  createdAt: {
    type: Number,
    default: Date.now,
  },
  updatedAt: Number,
  notes: [],
});

export default {
  model: mongoose.model('User', UserSchema),
  schema: UserSchema,
};
