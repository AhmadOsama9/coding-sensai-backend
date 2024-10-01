const express = require("express");
const router = express.Router();

const assignment_controller = require("../controllers/assignment_controller");

router.get("/:topic_id", assignment_controller.get_assignment_by_topic_id);

router.post("/:assignment_id/complete", assignment_controller.mark_assignment_as_completed);

module.exports = router;