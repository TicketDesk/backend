const { response } = require("express");
const jwt = require("jsonwebtoken");

module.exports = function (username) {
  // expires after hour (3600 seconds = 60 minutes)
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: "3h" });
};
