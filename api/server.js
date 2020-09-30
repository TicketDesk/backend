const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
// require("../passport/index");
require("dotenv").config();

const userRouter = require("../users/userRouter");

const server = express();
server.use(helmet());
server.use(express());
server.use(express.json());
// server.use(passport.initialize());
server.use(cors());
server.use("/api/user", userRouter);

module.exports = server;
