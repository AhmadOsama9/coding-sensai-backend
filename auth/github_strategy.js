const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const axios = require('axios');

require('dotenv').config();

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_REDIRECT_URI,
    scope: ["read:user", "user:email"]
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      // Fetch user emails separately
      const emailResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      const emails = emailResponse.data;
      const primaryEmail = emails.find(email => email.primary && email.verified);

      // Extract other relevant user information from profile
      const { id, displayName, username, provider, _json } = profile;
      const userEmail = primaryEmail ? primaryEmail.email : null;
      const profileImageUrl = _json.avatar_url;  

      console.log("Github Profile: ", profile);

      return cb(null, {
        username: displayName || username,
        email: userEmail,
        providerId: id,
        provider,
        profileImageUrl
      });
    } catch (error) {
      return cb(error);
    }
  }
));
