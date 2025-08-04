import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  summary: { type: String },
  description: { type: String },
  category: { type: String }
});

const Product = mongoose.model("Product", productSchema);
export default Product;