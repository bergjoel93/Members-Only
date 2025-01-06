const pool = require("./db"); // Import the database pool

/**
 * Add a new user to the users table.
 * @param {string} full_name - Full name of the user.
 * @param {string} username - Username for the user (must be unique).
 * @param {string} password - Hashed password for the user.
 * @param {string} member_status - Membership status (e.g., 'regular', 'secret', 'admin').
 * @returns {Promise<Object>} The newly created user.
 */
async function addUser(full_name, username, member_status, salt, hash) {
  const query = `
    INSERT INTO users (full_name, username, member_status, salt, hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  try {
    const result = await pool.query(query, [
      full_name,
      username,
      member_status,
      salt,
      hash,
    ]);
    return result.rows[0];
  } catch (err) {
    console.error("Error adding user:", err);
    throw err; // Rethrow the error for handling in the calling function
  }
}

/**
 * Find a user by their username.
 * @param {string} username - The username to search for.
 * @returns {Promise<Object|null>} - The user object if found, or null if not found.
 * usernames are case in-sensitive!
 */
async function findUserByUsername(username) {
  const query = `
    SELECT * 
    FROM users 
    WHERE username ILIKE $1;
  `;

  try {
    const result = await pool.query(query, [username]);
    return result.rows[0] || null; // Return the user object or null if not found
  } catch (err) {
    console.error("Error finding user by username:", err);
    throw err; // Rethrow the error for handling in the calling function
  }
}

module.exports = {
  addUser,
  findUserByUsername,
};
