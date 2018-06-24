const express = require('express');
const bodyParser = require('body-parser');


const app = express();

const db = {
  users: [
    {
      id: '1',
      name: 'Jon',
      email: 'joncagley@gmail.com',
      password: 'lavaguns',
      entries: 0,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Chirag',
      email: 'chiraggupta@gmail.com',
      password: 'brother',
      entries: 0,
      createdAt: new Date()
    },
  ]
}

app.use(bodyParser.json());

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
    id: db.users.length + 1,
    name,
    email,
    password,
    entries: 0,
    createdAt: new Date()
  });
  res.json(db.users[db.users.length-1]);
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
})

/*

GET / --> res = yes
POST /signin --> success/fail
POST /register --> {user}
GET /profile/:userId --> {user}
PUT /image --> {user}

*/
