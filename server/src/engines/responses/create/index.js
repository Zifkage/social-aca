function create(req, db, generateErrorMessage) {
  return new Promise((resolve, reject) => {
    db.Post.findOne({ _id: req.params.postId })
      .then(post => {
        const cU = db.currentUser[req.get('token')];
        const response = new db.Response(req.body);
        response.author = cU;

        post.responses.push(response);

        post.save(err => {
          if (err) {
            throw err;
          }
          if (cU._id !== post.author._id) {
            const notification = new db.Notification({
              author: cU,
              targetUser: post.author._id,
              type: 'RESPONSE',
              targetEntity: post._id,
              body: `${cU.name} a répondu a une de vos préoccupations`
            });
            notification.save(err => {
              if (err) throw err;
              resolve('OK');
            });
          }
        });
      })
      .catch(err => {
        err.message = generateErrorMessage(err);
        reject(err);
      });
  });
}

export default create;
