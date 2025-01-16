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

/**
 * Find a user by their user_id.
 * @param {number} user_id - The user ID to search for.
 * @returns {Promise<Object|null>} - The user object if found, or null if not found.
 */
async function findUserById(user_id) {
  const query = `
    SELECT * 
    FROM users 
    WHERE user_id = $1;
  `;

  try {
    const result = await pool.query(query, [user_id]);
    return result.rows[0] || null; // Return the user object or null if not found
  } catch (err) {
    console.error("Error finding user by user_id:", err);
    throw err; // Rethrow the error for handling in the calling function
  }
}

/**
 * Get all messages with their timestamps.
 * @returns {Promise<Array>} - A list of messages with timestamps.
 */
async function getAllMessages() {
  const query = `
    SELECT text, created_at
    FROM messages
    ORDER BY created_at DESC;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching messages:", err);
    throw err;
  }
}

/**
 * Get all messages with the first name, username, and timestamps.
 * @returns {Promise<Array>} - A list of messages with first name, username, and timestamps.
 */
async function getAllMessagesWithUsernames() {
  const query = `
    SELECT 
      messages.text, 
      messages.created_at, 
      users.username,
      SPLIT_PART(users.full_name, ' ', 1) AS first_name  -- Extracts the first name
    FROM messages
    INNER JOIN users ON messages.user_id = users.user_id
    ORDER BY messages.created_at DESC;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching messages with usernames:", err);
    throw err;
  }
}

/**
 * Get all messages with message_id, usernames, full names, and timestamps.
 * @returns {Promise<Array>} - A list of messages with message_id, usernames, full names, and timestamps.
 */
async function getAllMessagesWithUserDetails() {
  const query = `
    SELECT 
      messages.message_id,  -- Include the message ID
      messages.text, 
      messages.created_at, 
      users.username, 
      users.full_name
    FROM messages
    INNER JOIN users ON messages.user_id = users.user_id
    ORDER BY messages.created_at DESC;
  `;

  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching messages with user details:", err);
    throw err;
  }
}

/**
 * Add a new message to the message board.
 * @param {number} userId - The ID of the user posting the message.
 * @param {string} text - The content of the message.
 */
async function addNewMessage(userId, text, timestamp) {
  const query = `
    INSERT INTO messages (user_id, text, created_at)
    VALUES ($1, $2, $3)
  `;
  const values = [userId, text, timestamp];

  try {
    await pool.query(query, values);
  } catch (err) {
    console.error("Error adding new message:", err);
    throw err;
  }
}

/**
 * Update the membership status of a user.
 * @param {number} userId - The user's ID.
 * @param {string} newStatus - The new membership status ('regular', 'secret', 'admin').
 * @returns {Promise<void>}
 */
async function updateUserStatus(userId, newStatus) {
  const query = `
    UPDATE users
    SET member_status = $1
    WHERE user_id = $2
  `;

  try {
    await pool.query(query, [newStatus, userId]);
    console.log(`User ID ${userId} status updated to '${newStatus}'`);
  } catch (err) {
    console.error("Error updating user status:", err);
    throw err;
  }
}

// Delete a single message by ID
async function deleteMessageById(messageId) {
  try {
    await pool.query("DELETE FROM messages WHERE message_id = $1", [messageId]);
  } catch (err) {
    console.error("Error deleting message:", err);
    throw err;
  }
}

// Delete all messages
async function deleteAllMessages() {
  try {
    await pool.query("DELETE FROM messages");
  } catch (err) {
    console.error("Error deleting all messages:", err);
    throw err;
  }
}

module.exports = {
  addUser,
  findUserByUsername,
  findUserById,
  getAllMessages,
  getAllMessagesWithUsernames,
  getAllMessagesWithUserDetails,
  addNewMessage,
  updateUserStatus,
  deleteMessageById,
  deleteAllMessages,
};
