const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const { db } = require('./db');


const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send(db.users)
});

app.post('/signin', (req, res) => {
  if (req.body.email === db.users[0].email &&
      req.body.password === db.users[0].password) {
    res.json('success');
  } else {
    res.status(400).json('username or password incorrect');
  }
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  db.users.push({
    id: (db.users.length + 1).toString(),
    name,
    email,
    password,
    entries: 0,
    createdAt: new Date()
  });
  res.json(db.users[db.users.length-1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      res.json(user);
      found = true;
    }
  });
  if (!found) {
    res.status(404).json('user not found');
  }
});

app.post('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  db.users.forEach(user => {
    if (user.id === id) {
      user.entries++;
      res.json(user.entries);
      found = true;
    }
  });
  if (!found) {
    res.status(404).json('user not found');
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
})

/*

GET / --> res = yes
POST /signin --> success/fail
POST /register --> {user}
GET /profile/:userId --> {user}
PUT /image --> {user}

*/
