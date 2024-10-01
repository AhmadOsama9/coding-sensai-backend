const express = require("express");
const router = express.Router();


const resource_controller = require("../controllers/resource_controller");

router.get("/:topic_id", resource_controller.get_resource_by_topic_id);


module.exports = router;