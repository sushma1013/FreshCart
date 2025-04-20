"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.addProduct = exports.getProducts = void 0;
const db_1 = __importDefault(require("../config/db")); // Adjust the path if needed
// Fetch all products
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.default.query("SELECT * FROM products");
        if (result.rows.length === 0) {
            res.status(404).json({ success: false, message: "No products found" });
            return;
        }
        res.status(200).json({ success: true, products: result.rows });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.getProducts = getProducts;
// Add a new product
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, imageUrl, category } = req.body;
        if (!name || !description || !price || !stock || !imageUrl || !category) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        const newProduct = yield db_1.default.query(`INSERT INTO products (name, description, price, stock, image_url, category) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [name, description, price, stock, imageUrl, category]);
        res.status(201).json({ success: true, message: "Product added successfully", product: newProduct.rows[0] });
    }
    catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.addProduct = addProduct;
// Update an existing product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, price, stock, imageUrl, category } = req.body;
        if (!name || !description || !price || !stock || !imageUrl || !category) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        const existingProduct = yield db_1.default.query("SELECT * FROM products WHERE id = $1", [id]);
        if (existingProduct.rows.length === 0) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        const updatedProduct = yield db_1.default.query(`UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category = $6 
       WHERE id = $7 RETURNING *`, [name, description, price, stock, imageUrl, category, id]);
        res.status(200).json({ success: true, message: "Product updated successfully", product: updatedProduct.rows[0] });
    }
    catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingProduct = yield db_1.default.query("SELECT * FROM products WHERE id = $1", [id]);
        if (existingProduct.rows.length === 0) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        yield db_1.default.query("DELETE FROM products WHERE id = $1", [id]);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map