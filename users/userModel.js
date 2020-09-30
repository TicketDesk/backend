const db = require("../database/dbConfig");

module.exports = {
  addUser(user) {
    const { first_name, last_name, email } = user;
    return db("users").insert({ first_name, last_name, email });
  },
};
