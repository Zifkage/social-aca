import '@babel/polyfill';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import checkEmptyPayload from './middlewares/check-empty-payload';
import checkContentTypeIsJson from './middlewares/check-content-type-is-json';
import checkContentTypeIsSet from './middlewares/check-content-type-is-set';
import checkUserAuth from './middlewares/check-user-auth';
import engines from './engines';
import injectHandlerDependencies from './utils/inject-handler-dependencies';
import handlers from './handlers';
import generateErrorMessage from './system-messages/errors';
import mongoose from 'mongoose';
import db from './models';
import multer from 'multer';

let currentFile;

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'public');
  },
  filename: function(req, file, cb) {
    currentFile = Date.now() + '-' + file.originalname;
    cb(null, currentFile);
  },
});

let upload = multer({ storage: storage }).single('file');

const handlerToEngineMap = new Map([
  [handlers.users.create, engines.users.create],
  [handlers.users.retrieve, engines.users.retrieve],
  [handlers.posts.create, engines.posts.create],
  [handlers.posts.retrieve, engines.posts.retrieve],
  [handlers.posts.delete, engines.posts.delete],
  [handlers.posts.list, engines.posts.list],
  [handlers.auth.login, engines.auth.login],
  [handlers.responses.create, engines.responses.create],
  [handlers.responses.vote, engines.responses.vote],
  [handlers.posts.vote, engines.posts.vote],
  [handlers.posts.solve, engines.posts.solve],
  [handlers.workshops.create, engines.workshops.create],
  [handlers.workshops.retrieve, engines.workshops.retrieve],
  [handlers.workshops.participate, engines.workshops.participate],
  [handlers.workshops.list, engines.workshops.list],
  [handlers.users.list, engines.users.list],
  [handlers.users.follow, engines.users.follow],
]);

const app = express();

app.use(cors());

// Connection to mlab
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://localhost:27017/social-aca`, {
  useNewUrlParser: true,
});
mongoose.connection.on('error', (e) => {
  throw new Error(e);
});

app.use('/file', express.static('public'));
app.use(bodyParser.json({ limit: 1e6 }));

app.use(checkEmptyPayload);
app.use(checkContentTypeIsSet);

app.get('/notifications/:userId', (req, res) => {
  db.Notification.find({
    targetUser: req.params.userId,
  })
    .then(async (notifs) => {
      if (notifs.length === 0) return res.json(notifs);
      await db.Notification.updateMany(
        {
          targetUser: req.params.userId,
        },
        { read: true },
      );
      res.json(notifs);
    })
    .catch((err) => res.send(err));
});

app.get('/participations/:userId', async (req, res) => {
  const w = await db.Workshop.find();
  const uW = w.filter(
    (w) =>
      w.participants.findIndex(
        (p) => p._id.toString() === req.params.userId,
      ) !== -1,
  );
  res.json(uW);
});

app.post('/note/:workshopId', async (req, res) => {
  const w = await db.Workshop.findById(req.params.workshopId);
  const author = await db.User.findById(w.author._id);
  const noteIndex = w.notes.findIndex((n) => n.userId === req.body.userId);
  if (noteIndex !== -1)
    return res.status(400).json({ message: 'already note' });
  author.notes.push(req.body.note);
  await author.save();
  w.notes.push({
    point: req.body.note,
    userId: req.body.userId,
  });
  w.save((err) => {
    if (err) {
      return res.status(400).send(err);
    }

    res.send('OK');
  });
});

app.post('/trackcourses/:userId', (req, res) => {
  db.User.findOneAndUpdate(
    {
      _id: req.params.userId,
    },
    { trackcourses: req.body.courses },
  )
    .then((result) => res.json(result))
    .catch((err) => res.send(err));
});

app.get('/trackcourses/:userId', (req, res) => {
  db.User.find({
    _id: req.params.userId,
  })
    .then((result) => res.json({ courses: result[0].trackcourses }))
    .catch((err) => res.send(err));
});

app.get('/top', async (req, res) => {
  const users = await db.User.find();
  if (users.length === 0) return res.json(users);
  let sortedUsers = users.sort((a, b) => b.points - a.points);
  sortedUsers = sortedUsers.filter((u) => !u.admin);
  res.json(sortedUsers);
});

app.get('/mytd/:userId', async (req, res) => {
  let td = await db.Workshop.find();
  td = td.filter((t) => t.author._id.toString() === req.params.userId);
  res.json(td);
});

