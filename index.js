require("colors");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const allRoutes = require("./routes/all.route.js");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

// db connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connected".yellow.bold);
  })
  .catch((err) => {
    console.log(err);
    console.log("connection Failed!".red.bold);
  });

// listening app
app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`.blue);
});

// routes
app.use("/api", allRoutes);
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.get("/uploads/*", (req, res) => {
  res.sendFile(__dirname + req.path);
});
app.all("*", (req, res) => {
  res.send("No route found.");
});

app.use(errorHandler);

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
});
