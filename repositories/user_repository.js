// userRepository.js
const { initPool } = require("../config/db");
const pool = initPool();
const validator = require("validator");
require('dotenv').config();

const sanitizeInput = (input) => {
    return validator.escape(input); // Escapes HTML characters
};

const formatEmail = (email) => {
    return email.toLowerCase();
}

const find_user_by_email = async (email) => {
    try {
        console.log("Starting find_user_by_email with email:", email);

        email = formatEmail(email);
        console.log("Formatted email:", email);

        if (!validator.isEmail(email)) {
            console.error("Invalid email format detected:", email);
            throw new Error('Invalid email');
        };

        console.log("Executing query: SELECT id FROM users WHERE email = $1 with email:", email);
        const result = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        
        if (result.rows.length === 0) {
            console.log("No user found with email:", email);
        } else {
            console.log("User found with ID:", result.rows[0].id);
        }
        
        return result.rows[0];
    } catch (err) {
        console.error("Error in find_user_by_email:", err);
        throw err;
    }
}

const get_user_by_id = async (id) => {
    try {
        console.log("Starting get_user_by_id with ID:", id);
        const result = await pool.query("SELECT username FROM users WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            console.log("No user found with ID:", id);
        } else {
            console.log("User found with username:", result.rows[0].username);
        }
        
        return result.rows[0];
    } catch (err) {
        console.error("Error in get_user_by_id:", err);
        throw err;
    }
}

const create_auth_user = async ({ username, email, providerId, provider, profileImageUrl }) => {
    let client;
    try {
        console.log("Starting create_auth_user with email:", email);
        client = await pool.connect();

        const daily_login_points = parseInt(process.env.DAILY_LOGIN_POINTS);
        console.log("Daily login points:", daily_login_points);

        email = formatEmail(email);

        if (!validator.isEmail(email)) {
            console.error("Invalid email format detected:", email);
            throw new Error('Invalid email');
        }

        await client.query('BEGIN');

        console.log("Inserting into users table with username:", username);
        const userResult = await client.query(
            "INSERT INTO users (username, email, image_url) VALUES ($1, $2, $3) RETURNING id",
            [username, email, profileImageUrl]
        );
        const user = userResult.rows[0];
        console.log("User created with ID:", user.id);

        console.log("Inserting into user_auths table");
        await client.query(
            "INSERT INTO user_auths (user_id, is_verified) VALUES ($1, true)",
            [user.id]
        );

        console.log("Inserting into user_social_auths table");
        await client.query(
            "INSERT INTO user_social_auths (user_id, provider, provider_id) VALUES ($1, $2, $3)",
            [user.id, provider, providerId]
        );

        console.log("Inserting into user_points table with points:", daily_login_points);
        await client.query(
            "INSERT INTO user_points (user_id, total_points) VALUES ($1, $2)",
            [user.id, daily_login_points]
        );

        await client.query('COMMIT');
        console.log("User creation transaction committed successfully");
        return user;
    } catch (err) {
        console.error("Error in create_auth_user:", err);
        await client.query('ROLLBACK');
        throw err;
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    find_user_by_email,
    get_user_by_id,
    create_auth_user
};