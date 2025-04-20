import express from "express";
import { getProducts,  addProduct, updateProduct, deleteProduct } from "../controllers/productController"; // Adjust the import path

const router = express.Router();

// Route to fetch all products
router.get("/products", getProducts);
router.post("/products", addProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
