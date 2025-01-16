-- Create the membership status ENUM type
CREATE TYPE member_status AS ENUM ('regular', 'secret', 'admin');

-- Create the users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(60) NOT NULL,
    username VARCHAR(60) UNIQUE NOT NULL,
    salt TEXT NOT NULL,
    hash TEXT NOT NULL,
    member_status member_status NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the messages table
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,  -- Ensure messages are deleted if user is deleted
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()  -- Changed to TIMESTAMPTZ for timezone handling
);