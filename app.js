const express = require("express");
require("dotenv").config();
const cors = require("cors");
const serverless = require("serverless-http");

require("./auth/google_strategy");
require("./auth/github_strategy");
const { authenticateToken } = require("./middlewares/auth_middleware");

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
  ]
}));

// Middlewares

// Middleware to protect all routes except public ones
app.use((req, res, next) => {
  const publicRoutePatterns = [
    /^\/api\/user\/auth/, // Pattern for user auth routes
    /^\/api\/course$/, // Exact match for /api/course
    /^\/api\/course\/overview\/[^\/]+$/, // Pattern for course overview with course_id
    /^\/api\/$/
  ];

  const isPublicRoute = publicRoutePatterns.some(pattern => pattern.test(req.path));
  if (isPublicRoute) {
    return next();
  }

  authenticateToken(req, res, next);
});

// Routes
app.use("/api/user/auth", require("./routes/user_auth_routes"));
app.use("/api/payment", require("./routes/payment_routes"));
app.use("/api/dashboard", require("./routes/dashboard_routes"));
app.use("/api/course", require("./routes/course_route"));
app.use("/api/milestone", require("./routes/milestone_route"));
app.use("/api/mistake", require("./routes/common_mistake_route"));
app.use("/api/resource", require("./routes/recourse_route"));
app.use("/api/code", require("./routes/code_example_route"));
app.use("/api/assignment", require("./routes/assignment_route"));
app.use("/api/project", require("./routes/project_route"));

// Add a hello route for testing
app.get("/api/", (req, res) => {
  res.json({
    message: "Hello World"
  });
});


// Export the app for serverless-http
module.exports.handler = serverless(app);
