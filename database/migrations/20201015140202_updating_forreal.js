exports.up = function (knex) {
  return knex.schema
    .alterTable("users", (table) => {
      table.dropForeign("dept_id");
    })

    .alterTable("tickets", (table) => {
      table.string("more_info");
      table.dropForeign("dept_id");
      table.dropColumn("dept_id");
      table.specificType("department", "department");
    })

    .dropTable("departments")
    .dropTable("ticket_categories")
    .dropTable("categories");
};

exports.down = function (knex) {
  return knex.schema
    .createTable("categories", (table) => {
      table.increments("id");
      table.string("name");
    })
    .createTable("ticket_categories", (table) => {
      table.increments("id").primary();
      table
        .integer("ticket_id")
        .references("id")
        .inTable("tickets")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      table
        .integer("category_id")
        .references("id")
        .inTable("categories")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("departments", (table) => {
      table.increments("id").primary();
      table.enu("name", ["alpha, beta, charlie, delta, gamma"]);
    })

    .alterTable("tickets", (table) => {
      table.dropColumn("more_info");
      table.dropColumn("department");
      table.integer("dept_id").references("id").inTable("departments");

      //   table.integer("dept_id").defaultTo(1).alter();
    })
    .alterTable("users", (table) => {
      table.integer("dept_id").references("id").inTable("departments").alter();
    });

  // .then(() => {
  //   knex.schema.alterTable("tickets", (table) => {
  //     table.integer("dept_id").defaultTo(1).alter();
  //   });
  // })
};
