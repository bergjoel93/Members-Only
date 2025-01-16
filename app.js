const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
require("dotenv");
const dbConnection = require("./db/db");
const passport = require("./config/passport");
const flash = require("connect-flash");

const router = require("./routes/router"); // Import the router

// Serve static files from the "public" directory
app.use(express.static("public"));

// Set EJS as the template engine
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies

/*
 * -------------- SESSION SETUP ----------------
 * Session: Used to store information about a user moving throughout the browser.
 * Session-store: what persistent memory are we storing our sessions in.
 */

// Import connect-pg-simple for storing session data in a PostgreSQL database
const pgStore = require("connect-pg-simple")(session);

// A session store connects the session data to a persistent storage, in our case a database.
// Create a new session store using the PostgreSQL connection pool
const sessionStore = new pgStore({ pool: dbConnection });

// Set up the session middleware to manage user sessions
app.use(
  session({
    // The following are express-session "options".
    secret: process.env.SECRET, // Secret key used to sign the session ID cookie (stored in .env)
    resave: false, // Prevents resaving sessions that haven't been modified.
    saveUninitialized: true, // Saves new sessions that haven't been modified yet.
    store: sessionStore, // Use the PostreSQL session store to persist session data
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // Session cookie expires in 30 days.
  })
);

// Initialize flash middleware
app.use(flash());

// Pass flash messages to all views
app.use((req, res, next) => {
  res.locals.errorMessages = req.flash("error"); // Attach error messages to locals
  next();
});

/**
 * -------------- Passport Authentication ----------------
 */
// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Middleware to log the session and user information for debugging purposes
app.use((req, res, next) => {
  // console.log(req.session);
  //console.log(req.user);
  //console.log("Authenticated?", req.isAuthenticated());
  next();
});

// Use the indexRouter for root-level routes
app.use("/", router);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
