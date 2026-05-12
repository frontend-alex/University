import passport from "passport";

import { config } from "./config";
import { Utils } from "../utils/utils";
import { AuthRepository } from "../repositories/admin/authRepository";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { UserRepository } from "../repositories/user/userRepository";

const authRepository = new AuthRepository();
const userRepository = new UserRepository();

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID!,
      clientSecret: config.GOOGLE_SECRET!,
      callbackURL: `${config.BACKEND_URL}/api/auth/google/callback`,
      passReqToCallback: true
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const username = profile.displayName;
        const imageUrl = profile.photos?.[0]?.value || Utils.generateAvatar(username);

        if (!email) {
          return done(new Error("Google account email is missing"));
        }

        let user = await userRepository.findByEmail(email);

        if (!user) {
          user = await authRepository.createGoogleUser(email, username, imageUrl);
        }

        return done(null, user);
      } catch (error) {
        console.error('Google auth error:', error);
        return done(error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await userRepository.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;