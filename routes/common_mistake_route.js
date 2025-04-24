const express = require('express');
const router = express.Router();

const common_mistake_controller = require("../controllers/common_mistake_controller");

/**
 * @swagger
 * tags:
 *   name: Common Mistakes
 *   description: API endpoints for managing common programming mistakes
 */

/**
 * @swagger
 * /api/common-mistake/{mistake_id}:
 *   get:
 *     summary: Get common mistake by ID
 *     tags: [Common Mistakes]
 *     description: Retrieve details of a specific common mistake
 *     parameters:
 *       - in: path
 *         name: mistake_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the common mistake to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Common mistake data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Common mistake not found
 *       500:
 *         description: Server error
 */
router.get("/:mistake_id", common_mistake_controller.get_common_mistake_by_id);

/**
 * @swagger
 * /api/common-mistake/{mistake_id}/complete:
 *   post:
 *     summary: Mark common mistake as complete
 *     tags: [Common Mistakes]
 *     description: Mark a specific common mistake as completed by the user
 *     parameters:
 *       - in: path
 *         name: mistake_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the common mistake to mark as complete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Common mistake marked as complete
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Common mistake not found
 *       500:
 *         description: Server error
 */
router.post("/:mistake_id/complete", common_mistake_controller.mark_common_mistake_as_complete);

/**
 * @swagger
 * /api/common-mistake/{mistake_id}/quiz:
 *   get:
 *     summary: Get random quiz for unsolved mistake
 *     tags: [Common Mistakes]
 *     description: Retrieve a random quiz for a mistake the user hasn't solved yet
 *     parameters:
 *       - in: path
 *         name: mistake_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the common mistake to get a quiz for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Random quiz data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Quiz not found or mistake already solved
 *       500:
 *         description: Server error
 */
router.get("/:mistake_id/quiz", common_mistake_controller.get_random_quiz_for_unsolved_mistake);

/**
 * @swagger
 * /api/common-mistake/{mistake_id}/quiz/all:
 *   get:
 *     summary: Get all quizzes for solved mistake
 *     tags: [Common Mistakes]
 *     description: Retrieve all quizzes for a mistake the user has already solved
 *     parameters:
 *       - in: path
 *         name: mistake_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the solved common mistake
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quizzes for the solved mistake
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Mistake not found or not solved yet
 *       500:
 *         description: Server error
 */
router.get("/:mistake_id/quiz/all", common_mistake_controller.get_all_quiz_for_solved_mistake);

/**
 * @swagger
 * /api/common-mistake/quiz/{mistake_id}/{quiz_id}/submit:
 *   post:
 *     summary: Submit answer for mistake quiz
 *     tags: [Common Mistakes]
 *     description: Submit a user's answer for a quiz related to a common mistake
 *     parameters:
 *       - in: path
 *         name: mistake_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the common mistake
 *       - in: path
 *         name: quiz_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the quiz being answered
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - answer
 *             properties:
 *               answer:
 *                 type: string
 *                 description: The user's answer to the quiz
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz answer submission result
 *       400:
 *         description: Invalid request - Missing answer
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Mistake or quiz not found
 *       500:
 *         description: Server error
 */
router.post("/quiz/:mistake_id/:quiz_id/submit", common_mistake_controller.submit_mistake_quiz);

module.exports = router;