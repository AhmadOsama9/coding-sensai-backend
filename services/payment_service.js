const payment_repository = require("../repositories/payment_repository");

const PAYMENT_PERIOD = {
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

// Common validation function
const validateSubscriptionData = (user_id, amount, currency, period, cryptomus_uuid) => {
    if (!user_id || !amount || !currency || !period || !cryptomus_uuid) {
        throw new ValidationError("Missing parameters");
    }

    if (amount <= 0) {
        throw new ValidationError("Invalid amount");
    }

    if (!Object.values(PAYMENT_PERIOD).includes(period.toLowerCase())) {
        throw new ValidationError("Invalid period");
    }
};

const process_subscription_success = async (user_id, amount, currency, period, start_date, end_date, cryptomus_uuid) => {
    try {
        validateSubscriptionData(user_id, amount, currency, period, cryptomus_uuid);
        await payment_repository.handle_subscription_success(user_id, amount, currency, period, start_date, end_date, cryptomus_uuid);
    } catch (err) {
        console.error("Error in process_subscription_success: ", err);
        throw new ValidationError(`Failed to process subscription success: ${err.message}`);
    }
};

const process_subscription_failure = async (user_id, amount, currency, period, cryptomus_uuid) => {
    try {
        validateSubscriptionData(user_id, amount, currency, period, cryptomus_uuid);
        await payment_repository.handle_subscription_failure(user_id, amount, currency, period, cryptomus_uuid);
    } catch (err) {
        console.error("Error in process_subscription_failure: ", err);
        throw new ValidationError(`Failed to process subscription failure: ${err.message}`);
    }
};

const process_subscription_cancellation = async (user_id) => {
    try {
        if (!user_id) {
            throw new ValidationError("Missing user_id");
        }
        await payment_repository.handle_subscription_cancellation(user_id);
    } catch (err) {
        console.error("Error in process_subscription_cancellation: ", err);
        throw new ValidationError(`Failed to process subscription cancellation: ${err.message}`);
    }
};

const process_webhook = async (event_type, payload, provider) => {
    try {
        if (!event_type || !payload || !provider) {
            throw new ValidationError("Missing parameters");
        }
        await payment_repository.log_webhook_event(event_type, JSON.stringify(payload), provider);
    } catch (err) {
        console.error("Error in process_webhook: ", err);
        throw new ValidationError(`Failed to process webhook: ${err.message}`);
    }
};

module.exports = {
    process_subscription_success,
    process_subscription_failure,
    process_subscription_cancellation,
    process_webhook
};
