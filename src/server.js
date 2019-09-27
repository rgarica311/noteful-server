const knex = require('knex')
const app = require('./app')

const { PORT, DB_URL_TEST } = require('./config')

const db = knex({
  client: 'pg',
  connection: DB_URL_TEST
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
