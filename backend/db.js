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

module.exports = { dbFake: db }
