module.exports = function (router, database) {
  // GET rooms route to get room associated with the teacher
  router.get('/rooms', function (req, res) {
    const userId = req.session.userId;
    database
      .getRooms(userId)
      .then((data) => {
        if (!user) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });
  // POST rooms route to add room to the teacher
  router.post('/rooms', function (req, res) {
    const userId = req.session.userId;
    const user = req.body;

    console.log('User from API/Rooms ===> ', user);
    database
      .addRooms(userId, user)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
        // console.log(res.json(data))
      })
      .catch((e) => res.json(e));
  });

  // DELETE rooms route to delete room
  router.delete('/rooms', function (req, res) {
    const userId = req.session.userId;

    database
      .deleteRoom(userId)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });

  // GET attendees route
  router.get('/attendees', function (req, res) {
    const userId = req.session.userId;
    const info = req.query;
    console.log(`this is inside get /attendees`, info);
    database
      .getAttendees(userId, info)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });

  // POST attendees route
  router.post('/attendees', function (req, res) {
    const userId = req.session.userId;
    const user = req.body;
    console.log(`this is inside post /attendees`, user);
    database
      .addAttendees(userId, user)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });

  // GET messages route
  router.get('/messages', function (req, res) {
    const userId = req.session.userId;
    database
      .getMessages(userId)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });

  // POST messages route
  router.post('/messages', function (req, res) {
    const userId = req.session.userId;
    const data = req.body;
    database
      .addMessages(userId, data)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });
};
