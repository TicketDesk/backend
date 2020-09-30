const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const passport = require("passport");
const path = require("path");
const http = require("http");
require("../passport/index");
require("dotenv").config();

const userRouter = require("../users/userRouter");

const server = express();
server.use(helmet());
server.use(cors());
server.use(express());
server.use(express.json());
server.use(passport.initialize());

server.use("/api/user", userRouter);
server.use(express.static(path.join(__dirname, "public")));

server.get("/", (req, res) => {
  res.status(200).json("server up");
});

module.exports = server;
