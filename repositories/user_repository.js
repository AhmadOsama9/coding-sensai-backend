// userRepository.js
const pool = require('../config/db');
const validator = require("validator");

// Not using ORM makes things difficult and less secure
// But makes it atleast trice as fast

// Sanitize inputs
// I will check it later but it seems to be doing mimal job so kinda of unnecessary
const sanitizeInput = (input) => {
    return validator.escape(input); // Escapes HTML characters
};

// Cause Js is case sensitive
const formatEmail = (email) => {
    return email.toLowerCase();
}

const find_user_by_email = async (email) => {
    try {

        email = formatEmail(email);

        if (!validator.isEmail(email)) {
            throw new Error('Invalid email');
        };


        const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

const get_user_by_id = async (id) => {
    try {
        const result = await pool.query("SELECT username FROM users WHERE id = $1", [id]);
        return result.rows[0];
    } catch (err) {
        throw err;
    }
}

// So for all the users we create we should create for them the user_points
// And give it the process.env.DAILY_LOGIN_POINTS
// But we will need to convert it to a number
/*
CREATE TABLE "user_points" (
  "user_id" INTEGER UNIQUE NOT NULL PRIMARY KEY,
  "total_points" INTEGER NOT NULL DEFAULT 0,
  "updated_at" TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
); 
*/
const create_auth_user = async ({ username, email, providerId, provider, profileImageUrl }) => {
    let client;
    try {
        client = await pool.connect();

        const daily_login_points = parseInt(process.env.DAILY_LOGIN_POINTS);


        email = formatEmail(email);

        if (!validator.isEmail(email)) {
            throw new Error('Invalid email');
        }

        await client.query('BEGIN');

        const userResult = await client.query(
            "INSERT INTO users (username, email, image_url) VALUES ($1, $2, $3) RETURNING id",
            [username, email, profileImageUrl]
        );
        const user = userResult.rows[0];

        await client.query(
            "INSERT INTO user_auths (user_id, is_verified) VALUES ($1, true)",
            [user.id]
        );

        await client.query(
            "INSERT INTO user_social_auths (user_id, provider, provider_id) VALUES ($1, $2, $3)",
            [user.id, provider, providerId]
        );

        // Create the user_points
        // But didn't create the daily login points
        await client.query(
            "INSERT INTO user_points (user_id, total_points) VALUES ($1, $2)",
            [user.id, daily_login_points]
        );

        await client.query('COMMIT');
        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};




module.exports = {
    find_user_by_email,
    get_user_by_id,
    create_auth_user
};
