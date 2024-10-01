const express = require('express');
const router = express.Router();

const common_mistake_controller = require("../controllers/common_mistake_controller");


router.get("/:mistake_id", common_mistake_controller.get_common_mistake_by_id);

router.post("/:mistake_id/complete", common_mistake_controller.mark_common_mistake_as_complete);

router.get("/:mistake_id/quiz", common_mistake_controller.get_random_quiz_for_unsolved_mistake);

router.get("/:mistake_id/quiz/all", common_mistake_controller.get_all_quiz_for_solved_mistake);

router.post("/quiz/:mistake_id/:quiz_id/submit", common_mistake_controller.submit_mistake_quiz);

module.exports = router;