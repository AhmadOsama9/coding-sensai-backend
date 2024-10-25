const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

require('dotenv').config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
  },
  function(accessToken, refreshToken, profile, cb) {
    const { id, displayName, emails, _json } = profile;
    const userEmail = emails[0].value;
    const profileImageUrl = _json.picture; 

    console.log("Google strategy called!!!");
    console.log("Google Profile: ", profile);
    return cb(null, {
      username: displayName,
      email: userEmail,
      providerId: id,
      provider: profile.provider,
      profileImageUrl
    });
  }
));
