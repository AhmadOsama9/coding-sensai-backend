const express = require("express");
const passport = require("passport");

const router = express.Router();

const user_auth_controller = require("../controllers/user_auth_controller")

/**
 * @swagger
 * tags:
 *   name: OAuth Authentication
 *   description: API endpoints for third-party authentication
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthResponse:
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
 *               description: User ID
 *             username:
 *               type: string
 *               description: Username
 *             email:
 *               type: string
 *               description: User email
 *             profile_picture:
 *               type: string
 *               description: URL to user's profile picture
 *       example:
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "60d21b4967d0d8992e610c85"
 *           username: "johndoe"
 *           email: "user@example.com"
 *           profile_picture: "https://lh3.googleusercontent.com/a/example"
 */

/**
 * @swagger
 * /api/user/auth/google:
 *   get:
 *     summary: Google OAuth login
 *     tags: [OAuth Authentication]
 *     description: Redirects user to Google authentication page
 *     responses:
 *       302:
 *         description: Redirects to Google authentication
 */
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

/**
 * @swagger
 * /api/user/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [OAuth Authentication]
 *     description: Callback endpoint for Google OAuth process
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Google
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Authentication failed
 */
router.get("/google/callback", passport.authenticate("google", { 
    session: false, }),
    user_auth_controller.auth_callback
);

/**
 * @swagger
 * /api/user/auth/github:
 *   get:
 *     summary: GitHub OAuth login
 *     tags: [OAuth Authentication]
 *     description: Redirects user to GitHub authentication page
 *     responses:
 *       302:
 *         description: Redirects to GitHub authentication
 */
router.get("/github", passport.authenticate("github", { scope: ["read:user", "user:email"] }));

/**
 * @swagger
 * /api/user/auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback
 *     tags: [OAuth Authentication]
 *     description: Callback endpoint for GitHub OAuth process
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from GitHub
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Authentication failed
 */
router.get("/github/callback", passport.authenticate("github", { 
    session: false, }),
    user_auth_controller.auth_callback
);

module.exports = router;