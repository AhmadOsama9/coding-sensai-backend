const express = require('express');
const router = express.Router();

const milestone_controller = require("../controllers/milestone_controller");


router.get("/:milestone_id", milestone_controller.get_milestone_by_id);

router.post("/:milestone_id/complete", milestone_controller.mark_milestone_as_complete);

router.get("/:milestone_id/quiz", milestone_controller.get_random_quiz_for_unsolved_milestone);

router.get("/:milestone_id/quiz/all", milestone_controller.get_all_quiz_for_solved_milestone);

router.post("/quiz/:milestone_id/:quiz_id/submit", milestone_controller.submit_quiz);


module.exports = router;