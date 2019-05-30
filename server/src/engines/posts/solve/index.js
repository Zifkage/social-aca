function solve(req, db) {
  return new Promise((resolve, reject) => {
    const user = db.currentUser[req.get('token')];
    db.Post.findById(req.params.postId).then(post => {
      if (!post) {
        return reject({ type: 'postNotFound' });
      }

      if (user._id.toString() !== post.author._id.toString()) {
        return reject({ type: 'notPostOwner' });
      }

      const existingSolution = post.responses.find(
        response => response.solution
      );
      if (existingSolution) {
        return reject({ type: 'alreadySolve' });
      }

      const postSolution = post.responses.find(
        response => response._id.toString() == req.params.responseId.toString()
      );

      postSolution.solution = true;

      post.save(err => {
        if (err) {
          return reject(err);
        }
        const notification = new db.Notification({
          author: user,
          targetUser: postSolution.author._id,
          targetEntity: post._id,
          type: 'RESPONSE',
          body: `Vous avez trouver une solution a la préoccupation de ${
            post.author.name
          }`
        });
        notification.save(err => {
          if (err) return reject(err);
          resolve('OK');
        });
      });
    });
  });
}

export default solve;
