const Product = require("../models/product");

exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((product) => {
          return {
            _id: product._id,
            name: product.name,
            price: product.price,
            productImage: product.productImage,
            request: {
              type: "GET",
              url: "http://localhost:5000/products/" + product._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => res.status(500).json({ error: err }));
};

exports.get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("_id name price productImage")
    .exec()
    .then((product) => {
      if (product) {
        res.status(200).json({
          _id: product._id,
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          request: {
            type: "GET",
            url: "http://localhost:5000/products/" + product._id,
          },
        });
      } else {
        res.status(404).json({ message: "No valid entry found for ID" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.create_product = (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    productImage: `/uploads/${req.file.filename}`,
  });

  product
    .save()
    .then((product) => {
      res.status(201).json({
        message: "Product created successfully",
        createdProduct: {
          _id: product._id,
          name: product.name,
          price: product.price,
          productImage: product.productImage,
          request: {
            type: "POST",
            url: "http://localhost:5000/products/" + product._id,
          },
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.update_product = (req, res, next) => {
  const id = req.params.productId;
  Product.updateOne({ _id: id }, { $set: { ...req.body } })
    .exec()
    .then((product) => {
      res.status(201).json({
        message: "Product updated successfully",
        request: {
          type: "PATCH",
          url: "http://localhost:5000/products/" + id,
        },
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};

exports.delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(() => {
      res.status(200).json({ message: "Product deleted successfully" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: error });
    });
};
