const Tickets = require("./ticketModel");
const Users = require("../users/userModel");
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//POST create new ticket
router.post("/", (req, res) => {
  const { id } = req.user;
  Tickets.createTicket(id, req.body)
    .then((ticket) => res.status(201).json(ticket))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET all users tickets
router.get("/", (req, res) => {
  const { id } = req.user;
  Tickets.getTicketsByUserId(id)
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET single ticket by ticket id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Tickets.findTicketById(id)
    .then((ticket) => res.status(200).json(ticket))
    .catch((err) => res.status(500).json({ error: err }));
});

//PUT update existing tickets
router.put("/:id/update", async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  const ticketUserId = await Tickets.findTicketById(id);
  const userId = await Users.findById(ticketUserId.submitted_by);

  Tickets.updateTicket(id, updates)
    .then((updated) => {
      sgMail
        .send({
          to: userId.email,
          from: "theticketqueue@gmail.com",
          templateId: "d-5a6a2ea2266a4b9ba848cc28dec1aa71",
          subject: "Someone replied to your ticket",
          substitutions: {
            comment: updates.response,
          },
        })
        .then((email) => res.status(201).json(email))
        .catch((err) =>
          res.status(500).json({ message: "Could not send.", error: err })
        );
    })
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
