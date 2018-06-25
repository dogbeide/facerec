const bcrypt = require('bcrypt-nodejs');
const { db } = require('../constants/db');

const post = (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({
      msg: 'Please enter valid information'
    });
  }
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
    .catch(err => {
      trx.rollback(err);
      res.status(500).send({msg: 'Failed to register user'})
    })
  })
  .catch(err => res.status(400).json(err));
}

module.exports = { post }
