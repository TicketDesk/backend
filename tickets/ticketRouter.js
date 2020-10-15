const Tickets = require("./ticketModel");
const Users = require("../users/userModel");
const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

//POST create new ticket
router.post("/", (req, res) => {
  const { id } = req.user;
  const newTicket = { ...req.body, submitted_by: id };
  Tickets.createTicket(newTicket)
    .then(([ticket]) => res.status(201).json(ticket))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET all users tickets
router.get("/", (req, res) => {
  const { id } = req.user;
  Tickets.getTicketsByUserId(id)
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//DELETE a ticket by id
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  Tickets.deleteTicketByTicketId(id)
    .then((deleted) => res.status(204).json(deleted))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET all organization tickets
router.get("/all", (req, res) => {
  Tickets.getAllTickets()
    .then((tickets) => res.status(200).json(tickets))
    .catch((err) => res.status(500).json({ error: err }));
});

//GET all department names
router.get("/departments", (req, res) => {
  console.log("HERE WE ARE");
  Tickets.getDepartmentTypes()
    .then((depts) => res.status(200).json(depts))
    .catch((err) => res.status(500).json({ error: err }));
});
// GET single ticket by ticket id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  Tickets.findTicketById(id)
    .then((ticket) => res.status(200).json(ticket))
    .catch((err) => res.status(500).json({ error: err }));
});

// GET single ticket responses by ticket id
router.get("/responses/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;
  Tickets.getTicketResponsesByTicketId(ticket_id)
    .then((responses) => res.status(200).json(responses))
    .catch((err) => res.status(500).json({ error: err }));
});

//PUT update existing tickets
router.put("/:id/update", async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  const ticketUserId = await Tickets.findTicketById(id);
  console.log(ticketUserId);
  const userId = await Users.findById(ticketUserId.ticket.submitted_by);

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

// POST create new response to ticket with ticket id
router.post("/:ticket_id/responses", (req, res) => {
  const { ticket_id } = req.params;
  console.log("USER", req.user.sub, "MESSAGE", req.body);
  Tickets.createTicketResponse(ticket_id, req.body, req.user.sub)
    .then((message) => res.status(201).json(message))
    .catch((err) => res.status(500).json({ error: err }));
});

module.exports = router;
