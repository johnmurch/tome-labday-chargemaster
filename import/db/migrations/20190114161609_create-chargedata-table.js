exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE chargedata(
    id SERIAL PRIMARY KEY NOT NULL,
    name TEXT,
    metatitle TEXT,
    metadata TEXT,
    description TEXT,
    price TEXT,
    variable BOOLEAN,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
}

exports.down = function(knex, Promise) {
  return Knex.schema.dropTable('chargedata')
}
