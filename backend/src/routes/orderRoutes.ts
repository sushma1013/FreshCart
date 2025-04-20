import express from "express";
import { getOrdersByUserId, placeBulkOrder, placeOrder } from "../controllers/orderController";
import { getOrderById, getAllOrders, updateOrderStatus } from "../controllers/orderController"; // Adjust the import path

const router = express.Router();

// Route to place an order
router.post("/orders", placeOrder);
router.get("/orders/:id", getOrderById);
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/orders/user/:userId", getOrdersByUserId);
router.post("/orders/bulk-order", placeBulkOrder);

export default router;
