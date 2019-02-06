import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import engines from './engines';
import injectHandlerDependencies from './utils/inject-handler-dependencies';
import handlers from './handlers';
import generateErrorMessage from './system-messages/errors';
import mongoose from 'mongoose';
import db from './models';

const handlerToEngineMap = new Map([
  [handlers.users.create, engines.users.create],
  [handlers.users.retrieve, engines.users.retrieve],
  [handlers.posts.create, engines.posts.create],
  [handlers.posts.retrieve, engines.posts.retrieve],
  [handlers.posts.delete, engines.posts.delete],
  [handlers.posts.list, engines.posts.list],
]);

const app = express();

app.use(cors());

// Connection to mlab
mongoose.Promise = global.Promise;
mongoose.connect(`${process.env.MONGODB_HOST}`, { useNewUrlParser: true });
mongoose.connection.on('error', () => {
  throw new Error('Unable to connect to database!');
});

app.use(bodyParser.json({ limit: 1e6 }));

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);
app.use(checkContentTypeIsJson);

// USERS
app.post(
  '/users',
  injectHandlerDependencies(
    handlers.users.create,
    db,
    handlerToEngineMap,
    generateErrorMessage,
  ),
);

app.get(
  '/users/:userId',
  injectHandlerDependencies(handlers.users.retrieve, db, handlerToEngineMap),
);

// POSTS
app.post(
  '/posts',
  injectHandlerDependencies(
    handlers.posts.create,
    db,
    handlerToEngineMap,
    generateErrorMessage,
  ),
);

app.get(
  '/posts/:postId',
  injectHandlerDependencies(handlers.posts.retrieve, db, handlerToEngineMap),
);

app.get(
  '/posts',
  injectHandlerDependencies(handlers.posts.list, db, handlerToEngineMap),
);

app.delete(
  '/posts',
  injectHandlerDependencies(handlers.posts.delete, db, handlerToEngineMap),
);

app.use(handlers.errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Social-Aca API server listening on port ${process.env.SERVER_PORT}!`,
  );
});
