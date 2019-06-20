function create(req, res, db, create, generateErrorMessage) {
  res.set('Content-Type', 'application/json');
  return create(req, db, generateErrorMessage)
    .then(result => {
      res.status(201);
      res.json(result);
    })
    .catch(err => {
      if (err.name === 'ValidationError' || err.name === 'MongoError') {
        res.status(400);
        return res.json({ message: 'champ' });
      } else if (err.message === 'pastdate') {
        res.status(400);
        return res.json({ message: err.message });
      }
      res.status(500);
      res.json({ message: 'Internal Server Error' });
    });
}

export default create;
