const express = require("express");

const app = express();

//Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.status(200).render("index", {
    page_name: "index",
  });
});
app.get("/about", (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
