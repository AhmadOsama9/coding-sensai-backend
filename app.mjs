import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import serverless from "serverless-http";

// Load environment variables
dotenv.config();

console.log("the google clientId is: ", process.env.GOOGLE_CLIENT_ID); 

// Import authentication strategies
import "./auth/google_strategy.js";
import "./auth/github_strategy.js";
import { authenticateToken } from "./middlewares/auth_middleware.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://codingsensai.dev",
    "https://www.codingsensai.dev",
  ]
}));

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

// Mostly will remove the /api from here
// And use it in the custome domain instead
// Or use api.codingsensai.dev


// Routes
app.use("/api/user/auth", (await import("./routes/user_auth_routes.js")).default);
app.use("/api/payment", (await import("./routes/payment_routes.js")).default);
app.use("/api/dashboard", (await import("./routes/dashboard_routes.js")).default);
app.use("/api/course", (await import("./routes/course_route.js")).default);
app.use("/api/milestone", (await import("./routes/milestone_route.js")).default);
app.use("/api/mistake", (await import("./routes/common_mistake_route.js")).default);
app.use("/api/resource", (await import("./routes/recourse_route.js")).default);
app.use("/api/code", (await import("./routes/code_example_route.js")).default);
app.use("/api/assignment", (await import("./routes/assignment_route.js")).default);
app.use("/api/project", (await import("./routes/project_route.js")).default);

// Add a hello route for testing
app.get("/api/", (req, res) => {
  res.json({
    message: "Hello World"
  });
});

// Export the app for serverless-http
export const handler = serverless(app);

// For local testing
// if (process.env.LOCAL_TEST) {
//   const port = process.env.PORT || 3000;
//   app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
//   });
// }
