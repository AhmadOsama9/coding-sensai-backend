const express = require("express");
const router = express.Router();

const resource_controller = require("../controllers/resource_controller");

/**
 * @swagger
 * tags:
 *   name: Resources
 *   description: API endpoints for accessing educational resources
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         resource_id:
 *           type: string
 *           description: Unique identifier for the resource
 *         topic_id:
 *           type: string
 *           description: ID of the topic this resource belongs to
 *         title:
 *           type: string
 *           description: Title of the resource
 *         description:
 *           type: string
 *           description: Brief description of the resource
 *         url:
 *           type: string
 *           description: URL to access the resource
 *         type:
 *           type: string
 *           description: Type of resource (article, video, book, etc.)
 *         difficulty:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *           description: Difficulty level of the resource
 *       example:
 *         resource_id: "60d21b4967d0d8992e610c85"
 *         topic_id: "60d21b4967d0d8992e610c86"
 *         title: "Introduction to CSS Grid"
 *         description: "A comprehensive guide to using CSS Grid for layouts"
 *         url: "https://css-tricks.com/snippets/css/complete-guide-grid/"
 *         type: "article"
 *         difficulty: "intermediate"
 */

/**
 * @swagger
 * /api/resource/{topic_id}:
 *   get:
 *     summary: Get resources by topic ID
 *     tags: [Resources]
 *     description: Retrieve all resources related to a specific topic
 *     parameters:
 *       - in: path
 *         name: topic_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the topic to get resources for
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of resources for the topic
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Resource'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: No resources found for this topic
 *       500:
 *         description: Server error
 */
router.get("/:topic_id", resource_controller.get_resource_by_topic_id);

module.exports = router;