const crypto = require('crypto');

require('dotenv').config();

// Middleware for IP verification
const verify_ip = (req, res, next) => {
    const allowedIP = "91.227.144.54";
    const requestIP = req.headers['x-real-ip'] || req.connection.remoteAddress;
    if (requestIP !== allowedIP) {
        console.error("Unauthorized request from: ", requestIP);
        return res.status(401).send("Unauthorized");
    }
    next();
};

// Middleware for signature verification
const verify_signature = (req, res, next) => {
    const secret = process.env.CRYPTOMUSE_API_KEY;
    const payload = JSON.stringify(req.body);
    const signature = crypto.createHash('md5').update(Buffer.from(payload).toString('base64') + secret).digest("hex");
    if (req.body.sign !== signature) {
        console.error("Invalid signature");
        return res.status(401).send("Unauthorized");
    }
    next();
};


module.exports = { 
    verify_ip, 
    verify_signature 
};