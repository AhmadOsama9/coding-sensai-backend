const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

let pool;

const initPool = () => {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            max: 10,
            ssl: {
                rejectUnauthorized: true,  // Ensure SSL certificate verification
                ca: fs.readFileSync('./certs/us-east-1-bundle.pem').toString(),  // Point to the downloaded certificate
            }
        });
    }
    return pool;
};

module.exports = { initPool };
