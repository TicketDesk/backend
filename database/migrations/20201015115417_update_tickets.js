const db = require("../dbConfig");
exports.up = function (knex) {
  return knex.schema.raw("CREATE type department AS ENUM()");
};

exports.down = function (knex) {
  return knex.schema.raw("DROP TYPE IF EXISTS department");
};
