const express = require('express');
const router = express.Router();

const course_controller = require("../controllers/course_controller");

const { check_subscription } = require("../middlewares/check_subscription");


router.get("/", course_controller.get_all_courses);

router.get("/overview/:course_id", course_controller.get_course_overview);

router.get("/full/:course_id", course_controller.get_full_course_and_topic_data);

// will add the check_subscription later on when the payment is being handled correctly
router.get("/user/full/:course_id", course_controller.get_user_full_course_and_topic_data);

router.get("/user/started", course_controller.get_user_enrolled_courses);

// So this here should also be with subscription check
router.post("/enroll/:course_id", course_controller.enroll_user_in_course);



module.exports = router;
