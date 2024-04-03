const Vendor = require("../models/Vendor");
const Firm = require("../models/Firm");
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder where the uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
  },
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) return res.status(404).json({ error: "vendor not found" });
    else if (vendor.firm.length > 0) {
      return res.status(400).json({ error: "only one firm can add" });
    } else {
      console.log("vendor not found");
    }
    const image = req.file ? req.file.filename : undefined;
    console.log("image", image);
    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });
    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save();
    const firmId = savedFirm._id;
    return res.status(201).json({ message: "firm added successfully", firmId });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const products = await Product.deleteMany({ firm: firmId });
    await Vendor.updateOne({ $pull: { firm: firmId } });

    const deletedFirm = await Firm.findByIdAndDelete(firmId);
    if (!deletedFirm) {
      return res.status(404).json({ error: "no Firm found" });
    }
    res.status(201).json({ success: "deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};
module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
