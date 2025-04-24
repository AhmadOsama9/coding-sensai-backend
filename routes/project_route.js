const express = require("express");
const router = express.Router();

const project_controller = require("../controllers/project_controller");

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing course projects and submissions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProjectSubmission:
 *       type: object
 *       required:
 *         - course_id
 *         - title
 *         - description
 *         - repository_url
 *       properties:
 *         course_id:
 *           type: string
 *           description: ID of the course the project is for
 *         title:
 *           type: string
 *           description: Title of the project
 *         description:
 *           type: string
 *           description: Description of what the project does
 *         repository_url:
 *           type: string
 *           description: URL to the project repository (GitHub, GitLab, etc.)
 *         live_url:
 *           type: string
 *           description: Optional URL to the deployed project
 */

/**
 * @swagger
 * /api/project/{course_id}:
 *   get:
 *     summary: Get course project details
 *     tags: [Projects]
 *     description: Retrieve project requirements and details for a specific course
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to get project details for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course project details
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Project not found for this course
 *       500:
 *         description: Server error
 */
router.get("/:course_id", project_controller.get_course_project);

/**
 * @swagger
 * /api/project/submit:
 *   post:
 *     summary: Submit a course project
 *     tags: [Projects]
 *     description: Submit a completed project for a course
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectSubmission'
 *     responses:
 *       201:
 *         description: Project submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project submitted successfully"
 *                 project_id:
 *                   type: string
 *                   description: ID of the submitted project
 *       400:
 *         description: Invalid request - Missing required fields
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/submit", project_controller.submit_course_project);

/**
 * @swagger
 * /api/project/review/{project_id}:
 *   get:
 *     summary: Get project review
 *     tags: [Projects]
 *     description: Retrieve the review for a submitted project
 *     parameters:
 *       - in: path
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project to get review for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Project review details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 is_reviewed:
 *                   type: boolean
 *                   description: Whether the project has been reviewed
 *                 review_comment:
 *                   type: string
 *                   description: Feedback from the reviewer
 *                 review_date:
 *                   type: string
 *                   format: date-time
 *                   description: When the review was completed
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Not authorized to view this review
 *       404:
 *         description: Project or review not found
 *       500:
 *         description: Server error
 */
router.get("/review/:project_id", project_controller.get_course_project_review);

module.exports = router;