const user_service = require('../services/user_service');
const crypto = require('crypto');

require('dotenv').config();
// const secretKey = process.env.CRYPTO_SECRET;

// // Function to encrypt the token
// function encrypt(text) {
//     const iv = crypto.randomBytes(12); // AES-GCM standard IV size
//     const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secretKey, 'hex'), iv);

//     let encrypted = cipher.update(text, 'utf8', 'hex');
//     encrypted += cipher.final('hex');
//     const tag = cipher.getAuthTag();

//     return {
//         iv: iv.toString('hex'),
//         encryptedMessage: encrypted,
//         tag: tag.toString('hex')
//     };
// }



// OAuth callback
const auth_callback = async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            throw new Error('Invalid Google profile information');
        }

        const { username, email, providerId, provider, profileImageUrl } = req.user;
        const { token, expires_in} = await user_service.authenticate_or_register_auth_user({ username, email, providerId, provider, profileImageUrl });

        // Encrypt the token before sending it in the URL
        // const encryptedToken = encrypt(token);

        console.log("the redirect url is: ", process.env.FRONTEND_REDIRECT_URL);

        // Redirect to frontend with encrypted token
        return res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?token=${token}&expires_in=${expires_in}&username=${username}&image_url=${profileImageUrl}`);
    } catch (error) {
        console.error("Error during Google auth callback: ", error);
        return res.redirect(`${process.env.FRONTEND_REDIRECT_URL}?error=${error.message}`);
    }
};

module.exports = {
    auth_callback
};
