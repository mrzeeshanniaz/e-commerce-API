const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

exports.signUp = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          if (err) {
            return res.status(500).json({ error: err });
          } else {
            const user = new User({
              email: req.body.email,
              password: hash,
            });

            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(200).json({ message: "User is created" });
              })
              .catch((err) => res.status(500).json({ error: err }));
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.login = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        res.status(401).json({ message: "Auth failed" });
      } else {
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({ message: "Auth failed" });
          } else if (result) {
            const token = jwt.sign(
              { email: user[0].email, _id: user[0]._id },
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res
              .status(200)
              .json({ messages: "Auth successful", token: token });
          }
          res.status(401).json({ message: "Auth failed" });
        });
      }
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.delete = (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({ message: "User is deleted" });
    })
    .catch((err) => res.status(500).json({ error: err }));
};
