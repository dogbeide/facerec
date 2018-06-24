const express = require('express');


const app = express();

app.get('/', (req, res) => {
  res.send('yes')
})

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
