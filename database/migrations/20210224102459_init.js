
exports.up = function(knex) {
  return knex.schema
  .createTable('users', tbl => {
      tbl.increments();
      tbl.string('username', 128).notNullable();
      tbl.string('password', 255).notNullable();
  })
  .createTable('items', tbl => {
      tbl.increments();
      tbl.string('name', 128).notNullable();
      tbl.string('location', 256).notNullable();
      tbl.string('description', 156).notNullable();
      tbl.integer('price').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema
  .dropTableIfExists('users')
  .dropTableIfExists('items')
};
