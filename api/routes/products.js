const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

//upload file storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    let extension = file.originalname.substr(
      file.originalname.lastIndexOf(".") + 1
    );
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product" + "-" + uniqueSuffix + "." + extension);
  },
});

//upload file configuration
const upload = multer({
  storage: storage,
  limits: 1024 * 1024 * 5,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

const productController = require("../controllers/products");

//Get all products
router.get("/", productController.get_all_products);
// get specific product
router.get("/:productId", productController.get_product);

//create new product
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productController.create_product
);

//update product
router.patch("/:productId", checkAuth, productController.update_product);

router.delete("/:productId", checkAuth, productController.delete_product);

module.exports = router;
