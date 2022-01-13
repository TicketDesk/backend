exports.up = function (knex) {
  return knex.schema.alterTable("tickets", (table) => {
    table.string("response").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tickets", (table) => {
    table.dropColumn("response");
  });
};
