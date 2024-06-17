const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");
5;
async function getIndexPage(req, res) {
  const courses = await Course.find().sort("-createdAt").limit(2);
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });

  res.status(201).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
}

function getAboutPage(req, res) {
  res.status(200).render("about", {
    page_name: "about",
  });
}
function getRegisterPage(req, res) {
  res.status(200).render("register", {
    page_name: "register",
  });
}
function getLoginPage(req, res) {
  res.status(200).render("login", {
    page_name: "login",
  });
}

function getContactPage(req, res) {
  res.status(200).render("contact", {
    page_name: "contact",
  });
}

async function sendEmail(req, res) {
  try {
    const outputMessage = `
    <h1>Mail Details</h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h1>Message</h1>
    <p>${req.body.message}</p>
    `;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "kaandanisment1@gmail.com",
        pass: "ackhtrmekqgwmxly11",
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Smart EDU Contact" <kaandanisment1@gmail.com>', // sender address
      to: "kaandanisment1@gmail.com", // list of receivers
      subject: "Smart EDU Contact FORM", // Subject line
      text: "Smart EDU Contact Form New Message", // plain text body
      html: outputMessage, // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>

    req.flash("success", "Message received succesfully");

    res.status(200).redirect("/contact");
  } catch (err) {
    //req.flash("err", `Message couldn't send! ${err}`);
    req.flash("err", `Message couldn't send!`);
    res.status(200).redirect("/contact");
  }
}

module.exports = {
  getIndexPage,
  getAboutPage,
  getRegisterPage,
  getLoginPage,
  getContactPage,
  sendEmail,
};
