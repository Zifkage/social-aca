function follow(req, db) {
  return new Promise((resolve, reject) => {
    const currentUser = db.currentUser[req.get('token')];
    db.User.findOne({ _id: req.params.userId })
      .then(user => {
        user.followers.push(currentUser);
        user.save(err => {
          if (err) {
            throw err;
          }
          db.User.findOne({ _id: currentUser._id })
            .then(cUser => {
              cUser.following.push(user);
              cUser.save(err => {
                if (err) {
                  throw err;
                }
                const notification = new db.Notification({
                  author: cUser,
                  targetUser: user._id,
                  targetEntity: cUser._id,
                  type: 'FOLLOW',
                  body: `${cUser.name} vous suit.`
                });
                notification.save(err => {
                  if (err) throw err;
                  resolve('OK');
                });
              });
            })
            .catch(err => reject(err));
        });
      })
      .catch(err => reject(err));
  });
}

export default follow;
