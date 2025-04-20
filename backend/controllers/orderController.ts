import { Request, Response } from "express";
import pool from "../config/db";
import { Order } from "../models/order"; // Adjust path properly

// Place a new order
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId, name, address, phone, email, cartItems } = req.body;

  try {
    if (!userId || !name || !address || !phone || !email || !cartItems || cartItems.length === 0) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const orderPromises = cartItems.map((item: any) => {
      const { id, quantity, price } = item;
      const total_price = parseFloat(price) * quantity;

      return pool.query(
        `INSERT INTO orders (user_id, name, address, phone, email, product_id, quantity, total_price, status) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')`,
        [userId, name, address, phone, email, id, quantity, total_price]
      );
    });

    await Promise.all(orderPromises);

    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const order = await pool.query(
      `SELECT o.id, o.user_id, o.name, o.address, o.phone, o.email, o.quantity, o.total_price, o.status, o.created_at,
              p.name as product_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       WHERE o.id = $1`,
      [id]
    );

    if (order.rows.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    res.status(200).json(order.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all orders (for Admin)
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await pool.query(
      `SELECT o.id, o.user_id, o.name, o.address, o.phone, o.email, o.quantity, o.total_price, o.status, o.created_at,
              p.name as product_name
       FROM orders o
       JOIN products p ON o.product_id = p.id
       ORDER BY o.created_at DESC`
    );

    res.status(200).json(orders.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update order status (for Admins)
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    if (order.rows.length === 0) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders by User ID
export const getOrdersByUserId = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  console.log("Fetching orders for userId:", userId);

  try {
    const orders = await pool.query(
      `SELECT 
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
       ORDER BY o.created_at DESC`,
      [userId]
    );

    res.status(200).json(orders.rows);
  } catch (error: any) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Place a bulk order
export const placeBulkOrder = async (req: Request, res: Response): Promise<void> => {
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

      const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [product.id]);
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

      await pool.query(
        `INSERT INTO orders (user_id, name, address, phone, email, product_id, quantity, total_price, status, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)`,
        [
          user_id,
          buyer.name,
          buyer.address,
          buyer.phone,
          buyer.email,
          product.id,
          quantity,
          total_price,
          now
        ]
      );
    }

    res.status(201).json({ message: "Bulk order placed successfully!" });
  } catch (error) {
    console.error("Error placing bulk order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
