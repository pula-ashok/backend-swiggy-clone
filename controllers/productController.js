const path = require("path");
const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  },
});

const upload = multer({ storage: storage });
const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestseller, description } = req.body;
    const image = req.file ? req.file.fileName : undefined;
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) return res.status(404).json({ error: "firm not found" });
    const product = new Product({
      productName,
      price,
      category,
      image,
      bestseller,
      description,
      firm: firm._id,
    });
    const savedProduct = await product.save();
    firm.products.push(savedProduct);
    await firm.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
const getProductsByFirmId = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "firm is not found" });
    }
    const products = await Product.find({ firm: firm._id });
    res.status(200).json({ restaurantName: firm.firmName, products });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;
    await Firm.updateOne({ $pull: { products: productId } });

    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ error: "no product found" });
    }
    res.status(201).json({ success: "deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductsByFirmId,
  deleteProductById,
};
