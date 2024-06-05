const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const courseRoute = require("./routes/courseRoute");
const pageRoute = require("./routes/pageRoute");
const categoryRoute = require("./routes/categoryRoute");

const app = express();

//ConnectDB
mongoose.connect("mongodb://127.0.0.1/smartedu-db").then(() => {
  console.log("Connected DB");
});

//Template Engine
app.set("view engine", "ejs");

//Middlewares
app.use(express.static("public"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
