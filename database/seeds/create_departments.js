const dotenv = require("dotenv").config();
exports.seed = async function (knex) {
  const depts = process.env.DEPARTMENTS.split(",");
  let promises = depts.map((department) =>
    knex.raw(`ALTER TYPE department ADD VALUE '${department}'`)
  );
  try {
    let results = await Promise.all(promises);
    return results;
  } catch (err) {
    throw new Error(err);
  }
};
