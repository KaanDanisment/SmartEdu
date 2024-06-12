function getIndexPage(req, res) {
  console.log(req.session.userID);
  res.status(200).render("index", {
    page_name: "index",
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

module.exports = {
  getIndexPage,
  getAboutPage,
  getRegisterPage,
  getLoginPage,
  getContactPage,
};
