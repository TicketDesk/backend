const db = require("../../users/userModel");
const bcrypt = require("bcrypt");
const passport = require("passport");
const Strategy = require("passport-local").Strategy;

passport.use(
  "login",
  new Strategy({ usernameField: "email" }, function (email, password, verify) {
    db.findByEmail(email)
      .then((user) => {
        console.log("USER", user);
        if (!user) {
          return verify(null, false, "Invalid email/password combination");
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return verify(null, false, "Invalid email/password combination");
        }
        return verify(null, user);
      })
      .catch((err) => {
        return verify(err, "testtest");
      });
  })
);
