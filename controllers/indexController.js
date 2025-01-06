// controllers/indexController.js
const genPassword = require("../lib/passwordUtils").genPassword;
const { addUser } = require("../db/queries");
const { validationResult } = require("express-validator");
const passport = require("passport");

// Get Request
function getIndex(req, res) {
  res.render("index", { errors: [] });
}

function getRegister(req, res) {
  res.render("register", { errors: [] });
}

// Post Request
// TODO - This is where I'm struggling. I don't know how to implement the passport.authenticate middleware.
async function postLogin() {}

async function postRegister(req, res) {
  const { first_name, last_name, username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render the registration page with validation error messages
    return res.status(400).render("register", {
      errors: errors.array(),
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
    res.render("registerSuccess", { name: fullName });
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
  postLogin,
};

function capitalizeFirst(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
