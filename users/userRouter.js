const express = require("express");
const router = express.Router();
const validateSignup = require("../middleware/validateSignup");
const Users = require("./userModel");

router.get("/", (req, res) => {
  res.status(200).json("all good in hood");
});

router.post("/register", validateSignup, (req, res) => {
  Users.addUser(req.body)
    .then((user) => res.status(201).json(user))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
