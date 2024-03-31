const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Vendor = require("../models/Vendor");
dotenv.config();
const secretKey = process.env.WhatIsYourName;
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ error: "token is required" });
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.venodrId);
    if (!vendor) return res.status(404).json({ error: "vendor not found" });
    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json("invalid token");
  }
};
module.exports = verifyToken;
