const User = require("../models/User");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, same) => {
        if (same) {
          // USER SESSION
          req.session.userID = user._id;
          res.status(200).redirect("/");
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
}

function logoutUser(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
};
