"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const orderController_2 = require("../controllers/orderController"); // Adjust the import path
const router = express_1.default.Router();
// Route to place an order
router.post("/orders", orderController_1.placeOrder);
router.get("/orders/:id", orderController_2.getOrderById);
router.get("/orders", orderController_2.getAllOrders);
router.put("/orders/:id", orderController_2.updateOrderStatus);
router.get("/orders/user/:userId", orderController_1.getOrdersByUserId);
router.post("/orders/bulk-order", orderController_1.placeBulkOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map