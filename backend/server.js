const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : '',
    password : '',
    database : 'facerec'
  }
});

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(dbFake.users)
});

app.post('/signin', (req, res) => {
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
          .catch(err => res.status(500).json('error fetching user'))
      }
      throw new Error;
    })
    .catch(err => res.status(400).json('email or password incorrect'))
});

app.post('/register', (req, res) => {
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
  .catch(err => res.status(400).json(err))
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id }).then(users => {
    if (users.length) {
      res.json(users[0]);
    } else {
      res.status(400).json('user not found');
    }
  })
  .catch(err => res.status(400).json('error fetching user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'))
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

/*

GET / --> res = yes
POST /signin --> success/fail
POST /register --> {user}
GET /profile/:userId --> {user}
PUT /image --> {user}

*/
