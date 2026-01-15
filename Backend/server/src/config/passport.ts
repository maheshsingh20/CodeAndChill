import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

// GitHub Strategy - only initialize if credentials are provided
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/api/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this GitHub ID
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      // Check if user exists with the same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      user = new User({
        githubId: profile.id,
        name: profile.displayName || profile.username,
        email: email || `${profile.username}@github.local`,
        profilePicture: profile.photos?.[0]?.value,
        isEmailVerified: true, // GitHub emails are considered verified
        provider: 'github'
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
  console.log('✅ GitHub OAuth strategy initialized');
} else {
  console.log('⚠️  GitHub OAuth disabled - missing credentials');
}

// Google Strategy - only initialize if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      let user = await User.findOne({ googleId: profile.id });
      
      if (user) {
        return done(null, user);
      }

      // Check if user exists with the same email
      const email = profile.emails?.[0]?.value;
      if (email) {
        user = await User.findOne({ email });
        if (user) {
          // Link Google account to existing user
          user.googleId = profile.id;
          await user.save();
          return done(null, user);
        }
      }

      // Create new user
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: email || `${profile.id}@google.local`,
        profilePicture: profile.photos?.[0]?.value,
        isEmailVerified: true, // Google emails are considered verified
        provider: 'google'
      });

      await user.save();
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));
  console.log('✅ Google OAuth strategy initialized');
} else {
  console.log('⚠️  Google OAuth disabled - missing credentials');
}

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;