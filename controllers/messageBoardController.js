// controllers/messageBoardController.js
const {
  getAllMessages,
  getAllMessagesWithUsernames,
  getAllMessagesWithUserDetails,
  addNewMessage,
  deleteMessageById,
} = require("../db/queries");

const { format, isValid } = require("date-fns");

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
// Handle new message submissions
async function postNewMessage(req, res) {
  const { message } = req.body;

  if (!message.trim()) {
    req.flash("error", "Message cannot be empty.");
    return res.redirect("/message-board");
  }

  try {
    await addNewMessage(req.user.user_id, message);

    // Redirect back to the message board after adding the message
    res.redirect("/message-board");
  } catch (err) {
    console.error("Error posting message:", err);
    res.status(500).send("Error posting message.");
  }
}

function formatDate(dateInput) {
  let date;

  // Check if the input is already a Date object
  if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "string") {
    // Replace space with 'T' to make it ISO compliant
    date = new Date(dateInput.replace(" ", "T"));
  } else {
    // Invalid input, return fallback
    return "Invalid Date";
  }

  // Check if the parsed date is valid
  if (!isValid(date)) {
    return "Invalid Date";
  }

  // Format the date to "March 12th, 3:15PM"
  return format(date, "MMMM do, h:mma");
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
};
