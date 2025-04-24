const express = require('express');
const router = express.Router();

const dashboard_controller = require('../controllers/dashboard_controller');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: API endpoints for user dashboard functionality
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get user dashboard data
 *     tags: [Dashboard]
 *     description: Retrieve personalized dashboard data for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard data including progress and recent activities
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/", dashboard_controller.get_user_dashboard);

/**
 * @swagger
 * /api/dashboard/log:
 *   post:
 *     summary: Log user activity
 *     tags: [Dashboard]
 *     description: Record user activity for tracking and analytics
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - activity_type
 *             properties:
 *               activity_type:
 *                 type: string
 *                 description: Type of activity being logged (e.g., "course_view", "topic_complete")
 *               course_id:
 *                 type: string
 *                 description: ID of the related course (if applicable)
 *               topic_id:
 *                 type: string
 *                 description: ID of the related topic (if applicable)
 *               time_spent:
 *                 type: number
 *                 description: Time spent on the activity in seconds (if applicable)
 *               additional_data:
 *                 type: object
 *                 description: Any additional activity-specific data
 *     responses:
 *       200:
 *         description: Activity logged successfully
 *       400:
 *         description: Invalid request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/log", dashboard_controller.handle_user_logging);

/**
 * @swagger
 * /api/dashboard/completed_topics:
 *   get:
 *     summary: Get user's completed topics
 *     tags: [Dashboard]
 *     description: Retrieve list of topics that have been completed by the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed topics with completion dates
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/completed_topics", dashboard_controller.get_completed_topics);

module.exports = router;