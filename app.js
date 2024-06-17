const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const courseRoute = require("./routes/courseRoute");
const pageRoute = require("./routes/pageRoute");
const categoryRoute = require("./routes/categoryRoute");
const userRoute = require("./routes/userRoute");

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
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "my_keyboard_cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1/smartedu-db" }),
  })
);
app.use(flash());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

// Global Variables
global.userIN = null;

// Routes
app.use("*", (req, res, next) => {
  userIN = req.session.userID;
  next();
});
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/user", userRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
