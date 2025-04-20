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
exports.placeBulkOrder = exports.getOrdersByUserId = exports.updateOrderStatus = exports.getAllOrders = exports.getOrderById = exports.placeOrder = void 0;
const db_1 = __importDefault(require("../config/db"));
// Place a new order
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, name, address, phone, email, cartItems } = req.body;
    try {
        if (!userId || !name || !address || !phone || !email || !cartItems || cartItems.length === 0) {
            res.status(400).json({ message: "Missing required fields" });
            return;
        }
        const orderPromises = cartItems.map((item) => {
            const { id, quantity, price } = item;
            const total_price = parseFloat(price) * quantity;
            return db_1.default.query(`INSERT INTO orders (user_id, name, address, phone, email, product_id, quantity, total_price, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`, [userId, name, address, phone, email, id, quantity, total_price]);
        });
        yield Promise.all(orderPromises);
        res.status(201).json({ message: "Order placed successfully!" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.placeOrder = placeOrder;
// Get order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const order = yield db_1.default.query(`SELECT o.id, o.user_id, o.name, o.address, o.phone, o.email, o.quantity, o.total_price, o.status, o.created_at,
              p.name as product_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`, [id]);
        if (order.rows.length === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(order.rows[0]);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getOrderById = getOrderById;
// Get all orders (for Admin)
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield db_1.default.query(`SELECT o.id, o.user_id, o.name, o.address, o.phone, o.email, o.quantity, o.total_price, o.status, o.created_at,
              p.name as product_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       ORDER BY o.created_at DESC`);
        res.status(200).json(orders.rows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAllOrders = getAllOrders;
// Update order status (for Admins)
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = yield db_1.default.query("SELECT * FROM orders WHERE id = $1", [id]);
        if (order.rows.length === 0) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        yield db_1.default.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
        res.status(200).json({ message: "Order status updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Get orders by User ID
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    console.log("Fetching orders for userId:", userId);
    try {
        const orders = yield db_1.default.query(`SELECT 
        o.id, 
        o.name, 
        o.address, 
        o.phone, 
        o.email, 
        o.quantity, 
        o.total_price, 
        o.status, 
        o.created_at, 
        p.name AS product_name, 
        p.image_url
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.user_id = $1
       ORDER BY o.created_at DESC`, [userId]);
        res.status(200).json(orders.rows);
    }
    catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
// Place a bulk order
const placeBulkOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { buyer, order, user_id } = req.body;
    console.log("Received user_id:", user_id);
    console.log("Received buyer:", buyer);
    console.log("Received order:", order);
    try {
        if (!buyer || !buyer.name || !buyer.email || !buyer.address || !buyer.phone) {
            res.status(400).json({ message: "Missing buyer details" });
            return;
        }
        if (!order || order.length === 0) {
            res.status(400).json({ message: "No order details provided" });
            return;
        }
        for (const item of order) {
            const { product, quantity } = item;
            if (!product || !product.id || !quantity || quantity <= 0) {
                res.status(400).json({ message: "Invalid product or quantity" });
                return;
            }
            const productResult = yield db_1.default.query('SELECT * FROM products WHERE id = $1', [product.id]);
            if (productResult.rows.length === 0) {
                res.status(400).json({ message: `Product with id ${product.id} not found` });
                return;
            }
            const price = parseFloat(productResult.rows[0].price);
            if (isNaN(price)) {
                res.status(400).json({ message: `Invalid price for product with id ${product.id}` });
                return;
            }
            const total_price = price * quantity;
            const now = new Date();
            yield db_1.default.query(`INSERT INTO orders (user_id, name, address, phone, email, product_id, quantity, total_price, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)`, [
                user_id,
                buyer.name,
                buyer.address,
                buyer.phone,
                buyer.email,
                product.id,
                quantity,
                total_price,
                now
            ]);
        }
        res.status(201).json({ message: "Bulk order placed successfully!" });
    }
    catch (error) {
        console.error("Error placing bulk order:", error);
        res.status(500).json({ message: "Server error" });
    }
});
exports.placeBulkOrder = placeBulkOrder;
//# sourceMappingURL=orderController.js.map