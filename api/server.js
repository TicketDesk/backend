const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const path = require("path");
require("../passport/index");
require("dotenv").config();

const authRouter = require("../auth/authRouter");
const userRouter = require("../users/userRouter");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express());
server.use(express.json());
server.use(passport.initialize());

server.use("/api/auth", authRouter);
server.use(
  "/api/user",
  passport.authenticate("jwt", { session: false }),
  userRouter
);
server.use(express.static(path.join(__dirname, "public")));

server.get("/", (req, res) => {
  res.status(200).json("server up");
});

module.exports = server;
