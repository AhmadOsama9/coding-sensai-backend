const axios = require("axios");
const crypto = require("crypto");
const payment_service = require("../services/payment_service");

require('dotenv').config();

const create_cryptomus_recurring_payment = async (req, res) => {
    try {
        const amount = "15"; // Consider making this dynamic based on user or plan
        const currency = "USDT";
        const name = "Recurring payment"; // Use plan type or descriptive name
        const period = "monthly";

        const data = {
            amount,
            currency,
            name,
            period,
            url_callback: process.env.CRYPTOMUSE_CALLBACK_URL,
        };

        const sign = crypto.createHash("md5")
            .update(Buffer.from(JSON.stringify(data)).toString("base64") + process.env.CRYPTOMUSE_API_KEY)
            .digest("hex");

        const response = await axios.post("https://api.cryptomus.com/v1/recurrence/create", data, {
            headers: {
                "merchant": process.env.CRYPTOMUSE_MERCHANT_ID,
                "sign": sign,
                "Content-Type": "application/json"
            }
        });

        console.log("Response from create_recurring_payment: ", response.data);
        const { url } = response.data.result;

        return res.redirect(`${process.env.CRYPTOMUS_REDIRECT_URL}?url=${url}`);
    } catch (err) {
        console.error("Error in create_recurring_payment: ", err);
        return res.redirect(`${process.env.CRYPTOMUS_REDIRECT_URL}?error=${err.message}`);
    }
};

const create_paddle_recurring_payment = async (req, res) => {
    try {
        // Implementation for Paddle if needed
    } catch (error) {
        console.error("Error in create_paddle_recurring_payment: ", error);
        return res.status(500).send("Internal server error");
    }
};

const cryptomus_webhook_handler = async (req, res) => {
    try {
        const { uuid, status, amount, currency, payment_amount, is_final, user_id, period, start_date, end_date } = req.body;

        const payload = { uuid, status, amount, currency, payment_amount, is_final, user_id, period, start_date, end_date };

        await payment_service.process_webhook(status, payload, 'cryptomus');

        if (!is_final) {
            console.log("Ignoring non-final payment");
            return res.status(200).send("OK");
        }

        switch (status) {
            case 'paid':
                await payment_service.process_subscription_success(user_id, amount, currency, period, start_date, end_date, uuid);
                break;
            case 'fail':
            case 'system_fail':
            case 'refund_fail':
                await payment_service.process_subscription_failure(user_id, amount, currency, period, uuid);
                break;
            case 'cancel':
            case 'refund_process':
                await payment_service.process_subscription_cancellation(user_id);
                break;
            default:
                console.log(`Unhandled webhook status: ${status}`);
                break;
        }

        return res.status(200).send("OK");
    } catch (error) {
        console.error("Error in cryptomus_webhook_handler: ", error);
        return res.status(500).send("Internal server error");
    }
};

const paddle_webhook_handler = async (req, res) => {
    try {
        // Implementation for Paddle if needed
    } catch (error) {
        console.error("Error in paddle_webhook_handler: ", error);
        return res.status(500).send("Internal server error");
    }
};

module.exports = {
    create_cryptomus_recurring_payment,
    cryptomus_webhook_handler,
    create_paddle_recurring_payment,
    paddle_webhook_handler
};
