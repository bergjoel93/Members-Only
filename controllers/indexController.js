// controllers/indexController.js
const genPassword = require("../lib/passwordUtils").genPassword;
const { addUser } = require("../db/queries");
const { validationResult } = require("express-validator");
const passport = require("passport");

// Get Request
function getIndex(req, res) {
  if (req.isAuthenticated()) {
    // Redirect authenticated users to the message board
    return res.redirect("/message-board");
  }

  // Render the index page for unauthenticated users
  res.render("index", { user: req.user, errors: [], message: "" });
}

function getRegister(req, res) {
  res.render("register", { errors: [], user: req.user });
}

// Post Request

async function postRegister(req, res) {
  const { first_name, last_name, username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render the registration page with validation error messages
    return res.status(400).render("register", {
      errors: errors.array(),
      user: req.user,
    });
  }

  try {
    // Registration logic here
    // 1. generate password
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    // 2. Add new user into the database
    //  addUser(full_name, username, member_status, salt, hash,)
    const fullName =
      capitalizeFirst(first_name) + " " + capitalizeFirst(last_name);
    await addUser(fullName, username, "regular", salt, hash);

    // 3. redirect
    res.render("index", {
      message: "Congrats! You've made an account!",
      errors: [],
      user: req.user,
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res
      .status(500)
      .send("An error occurred during registration. Please try again.");
  }
}

module.exports = {
  getIndex,
  getRegister,
  postRegister,
};

function capitalizeFirst(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
