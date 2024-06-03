const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Index Page");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`App started on ${port}`);
});
