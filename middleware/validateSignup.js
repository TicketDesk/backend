module.exports = function validateSignup(req, res, next) {
  let userInfo = req.body;
  console.log("userinfo", userInfo);
  if (userInfo && userInfo.first_name && userInfo.last_name && userInfo.email) {
    next();
  } else {
    res.status(400).json({ error: "missing required fields" });
  }
};
