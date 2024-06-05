function getIndexPage(req, res) {
  res.status(200).render("index", {
    page_name: "index",
  });
}

function getAboutPage(req, res) {
  res.status(200).render("about", {
    page_name: "about",
  });
}

module.exports = {
  getIndexPage,
  getAboutPage,
};
