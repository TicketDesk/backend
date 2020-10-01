const db = require("../../users/userModel");
const passport = require("passport");
const Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: process.env.TOKEN_SECRET,
  ignoreExpiration: false,
  passReqToCallback: false,
};

passport.use(
  "jwt",
  new Strategy(opts, function (jwtPayload, verify) {
    db.findById(jwtPayload.sub)
      .then((user) => {
        if (!user) {
          return verify(null, false, "Invalid user id");
        } else {
          return verify(null, user);
        }
      })
      .catch((err) => {
        return verify(err);
      });
  })
);
