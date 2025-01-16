const {
  getAllMessagesWithUserDetails,
  deleteMessageById,
  deleteAllMessages,
} = require("../db/queries");
const { formatInTimeZone } = require("date-fns-tz");

// Get the Admin Console Page
async function getAdminConsole(req, res) {
  try {
    const messages = await getAllMessagesWithUserDetails();

    res.render("admin-console", {
      user: req.user,
      messages,
    });
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

// Format Date in User's Local Time
function formatDate(unixTimestamp, userTimeZone = "UTC") {
  const date = new Date(unixTimestamp * 1000);
  return formatInTimeZone(date, userTimeZone, "MMMM do, h:mma");
}

module.exports = {
  getAdminConsole,
  deleteMessageByAdmin,
  deleteAllMessagesByAdmin,
  formatDate,
};
