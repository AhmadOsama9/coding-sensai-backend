const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboard_controller');


router.get("/", dashboard_controller.get_user_dashboard);

router.post("/log", dashboard_controller.handle_user_logging);

router.get("/completed_topics", dashboard_controller.get_completed_topics);

module.exports = router;