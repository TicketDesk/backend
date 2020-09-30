const db = require("../database/dbConfig");
const bcrypt = require("bcrypt");

module.exports = {
  addUser,
  findByEmail,
};
async function addUser(user) {
  const { first_name, last_name, email, password } = user;
  const hash = bcrypt.hashSync(password, process.env.SALT || 10);
  const new_user = await db("users")
    .insert({ first_name, last_name, email })
    .returning("id");
  const user_pw = await db("user_passwords").insert({
    password: hash,
    user_id: new_user[0],
  });
  return new_user;
}

async function findByEmail(email) {
  const user = await db("users").where({ email }).first();
}
