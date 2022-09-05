const express = require("express");
const mongoose = require("mongoose");
const formidable = require("express-formidable");
require("dotenv").config();
const csrf = require("csurf");

const app = express();
app.use(formidable());

// setup route middlewares
const csrfProtection = csrf({ cookie: true });
// app.use(csrfProtection);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const resultRoutes = require("./routes/result");
app.use(resultRoutes);

// Start server + Page not found + Welcome page

app.get("/getCSRFToken", (req, res) => {
  res.json({ CSRFToken: req.csrfToken() });
});

app.use("/", (req, res) => {
  console.log("route: /");
  res.status(200).json({ message: "Hello chrome dino" });
});

app.all("*", (req, res) => {
  console.log("route: /all routes");
  res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Server has started");
});
