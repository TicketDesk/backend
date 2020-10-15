const express = require("express");
const router = express.Router();
const Users = require("./userModel");
const Tickets = require("../tickets/ticketModel");

//GET all users
router.get("/", (req, res) => {
  Users.getAllUsers()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json({ error: err }));
});

// GET all of a user's tickets
router.get("/tickets", (req, res) => {
  const { id } = req.user;
  console.log("REQ USER", req.user);
  console.log("ID", id);
  Users.getUserTickets(id)
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//POST Update user role
router.post("/update", (req, res) => {
  const { admin } = req.body;
  const { id } = req.user;
  Users.updateUserRole(admin, id)
    .then((updated) => res.status(201).json(updated))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
