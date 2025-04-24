const user_repository = require("../repositories/user_repository");
const { generateToken } = require("../utils/jwt");



const authenticate_or_register_auth_user = async ({ username, email, providerId, provider, profileImageUrl }) => {
    try {
        if (!username || !email || !providerId || !provider || !profileImageUrl) {
            throw new Error('Missing required fields');
        }

        let user = await user_repository.find_user_by_email(email);
        if (!user) {
            user = await user_repository.create_auth_user({ username, email, providerId, provider, profileImageUrl });
        }
    
        return generateToken(user.id, "user");
    } catch(err) {
        console.error('Error during user authentication or registration: ', err);
        throw new Error('Error during user authentication or registration');
    }

}

module.exports = { 
    authenticate_or_register_auth_user
};
