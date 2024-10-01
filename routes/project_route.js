const express = require("express");
const router = express.Router();


const project_controller = require("../controllers/project_controller");

router.get("/:course_id", project_controller.get_course_project);

router.post("/submit", project_controller.submit_course_project);

router.get("/review/:project_id", project_controller.get_course_project_review);


module.exports = router;

