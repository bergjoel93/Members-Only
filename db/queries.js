const pool = require("./db"); // Import the database pool

/**
 * Add a new user to the users table.
 * @param {string} full_name - Full name of the user.
 * @param {string} username - Username for the user (must be unique).
 * @param {string} password - Hashed password for the user.
 * @param {string} member_status - Membership status (e.g., 'regular', 'secret', 'admin').
 * @returns {Promise<Object>} The newly created user.
 */
async function addUser(full_name, username, password, member_status) {
  const query = `
    INSERT INTO users (full_name, username, password, member_status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [
      full_name,
      username,
      password,
      member_status,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding user:", err);
    throw err; // Rethrow the error for handling in the calling function
  }
}

module.exports = {
  addUser,
};
