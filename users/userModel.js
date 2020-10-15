const db = require("../database/dbConfig");
const bcrypt = require("bcrypt");

module.exports = {
  addUser,
  findByEmail,
  findById,
  updateUserRole,
  getUserTickets,
  createTicket,
  updateTicket,
  getAllUsers,
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
  const { password } = await db("user_passwords")
    .where({ user_id: user.id })
    .first();
  return { ...user, password };
}

async function findById(id) {
  const user = await db("users").where({ id }).first();
  return user;
}

function updateUserRole(role, id) {
  return db("users").where({ id }).update({ admin: role });
}

function getUserTickets(id) {
  return db("tickets").where({ submitted_by: id });
}

function createTicket(id, ticketInfo) {
  return db("tickets").insert({
    submitted_by: id,
    description: ticketInfo.description,
    attempted_solutions: ticketInfo.attempted_solutions,
    priority_id: ticketInfo.priority_id,
  });
}

function updateTicket(id, updates) {
  delete updates.id;
  return db("tickets").where({ id }).update({
    description: "IF EVERYDAY GOES JUST LIKE THIS, HOW DO WE SURVIVE?",
  });
}

function getAllUsers() {
  return db("users");
}
