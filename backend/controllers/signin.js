const bcrypt = require('bcrypt-nodejs');
const { db } = require('../constants/db');


const post = (req, res) => {
  const { email, password } = req.body;
  db.select('email', 'hash').from('login')
    .where({ email })
    .then(logins => {
      const isAuthenticated = bcrypt.compareSync(password, logins[0].hash);
      if (isAuthenticated) {
        return db('users')
          .select('*')
          .where({ email })
          .then(users => {
            res.json(users[0])
          })
          .catch(err => res.status(500).json({
            msg: 'Error fetching user'
          }))
      }
      throw new Error;
    })
    .catch(err => res.status(400).json({
      msg: 'Email and/or password incorrect'
    }))
}

module.exports = { post }
