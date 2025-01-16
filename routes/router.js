// routes/indexRouter.js

const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  validateUserRegistration,
  validateUserLogin,
} = require("../validators/userValidators");

const {
  getIndex,
  getRegister,
  postRegister,
} = require("../controllers/indexController");

const {
  getMessageBoard,
  postNewMessage,
} = require("../controllers/messageBoardController");

const { isAuth, isAdmin } = require("../middleware/authMiddleware");

const {
  getEditMemberStatus,
  postEditMemberStatus,
} = require("../controllers/memberStatusController");

const {
  getAdminConsole,
  deleteAllMessagesByAdmin,
  deleteMessageByAdmin,
} = require("../controllers/adminController");

////////// GET ROUTES //////////////
// Home page
router.get("/", getIndex);
// Register New User Page
router.get("/register", getRegister);

// Message Board
router.get("/message-board", isAuth, getMessageBoard);

// Edit Membership Status Page (GET)
router.get("/edit-member-status", isAuth, getEditMemberStatus);

////////// POST ROUTES //////////////
// Register New User
router.post("/register", validateUserRegistration, postRegister);

// Login User
router.post(
  "/login",
  validateUserLogin,
  passport.authenticate("local", {
    failureRedirect: "/",
    successRedirect: "/",
    failureFlash: true, // enable flash messages for failures
  })
);

// Lougout User
// Logout User
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle errors during logout
    }
    req.flash("success", "You have successfully logged out."); // Optional flash message
    res.redirect("/"); // Redirect to the home page after logout
  });
});

// Handle Membership Status Update (POST)
router.post("/edit-member-status", isAuth, postEditMemberStatus);

// Add new message to message board
router.post("/message-board", isAuth, postNewMessage);

// Admin Console Routes
router.get("/admin-console", isAdmin, getAdminConsole);
router.post("/admin-console/delete/:id", isAdmin, deleteMessageByAdmin);
router.post("/admin-console/delete-all", isAdmin, deleteAllMessagesByAdmin);

module.exports = router;
