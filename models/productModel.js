const mongoose = require("mongoose");
let productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A product must have a title"],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
  },
  description: {
    type: String,
    trim: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
