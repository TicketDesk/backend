const express = require("express");
const router = express.Router();
const Users = require("./userModel");
const Tickets = require("../tickets/ticketModel");

//GET development test route to make sure passport is working correctly
router.get("/", (req, res) => {
  console.log("req user", req.user);
  res.status(200).json("token is working in passport");
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

//POST create user ticket
router.post("/tickets", (req, res) => {
  const { id } = req.user;

  Users.createTicket(id, req.body)
    .then((ticket) => res.status(201).json(ticket))
    .catch((err) => res.status(500).json({ error: err }));
});

//PUT update user tickets
router.put("/tickets", (req, res) => {
  const { id, updates } = req.body;

  Users.updateTicket(id, updates)
    .then((updated) => res.status(201).json(updated))
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
