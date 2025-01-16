// controllers/memberStatusController.js
const { updateUserStatus } = require("../db/queries");
const bcrypt = require("bcrypt");

// Render the Edit Member Status Page
async function getEditMemberStatus(req, res) {
  res.render("edit-member-status", {
    user: req.user,
    error: null,
    success: null,
  });
}

// Handle Status Update Submission
async function postEditMemberStatus(req, res) {
  const { new_status, password } = req.body;
  const userId = req.user.user_id;

  try {
    if (new_status === req.user.member_status) {
      return res.render("edit-member-status", {
        user: req.user,
        error: "You are already in this membership status.",
        success: null,
      });
    }

    // Handle "regular" downgrade (no password required)
    if (new_status === "regular") {
      await updateUserStatus(userId, "regular");
      return res.render("edit-member-status", {
        user: { ...req.user, member_status: "regular" },
        success: "You changed your membership status to Regular.",
        error: null,
      });
    }

    // Verify password for "secret" or "admin"
    const correctPassword =
      new_status === "secret"
        ? process.env.SECRET_PASSWORD
        : process.env.ADMIN_PASSWORD;

    const isPasswordValid = await verifyPassword(password, correctPassword);

    if (!isPasswordValid) {
      return res.render("edit-member-status", {
        user: req.user,
        error: "Incorrect password. Please try again.",
        success: null,
      });
    }

    // Update to "secret" or "admin"
    await updateUserStatus(userId, new_status);

    return res.render("edit-member-status", {
      user: { ...req.user, member_status: new_status },
      success: `Membership status updated to ${new_status.toUpperCase()}.`,
      error: null,
    });
  } catch (err) {
    console.error("Error updating membership status:", err);
    res.status(500).send("Internal Server Error");
  }
}

async function verifyPassword(password, storedHash) {
  try {
    const match = await bcrypt.compare(password, storedHash);
    if (match) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).send("Internal server error.");
  }
}

module.exports = {
  getEditMemberStatus,
  postEditMemberStatus,
};
