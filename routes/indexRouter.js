// routes/indexRouter.js

const express = require("express");

const router = express.Router();

const pool = require("../db/db"); // Database pool

const {
  validateUserRegistration,
  validateUserLogin,
} = require("../validators/userValidators");

const {
  getIndex,
  getRegister,
  postRegister,
} = require("../controllers/indexController");

////////// GET ROUTES //////////////
// Home page
router.get("/", getIndex);
// Register New User Page
router.get("/register", getRegister);
// Login User Page

////////// POST ROUTES //////////////
// Register New User
router.post("/register", validateUserRegistration, postRegister);

// Login User

module.exports = router;
