// name: coding-sensai-db
// pass: cbS2P&RqWR9*u2
// username: postgres
// port: 5432
// AWS KMS key: alias/aws/rds
const { Pool } = require('pg');
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
        });
    }
    return pool;
};

module.exports = { initPool };
