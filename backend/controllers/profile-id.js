const { db } = require('../constants/db');


const get = (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id }).then(users => {
    if (users.length) {
      res.json(users[0]);
    } else {
      res.status(400).json('user not found');
    }
  })
  .catch(err => res.status(400).json('error fetching user'));
}

module.exports = { get }
