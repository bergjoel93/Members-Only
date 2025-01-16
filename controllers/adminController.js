const {
  getAllMessagesWithUserDetails,
  deleteMessageById,
  deleteAllMessages,
} = require("../db/queries");
const { format } = require("date-fns");
const { formatDate } = require("./messageBoardController");

// Get the Admin Console Page
async function getAdminConsole(req, res) {
  try {
    const messages = await getAllMessagesWithUserDetails();
    //console.log(messages[0]);
    res.render("admin-console", { user: req.user, messages, formatDate });
  } catch (err) {
    console.error("Error loading admin console:", err);
    res.status(500).send("Error loading admin console.");
  }
}

// Delete a Single Message
async function deleteMessageByAdmin(req, res) {
  const messageId = req.params.id;

  try {
    await deleteMessageById(messageId);
    res.redirect("/admin-console");
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).send("Error deleting message.");
  }
}

// Delete All Messages
async function deleteAllMessagesByAdmin(req, res) {
  try {
    await deleteAllMessages();
    res.redirect("/admin-console");
  } catch (err) {
    console.error("Error deleting all messages:", err);
    res.status(500).send("Error deleting all messages.");
  }
}

module.exports = {
  getAdminConsole,
  deleteMessageByAdmin,
  deleteAllMessagesByAdmin,
};
