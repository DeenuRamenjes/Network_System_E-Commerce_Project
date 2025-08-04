import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const products = [
  {
    name: "Sample Product 1",
    price: 19.99,
    image: "https://via.placeholder.com/150",
    description: "A sample product for testing.",
    category: "Sample"
  },
  {
    name: "Sample Product 2",
    price: 29.99,
    image: "https://via.placeholder.com/150",
    description: "Another sample product.",
    category: "Sample"
  },
  {
    name: "Sample Product 3",
    price: 9.99,
    image: "https://via.placeholder.com/150",
    description: "Yet another sample product.",
    category: "Sample"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Sample products inserted!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding products:", err);
    process.exit(1);
  }
}

seed(); 