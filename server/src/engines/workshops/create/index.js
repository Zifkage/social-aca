function create(req, db, generateErrorMessage) {
  return new Promise(async (resolve, reject) => {
    const now = new Date();
    const date = new Date(req.body.dateStart);
    console.log(now.getTime(), date.getTime());

    if (now.getTime() - date.getTime() >= 0)
      return reject(new Error('pastdate'));
    db.Workshop.create({
      ...req.body,
      author: db.currentUser[req.get('token')]
    })
      .then(async workshop => {
        const cU = db.currentUser[req.get('token')];
        const notifications = [];
        const user = await db.User.findById(cU._id);
        let followers = user.followers;
        let concerneUsers = await db.User.find({
          trackcourses: workshop.course
        });

        concerneUsers = concerneUsers.filter(
          u =>
            followers.findIndex(f => u._id.toString() === f._id.toString()) ===
            -1
        );

        followers = [...followers, ...concerneUsers];
        if (followers.length === 0) {
          return resolve(workshop);
        }
        followers.forEach(f => {
          notifications.push({
            author: cU,
            targetUser: f._id,
            targetEntity: workshop._id,
            type: 'WORKSHOP',
            body: `${cU.name} a publié un nouveau td sur : ${workshop.course}.`
          });
        });
        await db.Notification.create(notifications);
        resolve(workshop);
      })
      .catch(err => {
        err.message = generateErrorMessage(err);
        reject(err);
      });
  });
}

export default create;
