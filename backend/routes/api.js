const { router } = require("../app");

module.exports = funciton(router, database){
  // GET rooms route to get room associated with the teacher
router.get('/rooms', function (req, res) {
  const userId = req.seesion.userId;
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
    const userId = req.seesion.userId;
    const user = req.body;
    database
      .addRooms(userId, user)
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });

  // DELETE rooms route to delete room
  router.delete('/rooms', function (req, res) {
    const userId = req.seesion.userId;
    const user = req.body;
    database
      .deleteRoom({...req.body, userId})
      .then((data) => {
        if (!data) {
          res.send({ error: 'error' });
          return;
        }
        res.json(data);
      })
      .catch((e) => res.json(e));
  });
}


