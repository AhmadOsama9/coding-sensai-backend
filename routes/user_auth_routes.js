const passport = require("passport");
const express = require("express");
const router = express.Router();
const user_auth_controller = require("../controllers/user_auth_controller");

// Use href to go to the google auth page
// I think we could just handle it from the frontend
// By calling the api/user/auth/google

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
    passport.authenticate("google", { session: false }),
    (req, res, next) => {
        console.log("Google callback route called");
        next();
    },
    user_auth_controller.auth_callback
);

router.get("/github", passport.authenticate("github", { scope: ["read:user", "user:email"] }));

router.get("/github/callback", 
    passport.authenticate("github", { session: false }),
    (req, res, next) => {
        console.log("GitHub callback route called");
        next();
    },
    user_auth_controller.auth_callback
);

module.exports = router;