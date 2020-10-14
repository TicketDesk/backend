const db = require("../database/dbConfig");
module.exports = {
  createTicket,
  updateTicket,
  findTicketById,
};
function createTicket(id, ticketInfo) {
  return db("tickets").insert({
    submitted_by: id,
    description: ticketInfo.description,
    attempted_solutions: ticketInfo.attempted_solutions,
    priority: ticketInfo.priority_id,
  });
}

function updateTicket(id, updates) {
  delete updates.id;
  return db("tickets").where({ id }).update(updates);
}

function findTicketById(id) {
  return db("tickets").where({ id }).first();
}
