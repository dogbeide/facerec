const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profileId = require('./controllers/profile-id');
const image = require('./controllers/image');


const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.status(200).send();
});
app.post('/signin', signin.post);
app.post('/register', register.post);
app.get('/profile/:id', profileId.get);
app.put('/image', image.put);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

/*

GET / --> home
POST /signin --> success/fail {user}
POST /register --> {user}
GET /profile/:id --> entries
PUT /image --> {user}

*/
