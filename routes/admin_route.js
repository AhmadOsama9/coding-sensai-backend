const express = require("express");
const router = express.Router();

const admin_controller = require("../controllers/admin_controller");
const { authorizeRole } = require("../middlewares/authorize_role");

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management and access control
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AdminLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email address
 *         password:
 *           type: string
 *           format: password
 *           description: Admin password
 *       example:
 *         email: admin@codingsensai.com
 *         password: securePassword123
 *
 *     AdminLoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT token for authentication
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               description: Admin user ID
 *             email:
 *               type: string
 *               description: Admin email
 *             role:
 *               type: string
 *               description: User role (admin)
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "60d21b4967d0d8992e610c85"
 *           email: "admin@codingsensai.com"
 *           role: "admin"
 *     
 *     Project:
 *       type: object
 *       properties:
 *         project_id:
 *           type: string
 *           description: Unique identifier for the project
 *         user_id:
 *           type: string
 *           description: ID of the user who submitted the project
 *         username:
 *           type: string
 *           description: Username of the project submitter
 *         title:
 *           type: string
 *           description: Project title
 *         description:
 *           type: string
 *           description: Project description
 *         repository_url:
 *           type: string
 *           description: URL to the project repository
 *         live_url:
 *           type: string
 *           description: URL to the live project (if available)
 *         submission_date:
 *           type: string
 *           format: date-time
 *           description: Date when the project was submitted
 *         is_reviewed:
 *           type: boolean
 *           description: Whether the project has been reviewed
 *         review_comment:
 *           type: string
 *           description: Admin's review comments
 *         review_date:
 *           type: string
 *           format: date-time
 *           description: Date when the project was reviewed
 *       example:
 *         project_id: "60d21b4967d0d8992e610c85"
 *         user_id: "60d21b4967d0d8992e610c86"
 *         username: "student_coder"
 *         title: "Personal Portfolio Website"
 *         description: "A responsive portfolio website built with HTML, CSS, and JavaScript"
 *         repository_url: "https://github.com/student_coder/portfolio"
 *         live_url: "https://student-portfolio.vercel.app"
 *         submission_date: "2023-04-15T10:30:00Z"
 *         is_reviewed: false
 *         review_comment: null
 *         review_date: null
 *     
 *     ProjectReviewRequest:
 *       type: object
 *       required:
 *         - project_id
 *         - review_comment
 *       properties:
 *         project_id:
 *           type: string
 *           description: ID of the project to review
 *         review_comment:
 *           type: string
 *           description: Admin's review comments
 *       example:
 *         project_id: "60d21b4967d0d8992e610c85"
 *         review_comment: "Great work! The code is clean and well-organized. Consider adding more responsive design for mobile devices."
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: "Invalid credentials"
 */

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     description: Authenticate an admin user and return a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminLoginResponse'
 *       401:
 *         description: Invalid credentials
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
router.post("/login", admin_controller.admin_login);

/**
 * @swagger
 * /api/admin/projects:
 *   get:
 *     summary: Get all user projects
 *     tags: [Admin]
 *     description: Retrieve all projects submitted by users for admin review
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Not an admin
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
router.get("/projects", authorizeRole("admin"), admin_controller.fetch_all_users_projects);

/**
 * @swagger
 * /api/admin/projects/review:
 *   put:
 *     summary: Review a project
 *     tags: [Admin]
 *     description: Mark a project as reviewed and add admin feedback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjectReviewRequest'
 *     responses:
 *       200:
 *         description: Project successfully reviewed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Project marked as reviewed successfully"
 *                 project:
 *                   $ref: '#/components/schemas/Project'
 *       400:
 *         description: Invalid request - Missing required fields
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
 *       403:
 *         description: Forbidden - Not an admin
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Project not found
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
router.put("/projects/review", authorizeRole("admin"), admin_controller.mark_project_as_reviewed);

module.exports = router;