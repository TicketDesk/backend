const db = require("../database/dbConfig");
module.exports = {
  createTicket,
  updateTicket,
  findTicketById,
  getTicketsByUserId,
  getAllTickets,
  deleteTicketByTicketId,
  getTicketResponsesByTicketId,
  createTicketResponse,
  getDepartmentTypes,
};

function createTicket(ticketInfo) {
  console.log(ticketInfo);
  return db("tickets").insert(ticketInfo).returning("id");
}

function updateTicket(id, updates) {
  delete updates.id;
  return db("tickets").where({ id }).update(updates);
}

async function findTicketById(id) {
  const ticket = await db("tickets").where({ id }).first();
  const responses = await db("ticket_responses").where({ ticket_id: id });

  return {
    ticket,
    responses,
  };
}

function getTicketsByUserId(id) {
  console.log(id);
  return (
    db("tickets")
      // .leftJoin("ticket_responses", "ticket_responses.ticket_id", "tickets.id")
      // .leftJoin("users", "users.id", "ticket_responses.user_id")
      .where({ submitted_by: id })
  );
  // .select("description");
}

function getTicketResponses() {
  return db("ticket_responses")
    .join("users", "users.id", "ticket_responses.user_id")
    .select(
      "users.first_name as from_first",
      "users.last_name as from_last",
      "tickets.description",
      "tickets.attempted_solutions",
      "tickets.submitted_by",
      "tickets.status",
      "tickets.dept_id",
      "tickets.priority",
      "tickets.created_at",
      "tickets.id as ticket_id"
    )
    .orderBy("created_at", "desc");
  // .select("description", "attempted_solutions", "priority", );
}

function getAllTickets() {
  return db("tickets")
    .leftJoin("users", "users.id", "tickets.assigned_to")
    .select(
      "users.first_name as assigned_first",
      "users.last_name as assigned_last",
      "tickets.description",
      "tickets.attempted_solutions",
      "tickets.submitted_by",
      "tickets.status",
      "tickets.priority",
      "tickets.created_at",
      "tickets.more_info",
      "tickets.department",
      "tickets.id as ticket_id"
    )
    .orderBy("created_at", "desc");
}

function deleteTicketByTicketId(id) {
  return db("tickets").where({ id }).del();
}

function getTicketResponsesByTicketId(ticket_id) {
  return db("ticket_responses").where({ ticket_id });
}

function createTicketResponse(ticket_id, response, user_id) {
  const post = { ticket_id: +ticket_id, user_id, ...response };
  console.log("POST", post);
  return db("ticket_responses").insert(post);
}

function getDepartmentTypes() {
  return db.raw("SELECT unnest(enum_range(null::department))").then((resp) => {
    const { rows } = resp;
    return {
      departments: rows
        .map((row) => row.unnest)
        .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)),
    };
  });
}
