const bcrypt = require('bcrypt-nodejs');
const { db } = require('../constants/db');

const post = (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      name,
      email,
      createdat: new Date()
    })
    .into('users')
    .returning('*')
    .then(users => {
      return trx('login')
        .returning('*')
        .insert({
          email: users[0].email,
          hash
        })
        .then(logins => {
          res.json(users[0]);
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json(err));
}

module.exports = { post }
