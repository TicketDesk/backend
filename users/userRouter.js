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

//GET all admins
router.get("/admins", (req, res) => {
  Users.getAllAdmins()
    .then((admins) => res.status(200).json(admins))
    .catch((err) => res.staus(500).json({ error: err }));
});

// GET all of a user's tickets
router.get("/tickets/:id", (req, res) => {
  const { id } = req.params;

  Users.getUserTickets(id)
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET all of a user's assigned ticket
router.get("/tickets/assigned/:id", (req, res) => {
  const { id } = req.params;
  Users.getAssignedTickets(id)
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//POST Update user role
router.put("/update", (req, res) => {
  const { admin, id } = req.body;

  console.log(admin, id);
  Users.updateUserRole(admin, id)
    .then((updated) => res.status(201).json(updated))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
