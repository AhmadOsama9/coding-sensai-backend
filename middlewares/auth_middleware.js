const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Error in authenticateToken:", err);
      return res.status(403).json({ error: "Invalid token. Make sure you are logged in." });
    }
    req.user = decoded; // Attach full payload, including role
    next();
  });
};

module.exports = { authenticateToken };
