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
    .then(([ticket]) => res.status(201).json({ id: ticket }))
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
    .then(async (deleted) => {
      const tickets = await Tickets.getAllTickets();
      res.status(200).json(tickets);
    })
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
  Tickets.findTicketById(ticket_id)
    .then((responses) => res.status(200).json(responses))
    .catch((err) => res.status(500).json({ error: err }));
});

//PUT update existing ticket
router.put("/:id/update", async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  const ticketUserId = await Tickets.findTicketById(id);
  const userId = await Users.findById(ticketUserId.submitted_by);

  Tickets.updateTicket(id, updates)
    .then(() => {
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
        .then(async (email) => {
          const updated = await Tickets.findTicketById(id);
          const tickets = await Tickets.getAllTickets();
          const obj = { updated, tickets };
          res.status(201).json(obj);
        })
        .catch((err) =>
          res.status(500).json({ message: "Could not send.", error: err })
        );
    })
    .catch((err) => console.log(err));
});

// POST create new response to ticket with ticket id
router.post("/:ticket_id/responses", async (req, res) => {
  const { ticket_id } = req.params;
  try {
    const response = await Tickets.createTicketResponse(
      ticket_id,
      req.body,
      req.user.id
    );
    const single_ticket = await Tickets.findTicketById(ticket_id);

    res.status(201).json({ tickets: response, updated: single_ticket });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/:ticket_id/messages", async (req, res) => {
  const { ticket_id } = req.params;
  try {
    const response = await Tickets.postTicketResponse(
      ticket_id,
      req.body,
      req.user.id
    );
    console.log(response);
    res.status(201).json(response);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
