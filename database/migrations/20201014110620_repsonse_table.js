exports.up = function (knex) {
  return knex.schema
    .alterTable("tickets", (table) => {
      table.dropColumn("response");
    })
    .then(() =>
      knex.schema.createTable("ticket_responses", (table) => {
        table.increments("id").primary();
        table.string("message").notNullable();
        table.timestamps(true, true);
        table
          .integer("user_id")
          .references("id")
          .inTable("users")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table
          .integer("ticket_id")
          .references("id")
          .inTable("tickets")
          .onDelete("CASCADE")
          .onUpdate("CASCADE");
        table.index(["created_at"], "date_index");
      })
    )
    .then(() =>
      knex.schema.alterTable("tickets", (table) => {
        table.timestamps(true, true);
        table.index(["created_at"], "created_index");
      })
    );
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("tickets", (table) => {
      table.string("response");
      table.dropTimestamps();
    })
    .then(() => knex.schema.dropTable("ticket_responses"));
};
