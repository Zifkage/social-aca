import User from './user.model';
import Post from './post.model';
import Response from './response.model';
import Vote from './vote.model';
import Workshop from './workshop.model';
import Notification from './notification.model';

const models = {
  User: User.model,
  Post,
  Response: Response.model,
  Vote: Vote.model,
  currentUser: {},
  Workshop,
  Notification
};

export default models;
