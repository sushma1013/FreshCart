import { Request, Response } from "express";
import pool from "../../src/config/db"; // Adjust the path if needed

// Fetch all products
export const getProducts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const result = await pool.query("SELECT * FROM products");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    return res.status(200).json({ products: result.rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Add a new product
export const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, imageUrl, category } = req.body;

    if (!name || !description || !price || !stock || !imageUrl || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await pool.query(
      "INSERT INTO products (name, description, price, stock, image_url, category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, description, price, stock, imageUrl, category]
    );

    res.status(201).json({ message: "Product added successfully", product: newProduct.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, imageUrl, category } = req.body;

    if (!name || !description || !price || !stock || !imageUrl || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingProduct = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await pool.query(
      "UPDATE products SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, category = $6 WHERE id = $7 RETURNING *",
      [name, description, price, stock, imageUrl, category, id]
    );

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingProduct = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existingProduct.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
