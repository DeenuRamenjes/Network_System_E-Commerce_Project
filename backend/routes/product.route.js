import express from "express";
import { getAllProducts, createProduct } from "../controller/product.controller.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.get("/", getAllProducts);
router.post("/", upload.single('image'), createProduct);

export default router;