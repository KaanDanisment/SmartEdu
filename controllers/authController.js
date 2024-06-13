const bcrypt = require("bcrypt");
const User = require("../models/User");
const Category = require("../models/Category");
const Courses = require("../models/Course");

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
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
        // USER SESSION
        req.session.userID = user._id;
        res.status(200).redirect("/user/dashboard");
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
async function getDashboardPage(req, res) {
  const user = await User.findOne({ _id: req.session.userID }).populate(
    "courses"
  );
  const categories = await Category.find();
  const courses = await Courses.find({ user: req.session.userID });
  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
  });
}
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getDashboardPage,
};
