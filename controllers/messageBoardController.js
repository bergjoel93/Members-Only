const {
  getAllMessages,
  getAllMessagesWithUsernames,
  getAllMessagesWithUserDetails,
  addNewMessage,
  deleteMessageById,
} = require("../db/queries");

const { formatInTimeZone } = require("date-fns-tz");

////////// Get Requests //////////

// Get Message Board
async function getMessageBoard(req, res) {
  try {
    let messages;

    if (req.user.member_status === "admin") {
      messages = await getAllMessagesWithUserDetails();
    } else if (req.user.member_status === "secret") {
      messages = await getAllMessagesWithUsernames();
    } else {
      messages = await getAllMessages();
    }

    res.render("message-board", {
      user: req.user,
      messages,
    });
  } catch (err) {
    console.error("Error loading messages:", err);
    res.status(500).send("Error loading messages.");
  }
}

//////////// POST Requests ////////////

// Handle New Message Submissions
async function postNewMessage(req, res) {
  const { message, timezone } = req.body;

  if (!message.trim()) {
    req.flash("error", "Message cannot be empty.");
    return res.redirect("/message-board");
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);

    await addNewMessage(req.user.user_id, message, timestamp);

    res.redirect("/message-board");
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).send("Error posting message.");
  }
}

// Format Date in User's Local Time
function formatDate(unixTimestamp, userTimeZone = "UTC") {
  const date = new Date(unixTimestamp * 1000);
  return formatInTimeZone(date, userTimeZone, "MMMM do, h:mma");
}

// Handle Deleting a Message
async function deleteMessage(req, res) {
  const messageId = req.params.id;

  try {
    const deleted = await deleteMessageById(messageId);

    if (deleted) {
      req.flash("success", "Message deleted successfully.");
    } else {
      req.flash("error", "Message not found or could not be deleted.");
    }

    res.redirect("/message-board");
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).send("Error deleting message.");
  }
}

module.exports = {
  getMessageBoard,
  postNewMessage,
  deleteMessage,
  formatDate,
};
