const mongoose = require("mongoose");

const Order = require("../models/order");
const Product = require("../models/product");
const checkAuth = require("../middleware/check-auth");

exports.get_all_orders = (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then((orders) => {
      res.status(200).json({
        count: orders.length,
        orders: orders.map((order) => {
          return {
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: "GET",
              url:
                "https://e-commerce-restfull-api.herokuapp.com/orders/" +
                order._id,
            },
          };
        }),
      });
    })
    .catch((error) => res.status(500).json({ error: error }));
};

exports.create_order = (req, res, next) => {
  Product.findById(req.body.productId)
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const order = new Order({
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order
        .save()
        .then((order) => {
          console.log(order);
          res.status(201).json({
            _id: order._id,
            product: order.product,
            quantity: order.quantity,
            request: {
              type: "POS",
              url:
                "https://e-commerce-restfull-api.herokuapp.com/orders/" +
                order._id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    });
};

exports.get_order = (req, res, next) => {
  Order.findById(req.params.orderId)
    .select("_id product quantity")
    .populate("product")
    .exec()
    .then((order) => {
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "https://e-commerce-restfull-api.herokuapp.com/orders",
        },
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.delete_order = (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(() => {
      res.status(200).json({
        message: "Order was deleted",
        request: {
          type: "POST",
          url: "https://e-commerce-restfull-api.herokuapp.com/orders",
        },
      });
    })
    .catch((err) => res.status(500).json({ error: err }));
};
