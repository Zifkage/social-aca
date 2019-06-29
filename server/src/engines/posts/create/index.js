function create(req, db, generateErrorMessage) {
  return new Promise((resolve, reject) => {
    db.Post.create({
      ...req.body,
      author: db.currentUser[req.get('token')],
    })
      .then((post) => resolve(post))
      .catch((err) => {
        err.message = generateErrorMessage(err);
        reject(err);
      });
  });
}

export default create;
