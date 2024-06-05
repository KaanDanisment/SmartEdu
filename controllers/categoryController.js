const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(200).json({
      status: "success",
      category,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      err,
    });
  }
};