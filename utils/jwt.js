const jwt = require("jsonwebtoken");


const generateToken = (user_id) => {

    if (!process.env.JWT_SECRET || !user_id) {
        throw new Error('JWT_SECRET and user_id are required');
    }

    const expiresIn = '10d'; // 10 days
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn });
    
    // Calculate expiration time in seconds
    const expirationTimeInSeconds = Math.floor(Date.now()) + (10 * 24 * 60 * 60); // 10 days from now
    
    return {
        token,
        expires_in: expirationTimeInSeconds // Send the expiration time in seconds
    };
};

module.exports = { generateToken };