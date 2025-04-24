const express = require("express");
const router = express.Router();

const assignment_controller = require("../controllers/assignment_controller");

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: API endpoints for managing course assignments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       properties:
 *         assignment_id:
 *           type: string
 *           description: Unique identifier for the assignment
 *         topic_id:
 *           type: string
 *           description: ID of the topic this assignment belongs to
 *         title:
 *           type: string
 *           description: Assignment title
 *         description:
 *           type: string
 *           description: Detailed description of the assignment
 *         instructions:
 *           type: string
 *           description: Step-by-step instructions to complete the assignment
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level of the assignment
 *         estimated_time:
 *           type: string
 *           description: Estimated time to complete (e.g., "2 hours")
 *         resources:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Resource title
 *               url:
 *                 type: string
 *                 description: URL to the resource
 *           description: Additional resources to help with the assignment
 *       example:
 *         assignment_id: "60d21b4967d0d8992e610c85"
 *         topic_id: "60d21b4967d0d8992e610c86"
 *         title: "Build a Responsive Navigation Bar"
 *         description: "Create a responsive navigation bar that collapses into a hamburger menu on mobile devices."
 *         instructions: "1. Create HTML structure with nav, ul, and li elements. 2. Style with CSS flexbox. 3. Add media queries for mobile responsiveness. 4. Implement JavaScript for toggle functionality."
 *         difficulty: "intermediate"
 *         estimated_time: "2 hours"
 *         resources:
 *           - title: "CSS Flexbox Guide"
 *             url: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/"
 *           - title: "Mobile Navigation Examples"
 *             url: "https://www.w3schools.com/howto/howto_js_mobile_navbar.asp"
 *     
 *     AssignmentCompletionRequest:
 *       type: object
 *       properties:
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the assignment was completed
 *       example:
 *         completed_at: "2023-05-15T14:30:00Z"
 *     
 *     AssignmentCompletionResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         assignment_id:
 *           type: string
 *           description: ID of the completed assignment
 *         user_id:
 *           type: string
 *           description: ID of the user who completed the assignment
 *         completed_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the assignment was completed
 *       example:
 *         message: "Assignment marked as completed"
 *         assignment_id: "60d21b4967d0d8992e610c85"
 *         user_id: "60d21b4967d0d8992e610c87"
 *         completed_at: "2023-05-15T14:30:00Z"
 *     
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Assignment not found"
 */

/**
 * @swagger
 * /api/assignment/{topic_id}:
 *   get:
 *     summary: Get assignment by topic ID
 *     tags: [Assignments]
 *     description: Retrieve the assignment details for a specific topic
 *     parameters:
 *       - in: path
 *         name: topic_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the topic
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assignment not found for the specified topic
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:topic_id", assignment_controller.get_assignment_by_topic_id);

/**
 * @swagger
 * /api/assignment/{assignment_id}/complete:
 *   post:
 *     summary: Mark assignment as completed
 *     tags: [Assignments]
 *     description: Mark a specific assignment as completed by the authenticated user
 *     parameters:
 *       - in: path
 *         name: assignment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the assignment to mark as completed
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignmentCompletionRequest'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignment successfully marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AssignmentCompletionResponse'
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Assignment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/:assignment_id/complete", assignment_controller.mark_assignment_as_completed);

module.exports = router;