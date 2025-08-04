import Product from "../models/product.model.js"
import path from "path";

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (err) {
        console.log("Internal Server Error", err)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, price, summary, description, category } = req.body;
        let imagePath = '';
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`;
        }
        if (!name || !price || !summary) {
            return res.status(400).json({ message: "Name, price, and summary are required" });
        }
        const product = new Product({ name, price, summary, image: imagePath, description, category });
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.log("Error creating product", err);
        res.status(500).json({ message: "Failed to create product" });
    }
}