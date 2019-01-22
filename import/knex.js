const knex = require('knex')({
    client: 'pg',
    connection:'postgres://localhost/labday',
  })

module.exports = knex
