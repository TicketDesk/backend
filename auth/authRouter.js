const express = require("express");
const router = express.Router();
const validateSignup = require("../middleware/validateSignup");
const passport = require("passport");
const bcrypt = require("bcrypt");
const Users = require("../users/userModel");
const generateAccessToken = require("../utils/generateAccessToken");

router.post("/register", validateSignup, (req, res) => {
  Users.addUser(req.body)
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(500).json({ error: err }));
});

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  (req, res) => {
    const { user } = req;
    console.log("USER ", user);
    const response = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      token: generateAccessToken({
        email: user.email,
        sub: user.id,
        first_name: user.first_name,
      }),
    };
    res.status(200).json(response);
  }
);

module.exports = router;
