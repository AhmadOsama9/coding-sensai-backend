const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;



const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Error in authenticateToken: ", err);
            return res.status(403).json({ error: "Invalid token, make suer you are logged in" });
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };