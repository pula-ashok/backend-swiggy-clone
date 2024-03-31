const express = require("express");
const {
  addProduct,
  getProductsByFirmId,
  deleteProductById,
} = require("../controllers/productController");
const router = express.Router();

router.post("/add-product/:firmId", addProduct);
router.get("/:firmId/products", getProductsByFirmId);
router.delete("/:productId", deleteProductById);

router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.header("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});
module.exports = router;
