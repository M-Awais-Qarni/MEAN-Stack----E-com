const mongoose = require("mongoose");
const { Schema } = mongoose; // Import Schema

const productSchema = new mongoose.Schema({
    name: String,
    shortDescription: String,
    description: String,
    purchasePrice: Number,
    sellingPrice: Number,
    rating: Number,
    images: Array(String),
    categoryId:[{type:Schema.Types.ObjectId,ref:'categories'}]
});

const Product = mongoose.model("products", productSchema);
module.exports = Product;
