const Category = require("../models/Category");
const User = require("../models/User");
const Course = require("../models/Course");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const course = await Course.findOne({ category: req.params.id });
    await User.updateMany(
      { courses: { $in: [course._id] } },
      { $pull: { courses: course._id } }
    );
    await Course.deleteMany({ category: req.params.id });
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
