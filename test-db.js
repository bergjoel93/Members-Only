// A quick script to test that the database is working.

const pool = require("./db/db"); // Import the database pool

(async () => {
  try {
    // Test the connection by running a query
    const result = await pool.query("SELECT NOW()");
    console.log("Database connected successfully at:", result.rows[0].now);

    // Insert a test user into the users table
    const insertResult = await pool.query(
      "INSERT INTO users (full_name, username, password, member_status) VALUES ($1, $2, $3, $4) RETURNING *",
      ["Test User", "testuser", "password123", "regular"]
    );
    console.log("Inserted user:", insertResult.rows[0]);

    // Fetch all users to confirm the insert
    const users = await pool.query("SELECT * FROM users");
    console.log("All users:", users.rows);
  } catch (err) {
    console.error("Error executing query:", err.stack);
  } finally {
    pool.end(); // Close the database pool
  }
})();
