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

//PUT update existing tickets
router.put("/:id/update", async (req, res) => {
  const updates = req.body;
  const { id } = req.params;
  const ticketUserId = await Tickets.findTicketById(id);
  //   const userId = await Users.findById(ticketUserId.submitted_by);
  const userId = { email: "cgiroux86@gmail.com" };

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

  console.log("USERRR IDDD", userId);
});

module.exports = router;
