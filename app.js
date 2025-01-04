const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
require("dotenv");
const dbConnection = require("./db/db");

const indexRouter = require("./routes/indexRouter"); // Import the router

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
  /**
   * A note about how the cookie works. When a session is created the express session middleware is going to get this cookie on every request and take the value. Then it looks up this value session ID in the session store and confirms it's valid. If it's valid you can show the user content or gather data on the user such as how many times the user has visited the site.
   */
);

// Use the indexRouter for root-level routes
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log("Server running on port 3000");
});
