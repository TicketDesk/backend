exports.up = function (knex) {
  return knex.schema
    .table("tickets", (table) => table.dropColumn("priority_id"))
    .dropTable("priorities")
    .then(() =>
      knex.schema
        .raw("CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH')")
        .then(() =>
          knex.schema.table("tickets", (table) => {
            table.specificType("priority", "priority");
          })
        )
    );
};

exports.down = function (knex) {
  return knex.schema
    .createTable("priorities", (table) => {
      table.increments("id").primary();
      table.integer("level").defaultsTo(1);
    })
    .table("tickets", (table) => {
      table
        .dropColumn("priority")
        .integer("priority_id")
        .references("id")
        .inTable("priorities")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .then(() => knex.schema.raw("DROP TYPE IF EXISTS priority"));
};
