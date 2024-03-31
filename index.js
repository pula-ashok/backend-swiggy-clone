const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");

const app = express();

dotenv.config();
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to Mongodb"))
  .catch((error) => console.log(error));

app.listen(process.env.PORT, () =>
  console.log(`server is running at ${process.env.PORT}`)
);

// app.use("/", (req, res) => {
//   res.send("<h1>Hello Home Page</h1>");
// });

app.use("/api/vendor", vendorRoutes);
app.use("/api/firm", firmRoutes);
app.use("/api/product", productRoutes);
app.use("/uploads", express.static("uploads"));