app.get('/mypb/:userId', async (req, res) => {
  let posts = await db.Post.find();
  posts = posts.filter((p) => p.author._id.toString() === req.params.userId);
  res.json(posts);
});

app.get('/td', async (req, res) => {
  if (!req.query.search) {
    let td = await db.Workshop.find();
    return res.json(td);
  }

  let td = await db.Workshop.find({
    title: { $regex: req.query.search, $options: 'i' },
  });
  return res.json(td);
});

app.delete('/td', async (req, res) => {
  res.json(await db.Workshop.deleteOne({ _id: req.query.id }));
});

app.delete('/pb', async (req, res) => {
  res.json(await db.Post.deleteOne({ _id: req.query.id }));
});

app.get('/pb', async (req, res) => {
  if (!req.query.search) {
    let posts = await db.Post.find();
    return res.json(posts);
  }

  let posts = await db.Post.find({
    title: { $regex: req.query.search, $options: 'i' },
  });
  return res.json(posts);
});

app.get('/user-search', async (req, res) => {
  if (!req.query.search) {
    let users = await db.User.find();
    users = users.filter((u) => !u.admin);
    return res.json(users);
  }

  let users = await db.User.find({
    name: { $regex: req.query.search, $options: 'i' },
  });
  users = users.filter((u) => !u.admin);

  return res.json(users);
});

app.delete('/user', async (req, res) => {
  res.json(await db.User.deleteOne({ _id: req.query.id }));
});

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

app.get(
  '/users',
  injectHandlerDependencies(handlers.users.list, db, handlerToEngineMap),
);

app.post(
  '/users/follow/:userId',
  checkUserAuth(db),
  injectHandlerDependencies(handlers.users.follow, db, handlerToEngineMap),
);

// POSTS
app.post('/posts', (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    db.Post.create({
      ...req.body,
      file: req.file ? currentFile : '',
      author: db.currentUser[req.get('token')],
    });
    return res.status(200).send(req.file);
  });
});

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

app.post(
  '/posts/:postId/vote',
  checkUserAuth(db),
  injectHandlerDependencies(
    handlers.posts.vote,
    db,
    handlerToEngineMap,
    generateErrorMessage,
  ),
);

app.patch(
  '/posts/:postId/:responseId/solve',
  checkUserAuth(db),
  injectHandlerDependencies(handlers.posts.solve, db, handlerToEngineMap),
);

// RESPONSE
app.post('/responses/:postId', (req, res) => {
  upload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    db.Post.findOne({ _id: req.params.postId }).then((post) => {
      const cU = db.currentUser[req.get('token')];
      const response = new db.Response({
        ...req.body,
        file: req.file ? currentFile : '',
      });
      response.author = cU;

      post.responses.push(response);

      post.save((err) => {
        if (err) {
          throw err;
        }
        if (cU._id !== post.author._id) {
          const notification = new db.Notification({
            author: cU,
            targetUser: post.author._id,
            type: 'RESPONSE',
            targetEntity: post._id,
            body: `${cU.name} a répondu a une de vos préoccupations`,
          });
          notification.save((err) => {
            if (err) throw err;
            return res.status(200).send(req.file);
          });
        }
      });
    });
  });
});

app.post(
  '/responses/:postId/:responseId/vote',
  checkUserAuth(db),
  injectHandlerDependencies(
    handlers.responses.vote,
    db,
    handlerToEngineMap,
    generateErrorMessage,
  ),
);

// WORKSHOP
app.post(
  '/workshops',
  checkUserAuth(db),
  injectHandlerDependencies(
    handlers.workshops.create,
    db,
    handlerToEngineMap,
    generateErrorMessage,
  ),
);

app.get(
  '/workshops/:workshopId',
  injectHandlerDependencies(
    handlers.workshops.retrieve,
    db,
    handlerToEngineMap,
  ),
);

app.patch(
  '/workshops/:workshopId/participate',
  checkUserAuth(db),
  injectHandlerDependencies(
    handlers.workshops.participate,
    db,
    handlerToEngineMap,
  ),
);

app.get(
  '/workshops',
  injectHandlerDependencies(handlers.workshops.list, db, handlerToEngineMap),
);

// AUTH
app.post(
  '/login',
  injectHandlerDependencies(handlers.auth.login, db, handlerToEngineMap),
);

app.post('/logout', function(req, res) {
  const token = req.get('token');
  delete db.currentUser[token];
  res.status(200);
  res.json({ message: 'OK' });
});

app.use(handlers.errorHandler);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Social-Aca API server listening on port ${process.env.SERVER_PORT}!`,
  );
});
