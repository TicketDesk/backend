exports.up = function (knex) {
  return knex.schema
    .createTable("departments", (table) => {
      table.increments("id").primary();
      table.enu("name", ["alpha, beta, charlie, delta, gamma"]);
    })
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.string("first_name").notNullable();
      table.string("last_name").notNullable();
      table.string("email").notNullable().unique();
      table.boolean("admin").defaultTo(false);
      table
        .integer("dept_id")
        .references("id")
        .inTable("departments")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    })
    .createTable("priorities", (table) => {
      table.increments("id").primary();
      table.integer("level").defaultsTo(1);
    })
    .createTable("tickets", (table) => {
      table.increments("id").primary();
      table.string("description").notNullable();
      table.string("attempted_solutions").notNullable();
      table
        .integer("submitted_by")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      table
        .integer("priority_id")
        .references("id")
        .inTable("priorities")
        .onDelete("CASCADE")
        .onUpdate("CASCADE")
        .notNullable();
      table.integer("assigned_to").references("id").inTable("users");
      table.string("status");
      table.integer("dept_id").references("id").inTable("departments");
    })
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
    .createTable("user_passwords", (table) => {
      table.increments("id").primary();
      table.string("password").notNullable();
      table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("user_passwords")
    .dropTableIfExists("ticket_categories")
    .dropTableIfExists("categories")
    .dropTableIfExists("tickets")
    .dropTableIfExists("priorities")
    .dropTableIfExists("users")
    .dropTableIfExists("departments");
};
