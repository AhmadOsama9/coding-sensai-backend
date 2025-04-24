const express = require('express');
const router = express.Router();

const milestone_controller = require("../controllers/milestone_controller");

/**
 * @swagger
 * tags:
 *   name: Milestones
 *   description: API endpoints for managing course milestones
 */

/**
 * @swagger
 * /api/milestone/{milestone_id}:
 *   get:
 *     summary: Get milestone by ID
 *     tags: [Milestones]
 *     description: Retrieve details of a specific milestone
 *     parameters:
 *       - in: path
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the milestone to retrieve
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestone details
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */
router.get("/:milestone_id", milestone_controller.get_milestone_by_id);

/**
 * @swagger
 * /api/milestone/{milestone_id}/complete:
 *   post:
 *     summary: Mark milestone as complete
 *     tags: [Milestones]
 *     description: Mark a specific milestone as completed by the authenticated user
 *     parameters:
 *       - in: path
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the milestone to mark as complete
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Milestone marked as complete
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Milestone not found
 *       500:
 *         description: Server error
 */
router.post("/:milestone_id/complete", milestone_controller.mark_milestone_as_complete);

/**
 * @swagger
 * /api/milestone/{milestone_id}/quiz:
 *   get:
 *     summary: Get random quiz for unsolved milestone
 *     tags: [Milestones]
 *     description: Retrieve a random quiz for a milestone that hasn't been completed yet
 *     parameters:
 *       - in: path
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the milestone to get a quiz for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Random quiz data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Quiz not found or milestone already completed
 *       500:
 *         description: Server error
 */
router.get("/:milestone_id/quiz", milestone_controller.get_random_quiz_for_unsolved_milestone);

/**
 * @swagger
 * /api/milestone/{milestone_id}/quiz/all:
 *   get:
 *     summary: Get all quizzes for solved milestone
 *     tags: [Milestones]
 *     description: Retrieve all quizzes for a milestone that has been completed
 *     parameters:
 *       - in: path
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the completed milestone
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all quizzes for the solved milestone
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Milestone not found or not solved yet
 *       500:
 *         description: Server error
 */
router.get("/:milestone_id/quiz/all", milestone_controller.get_all_quiz_for_solved_milestone);

/**
 * @swagger
 * /api/milestone/quiz/{milestone_id}/{quiz_id}/submit:
 *   post:
 *     summary: Submit answer for milestone quiz
 *     tags: [Milestones]
 *     description: Submit a user's answer for a quiz related to a milestone
 *     parameters:
 *       - in: path
 *         name: milestone_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the milestone
 *       - in: path
 *         name: quiz_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the quiz being answered
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
 *         description: Milestone or quiz not found
 *       500:
 *         description: Server error
 */
router.post("/quiz/:milestone_id/:quiz_id/submit", milestone_controller.submit_quiz);

module.exports = router;