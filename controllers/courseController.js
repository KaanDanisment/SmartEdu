const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      user: req.session.userID,
    });
    req.flash("success", `${course.name} has been created successfully`);
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", `Something went wrong! Course couldn't create`);
    res.status(400).redirect("/courses");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const query = req.query.search;

    const category = await Category.findOne({ slug: categorySlug });

    let filter = {};
    if (categorySlug) {
      filter = { category: category._id };
    }
    if (query) {
      filter = { name: query };
    }
    if (!query && !categorySlug) {
      (filter.name = ""), (filter.Category = null);
    }

    const courses = await Course.find({
      $or: [
        { name: { $regex: ".*" + filter.name + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-createdAt")
      .populate("user");
    const categories = await Category.find();

    res.status(200).render("courses", {
      courses,
      categories,
      page_name: "courses",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.getCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const categories = await Category.find();
    res.status(200).render("course-single", {
      course,
      categories,
      user,
      page_name: "course",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    await User.updateMany(
      { courses: { $in: [course._id] } },
      { $pull: { courses: course._id } }
    );
    await Course.deleteOne(course._id);
    req.flash("error", `${course.name} has been removed succesfully`);
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.name = req.body.name;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();
    req.flash("success", "Course updated succesfully");
    res.status(200).redirect("/user/dashboard");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};
