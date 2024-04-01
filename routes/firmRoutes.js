const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { addFirm, deleteFirmById } = require("../controllers/firmController");
const router = express.Router();

router.post("/add-firm", verifyToken, addFirm);
router.delete("/:firmId", verifyToken, deleteFirmById);
router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.header("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});
module.exports = router;
