import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createUser, getUserByEmail } from "../db/user_db";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Handle user lookup/creation
      const email = profile.emails?.[0]?.value;
      const username = profile.displayName;

      if (!email) return done(null, false);

      // lookup user in db, or create
      const user = await getUserByEmail(email) || await createUser({ username, email });
      console.log("User returned from DB:", user);
      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.email);
});

passport.deserializeUser(async (email: string, done) => {
  const user = await getUserByEmail(email);
  done(null, user);
});