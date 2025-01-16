// controllers/messageBoardController.js
const {
  getAllMessages,
  getAllMessagesWithUsernames,
  getAllMessagesWithUserDetails,
  addNewMessage,
  deleteMessageById,
} = require("../db/queries");

const { format, formatInTimeZone } = require("date-fns-tz");

////////// Get Requests //////////

// get message board
async function getMessageBoard(req, res) {
  try {
    let messages;

    // Fetch messages based on user role
    if (req.user.member_status === "admin") {
      messages = await getAllMessagesWithUserDetails();
    } else if (req.user.member_status === "secret") {
      messages = await getAllMessagesWithUsernames();
    } else {
      messages = await getAllMessages();
    }

    // Render the message board with the correct message data
    res.render("message-board", { user: req.user, messages, formatDate });
  } catch (err) {
    console.error("Error loading messages:", err);
    res.status(500).send("Error loading messages.");
  }
}

//////////// POST requests ////////////
async function postNewMessage(req, res) {
  const { message } = req.body;

  if (!message.trim()) {
    req.flash("error", "Message cannot be empty.");
    return res.redirect("/message-board");
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000); // UNIX timestamp in seconds

    await addNewMessage(req.user.user_id, message, timestamp);

    res.redirect("/message-board");
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).send("Error posting message.");
  }
}

/**
 * Formats a UNIX timestamp to a readable date in the user's local time zone.
 * @param {number} unixTimestamp - The UNIX timestamp to format.
 * @returns {string} - Formatted date string like "March 12th, 3:15PM".
 */
function formatDate(unixTimestamp) {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Detect user's timezone
  const date = new Date(unixTimestamp * 1000); // Convert UNIX timestamp to milliseconds

  return formatInTimeZone(date, userTimeZone, "MMMM do, h:mma");
}

// Handle deleting a message
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
