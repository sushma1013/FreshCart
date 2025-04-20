import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import productsRoutes from "./routes/productsRoutes";
import orderRoutes from "./routes/orderRoutes";
import pool from "./config/db"; // We'll create db.ts to connect to Neon PostgreSQL


// Initialize dotenv
dotenv.config();

// Create Express app
const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Test Route
app.get("/", (req: Request, res: Response) => {
  res.send("Bulk Order Backend API is running 🚀");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", productsRoutes);
app.use("/api", orderRoutes);

// Server Listen
const PORT = process.env.PORT || 5000;




app.listen(PORT, async () => {
  
  try {
    // Optional: Test DB connection on startup
    await pool.query('SELECT NOW()');
    console.log("✅ Connected to the database successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
