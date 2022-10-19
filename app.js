// import modules
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// import api routes
const productRoute = require("./api/routes/products");
const orderRoute = require("./api/routes/orders");
const userRoute = require("./api/routes/user");
const app = express();

//middleware to log request
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// database connection
mongoose
  .connect(process.env.CONNECTION_STRING, (e) =>
    e ? console.log(e) : console.log("DB connection successfully")
  )
  .catch((err) => console.log(err));

//routes request handling middleware
app.use("/products", productRoute);
app.use("/orders", orderRoute);
app.use("/user", userRoute);

//custom Error handle middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handle middleware
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;
