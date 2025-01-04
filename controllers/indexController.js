// controllers/indexController.js

// Get Request
function getIndex(req, res) {
  res.render("index");
}

function getRegister(req, res) {
  res.render("register");
}

// Post Request

function postRegister(req, res) {
  const { first_name, last_name, username, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Render the registration page with validation error messages
    return res.status(400).render("register", {
      errors: errors.array(),
    });
  }

  // Registration logic here

  res.send("User registered successfully!");
}

module.exports = {
  getIndex,
  getRegister,
  postRegister,
};
