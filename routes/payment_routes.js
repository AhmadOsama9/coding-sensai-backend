const express = require("express");
const router = express.Router();


const payment_controller = require("../controllers/payment_controller");
const {
    verify_ip,
    verify_signature
} = require("../middlewares/webhook_middleware");


// Create a new payment
router.get("/cryptomus", payment_controller.create_cryptomus_recurring_payment);

router.post("/webhook", verify_ip, verify_signature, payment_controller.cryptomus_webhook_handler);




module.exports = router;