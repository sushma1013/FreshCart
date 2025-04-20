import { Request, Response } from "express";
import pool from "../../src/config/db";
import bcrypt from "bcryptjs";

// Define the type for the user object from DB query result
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    const user: User = newUser.rows[0]; // Ensure we are using the correct type here
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Find user from the database
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user: User | undefined = userResult.rows[0]; // Ensure it's typed correctly

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if password matches
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};




// Define the type for the user object from DB query result
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export const addUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { username, email, password } = req.body;

    // Validate the input
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );

    const user: User = newUser.rows[0]; // Ensure we are using the correct type here

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Query the database for all users
    const result = await pool.query("SELECT id, name, email FROM users");
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};