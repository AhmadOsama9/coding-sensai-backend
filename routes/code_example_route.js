const express = require("express");
const router = express.Router();


const code_example_controller = require("../controllers/code_example_controller");

router.get("/:code_id", code_example_controller.get_code_by_id);


module.exports = router;