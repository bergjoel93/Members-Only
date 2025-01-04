//db/db.js

require("dotenv").config();
// Get connection
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1); // Exit the process if the database URL is missing
}

// Use environment variables to protect sensitive information
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // For Railway's SSL requirement
  },
});

if (pool) {
  console.log("Database pool initialized successfully");
}

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = pool;
