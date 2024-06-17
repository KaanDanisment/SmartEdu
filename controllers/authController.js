const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Category = require("../models/Category");
const Courses = require("../models/Course");

async function createUser(req, res) {
  try {
    const user = await User.create(req.body);
    res.status(201).redirect("/login");
  } catch (err) {
    const errors = validationResult(req);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash("error", `${errors.array()[i].msg}`);
    }
    res.status(400).redirect("/register");
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
          res.status(200).redirect("/user/dashboard");
        } else {
          req.flash("error", "Password is not correct");
          res.status(400).redirect("/login");
        }
      });
    } else {
      req.flash("error", "There is no user in this email");
      res.status(400).redirect("/login");
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
  const users = await User.find();
  const categories = await Category.find();
  const courses = await Courses.find({ user: req.session.userID });

  res.status(200).render("dashboard", {
    page_name: "dashboard",
    user,
    categories,
    courses,
    users,
  });
}
async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (user.role == "student") {
      await User.deleteOne(user._id);
    } else if (user.role == "admin") {
      req.flash("error", "You can not delete any admin!");
    } else {
      const course = await Courses.findOne({ user: req.params.id });
      await User.updateMany(
        { courses: { $in: [course._id] } },
        { $pull: { courses: course._id } }
      );
      await Courses.deleteOne(course._id);
      await User.deleteOne(user._id);
    }
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
}
module.exports = {
  createUser,
  loginUser,
  logoutUser,
  getDashboardPage,
  deleteUser,
};
