const { check } = require("express-validator");
const { findUserByUsername } = require("../db/queries");

const validateUserRegistration = [
  check("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isAlpha()
    .withMessage("First name must contain only letters"),
  check("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isAlpha()
    .withMessage("Last name must contain only letters"),
  check("username")
    .notEmpty()
    .withMessage("Username is required")
    .isAlphanumeric()
    .withMessage("Username must not have special characters")
    .custom(async (value) => {
      const user = await findUserByUsername(value);
      if (user) {
        throw new Error("Username is already taken");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateUserLogin = [
  check("username").notEmpty().withMessage("Username is required"),
  check("password").notEmpty().withMessage("Password is required"),
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
};
