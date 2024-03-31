//register
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const secreteKey = process.env.WhatIsYourName;
const Vendor = require("../models/Vendor");

const vendorRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    console.log(vendor);
    if (vendor) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });
    await newVendor.save();
    res.status(201).json({ message: "registerd successfully" });
    console.log("Registered");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ venodrId: vendor._id }, secreteKey, {
      expiresIn: "3d",
    });
    return res.status(200).json({ success: "Login successfully", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({}, { password: 0 }).populate("firm");
    res.status(200).json(vendors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const getVendorById = async (req, res) => {
  try {
    const vendorId = req.params.id;
    const vendor = await Vendor.findById(vendorId, { password: 0 }).populate(
      "firm"
    );
    if (!vendor) return res.status(404).json({ error: "vendor not found" });
    res.status(200).json(vendor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { vendorRegister, vendorLogin, getAllVendors, getVendorById };
