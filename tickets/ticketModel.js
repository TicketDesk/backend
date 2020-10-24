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
  findSingleTicket,
};

function createTicket(ticketInfo) {
  return db("tickets").insert(ticketInfo).returning("id");
}

function updateTicket(id, updates) {
  delete updates.id;
  return db("tickets").where({ id }).update(updates);
}

async function findTicketById(id) {
  const ticket = await db("tickets")
    .leftJoin("users", "users.id", "tickets.assigned_to")

    .first()
    .select(
      "tickets.id as ticket_id",
      "tickets.description",
      "tickets.attempted_solutions",
      "tickets.submitted_by",
      "tickets.assigned_to",
      "users.first_name as assigned_first",
      "users.last_name as assigned_last",
      "tickets.status",
      "tickets.priority",
      "tickets.created_at",
      "tickets.more_info",
      "tickets.department"
    )
    .where("tickets.id", id);
  const responses = await db("ticket_responses")
    .leftJoin("users", "ticket_responses.user_id", "users.id")
    .where({ ticket_id: id })
    .select(
      "ticket_responses.id as response_id",
      "ticket_responses.message",
      "ticket_responses.created_at",
      "ticket_responses.ticket_id",
      "users.first_name",
      "users.last_name"
    );

  return {
    ...ticket,
    responses,
  };
}

async function getTicketsByUserId(id) {
  const tickets = await db("tickets")
    .where({ submitted_by: id })
    .select(
      "id as ticket_id",
      "description",
      "attempted_solutions",
      "submitted_by",
      "assigned_to",
      "status",
      "priority",
      "created_at",
      "more_info",
      "department"
    );
  const promises = Promise.all(
    tickets.map(async (ticket) => {
      const responses = await getTicketResponses(ticket.ticket_id);
      return {
        ...ticket,
        responses,
      };
    })
  );
  return promises;
}

function getTicketResponses(id) {
  return (
    db("ticket_responses")
      .leftJoin("users", "users.id", "ticket_responses.user_id")

      // .join("users", "users.id", "ticket_responses.user_id")
      // .select(
      //   "users.first_name as from_first",
      //   "users.last_name as from_last",
      //   "tickets.description",
      //   "tickets.attempted_solutions",
      //   "tickets.submitted_by",
      //   "tickets.status",
      //   "tickets.dept_id",
      //   "tickets.priority",
      //   "tickets.created_at",
      //   "tickets.id as ticket_id"
      // )
      .orderBy("created_at", "desc")
      .where({ ticket_id: id })
  );
}

async function getAllTickets() {
  try {
    const tickets = await db("tickets")
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
        "tickets.assigned_to",
        "tickets.more_info",
        "tickets.department",
        "tickets.id as ticket_id"
      )
      .orderBy("created_at", "desc");

    const promises = await Promise.all(
      tickets.map(async (ticket) => {
        return {
          ...ticket,
          responses: await getTicketResponses(ticket.ticket_id),
        };
      })
    );
    return promises;
  } catch (err) {
    return err;
  }
}

function findSingleTicket(id) {
  return db("tickets").where({ id });
}

function deleteTicketByTicketId(id) {
  return db("tickets").where({ id }).del();
}

function getTicketResponsesByTicketId(ticket_id) {
  return db("ticket_responses").where({ ticket_id });
}

async function createTicketResponse(ticket_id, response, user_id) {
  const post = { ticket_id: +ticket_id, user_id, ...response };
  try {
    await db("ticket_responses").insert(post);
    const tickets = await getAllTickets();

    const promises = await Promise.all(
      tickets.map(async (ticket) => {
        const responses = await getTicketResponses(ticket.ticket_id);
        return {
          ...ticket,
          responses,
        };
      })
    );
    return promises;
  } catch (err) {
    console.log(err);
  }
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
