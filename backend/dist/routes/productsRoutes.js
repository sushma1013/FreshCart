"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController"); // Adjust the import path
const router = express_1.default.Router();
// Route to fetch all products
router.get("/products", productController_1.getProducts);
router.post("/products", productController_1.addProduct);
router.put("/products/:id", productController_1.updateProduct);
router.delete("/products/:id", productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productsRoutes.js.map