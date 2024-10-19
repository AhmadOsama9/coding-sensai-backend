const { initPool } = require("../config/db");

const pool = initPool();

/*
 1- If Successful, we will update the user_payments table with the payment status as success
    1- If the user has an existing subscription, we will update the user_subscriptions table with the new subscription details
    2- If the user does not have an existing subscription, we will insert a new record in the user_subscriptions table

 2- If Failed, we will update the user_payments table with the payment status as failed
    1- If the user has an existing subscription, we will update the user_subscriptions table with the status as inactive
    2- If the user does not have an existing subscription, we will not do anything

 3- If Cancelled, we will update the user_payments table with the payment status as cancelled
    1- We will update the user_subscriptions table with the status as cancelled

*/

// Define payment and subscription statuses
const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'success',
    FAILED: 'failed',
    CANCELLED: 'cancelled'
};

const SUBSCRIPTION_STATUS = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    INACTIVE: 'inactive' 
};

const PLAN_NAME = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

// Check if user has an existing active subscription
const get_existing_subscription = async (user_id) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(`
            SELECT * FROM user_subscriptions
            WHERE user_id = $1 AND status IN ($2, $3)
            ORDER BY end_date DESC
            LIMIT 1;
        `, [user_id, SUBSCRIPTION_STATUS.ACTIVE, SUBSCRIPTION_STATUS.INACTIVE]);

        return result.rows[0];
    } finally {
        client.release();
    }
};

// Generic handler for subscription success (first-time or renewal)
const handle_subscription_success = async (user_id, provider, amount, currency, period, startDate, endDate, provider_payment_id) => {    
    let client;
    try {
        const existingSubscription = await get_existing_subscription(user_id);
        client = await pool.connect();
        await client.query('BEGIN');
        
        // Update or insert payment record
        await client.query(`
            INSERT INTO user_payments (user_id, provider, amount, currency, provider_paymnet_id, payment_status, payment_period, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (user_id, provider_paymnet_id) DO UPDATE 
            SET amount = EXCLUDED.amount, currency = EXCLUDED.currency, payment_status = EXCLUDED.payment_status, payment_period = EXCLUDED.payment_period, updated_at = NOW();
        `, [user_id, provider, amount, currency, provider_payment_id, PAYMENT_STATUS.SUCCESS, period]);

        // If the user has an existing subscription, update it; otherwise, create a new one
        if (existingSubscription) {
            await client.query(`
                UPDATE user_subscriptions
                SET plan = $1, start_date = $2, end_date = $3, status = $4, updated_at = NOW()
                WHERE user_id = $5;
            `, [PLAN_NAME[period.toUpperCase()], startDate, endDate, SUBSCRIPTION_STATUS.ACTIVE, user_id]);
        } else {
            await client.query(`
                INSERT INTO user_subscriptions (user_id, plan, start_date, end_date, status, updated_at)
                VALUES ($1, $2, $3, $4, $5, NOW());
            `, [user_id, PLAN_NAME[period.toUpperCase()], startDate, endDate, SUBSCRIPTION_STATUS.ACTIVE]);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error('Transaction failed: ' + error.message);
    } finally {
        client.release();
    }
};

// Generic handler for payment failures (first-time or renewal)
const handle_subscription_failure = async (user_id, provider, amount, currency, period, provider_payment_id) => {
    let client;
    try {
        const existingSubscription = await get_existing_subscription(user_id);
        client = await pool.connect();
        await client.query('BEGIN');
        
        // Update payment record to indicate failure
        await client.query(`
            INSERT INTO user_payments (user_id, provider, amount, currency, provider_paymnet_id, payment_status, payment_period, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (user_id, provider_paymnet_id) DO UPDATE 
            SET amount = EXCLUDED.amount, currency = EXCLUDED.currency, payment_status = EXCLUDED.payment_status, payment_period = EXCLUDED.payment_period, updated_at = NOW();
        `, [user_id, provider, amount, currency, provider_payment_id, PAYMENT_STATUS.FAILED, period]);

        // If user already has an active or inactive subscription, mark it as inactive (failed renewal)
        if (existingSubscription) {
            await client.query(`
                UPDATE user_subscriptions
                SET status = $1, updated_at = NOW()
                WHERE user_id = $2;
            `, [SUBSCRIPTION_STATUS.INACTIVE, user_id]);
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error('Transaction failed: ' + error.message);
    } finally {
        client.release();
    }
};

// Generic handler for subscription cancellation
// Handling the payments is kinda of difficutl
// Maybe I could check if the return the provider_payment_id
const handle_subscription_cancellation = async (user_id, provider) => {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');
        
        // Update payment status to reflect the cancellation
        // await client.query(`
        //     UPDATE user_payments
        //     SET payment_status = $1, updated_at = NOW()
        //     WHERE user_id = $2 AND provider = $3;
        // `, [PAYMENT_STATUS.CANCELLED, user_id, provider]);

        // Update subscription status to cancelled\

        await client.query(`
            UPDATE user_subscriptions
            SET status = $1, updated_at = NOW()
            WHERE user_id = $2;
        `, [SUBSCRIPTION_STATUS.CANCELLED, user_id]);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw new Error('Transaction failed: ' + error.message);
    } finally {
        client.release();
    }
};

/*
    CREATE TABLE "webhook_log" (
  "id" SERIAL PRIMARY KEY,
  "event_type" VARCHAR(50) NOT NULL,  -- E.g., payment_success, payment_failed, subscription_cancelled
  "payload" JSONB NOT NULL,  -- To store the entire webhook payload for debugging purposes
  "provider" VARCHAR(50) NOT NULL,  -- To store the payment provider name like cryptomus, paddle, etc.
  "created_at" TIMESTAMP DEFAULT NOW()
);
*/

const log_webhook_event = async (event_type, payload, provider) => {
    let client;
    try {
        client = await pool.connect();
        await client.query(`
            INSERT INTO webhook_log (event_type, payload, provider)
            VALUES ($1, $2, $3);
        `, [event_type, payload, provider]);
    } finally {
        client.release();
    }
};


module.exports = {
    handle_subscription_success,
    handle_subscription_failure,
    handle_subscription_cancellation,
    log_webhook_event
};

