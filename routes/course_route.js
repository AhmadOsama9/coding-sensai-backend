const express = require('express');
const router = express.Router();

const course_controller = require("../controllers/course_controller");

const { check_subscription } = require("../middlewares/check_subscription");

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API endpoints for managing courses
 */

/**
 * @swagger
 * /api/course:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     description: Retrieve a list of all available courses
 *     responses:
 *       200:
 *         description: List of all courses
 *       500:
 *         description: Server error
 */
router.get("/", course_controller.get_all_courses);

/**
 * @swagger
 * /api/course/overview/{course_id}:
 *   get:
 *     summary: Get course overview
 *     tags: [Courses]
 *     description: Retrieve overview information for a specific course
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to get overview for
 *     responses:
 *       200:
 *         description: Course overview data
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/overview/:course_id", course_controller.get_course_overview);

/**
 * @swagger
 * /api/course/full/{course_id}:
 *   get:
 *     summary: Get full course data
 *     tags: [Courses]
 *     description: Retrieve complete course data including topics
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to get full data for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full course and topic data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.get("/full/:course_id", course_controller.get_full_course_and_topic_data);

/**
 * @swagger
 * /api/course/user/full/{course_id}:
 *   get:
 *     summary: Get user's full course data
 *     tags: [Courses]
 *     description: Retrieve complete course data with user-specific progress information
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to get user-specific data for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full course data with user progress
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Course not found or user not enrolled
 *       500:
 *         description: Server error
 */
// will add the check_subscription later on when the payment is being handled correctly
router.get("/user/full/:course_id", course_controller.get_user_full_course_and_topic_data);

/**
 * @swagger
 * /api/course/user/started:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [Courses]
 *     description: Retrieve all courses that the authenticated user has enrolled in
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's enrolled courses with progress information
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.get("/user/started", course_controller.get_user_enrolled_courses);

/**
 * @swagger
 * /api/course/enroll/{course_id}:
 *   post:
 *     summary: Enroll user in a course
 *     tags: [Courses]
 *     description: Enroll the authenticated user in a specific course
 *     parameters:
 *       - in: path
 *         name: course_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course to enroll in
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully enrolled in the course
 *       400:
 *         description: User already enrolled in this course
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
// So this here should also be with subscription check
router.post("/enroll/:course_id", course_controller.enroll_user_in_course);

module.exports = router;