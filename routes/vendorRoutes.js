const express = require("express");
const {
  vendorRegister,
  vendorLogin,
  getAllVendors,
  getVendorById,
} = require("../controllers/vendorController");
const router = express.Router();

router.post("/register", vendorRegister);
router.post("/login", vendorLogin);
router.get("/all-vendors", getAllVendors);
router.get("/single-vendor/:id", getVendorById);

module.exports = router;
