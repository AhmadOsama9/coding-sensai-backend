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
            ssl: {
                rejectUnauthorized: true,  // Ensure SSL certificate verification
                ca: fs.readFileSync('./certs/us-east-1-bundle.pem').toString(),  // Point to the downloaded certificate
            }
        });
    }
    return pool;
};

// I removed the max 10 cause since it is a lambda it will need one connection
// But that makes me wonder will the pool be of use cause assuming it is a lambda then the pool has no use
// So yeah both of them are meaningless
// And I should be using serverless database instead of RDS

module.exports = { initPool };
