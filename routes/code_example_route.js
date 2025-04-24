const express = require("express");
const router = express.Router();

const code_example_controller = require("../controllers/code_example_controller");

/**
 * @swagger
 * tags:
 *   name: Code Examples
 *   description: API endpoints for retrieving code examples
 */

/**
 * @swagger
 * /api/code-example/{code_id}:
 *   get:
 *     summary: Get code example by ID
 *     tags: [Code Examples]
 *     description: Retrieve a specific code example by its unique identifier
 *     parameters:
 *       - in: path
 *         name: code_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the code example to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Code example data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Code example not found
 *       500:
 *         description: Server error
 */
router.get("/:code_id", code_example_controller.get_code_by_id);

module.exports = router;