function participate(req, db) {
  return new Promise((resolve, reject) => {
    const user = db.currentUser[req.get('token')];
    db.Workshop.findById(req.params.workshopId).then(workshop => {
      if (!workshop) {
        return reject({ type: 'workshopNotFound' });
      }

      if (
        workshop.participants.find(p => p._id.toString() == user._id.toString())
      ) {
        return reject({ type: 'alreadyParticipate' });
      }

      workshop.participants.push(user);

      workshop.save(async err => {
        if (err) {
          return reject();
        }
        await db.Notification.create({
          author: user,
          targetUser: workshop.author._id,
          targetEntity: workshop._id,
          type: 'WORKSHOP',
          body: `${user.name} va participé à votre td`
        });
        resolve('OK');
      });
    });
  });
}

export default participate;
