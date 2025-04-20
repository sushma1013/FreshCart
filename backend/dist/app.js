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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productsRoutes_1 = __importDefault(require("./routes/productsRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const db_1 = __importDefault(require("./config/db")); // We'll create db.ts to connect to Neon PostgreSQL
// Initialize dotenv
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // To parse JSON bodies
// Test Route
app.get("/", (req, res) => {
    res.send("Bulk Order Backend API is running 🚀");
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api", productsRoutes_1.default);
app.use("/api", orderRoutes_1.default);
// Server Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Optional: Test DB connection on startup
        yield db_1.default.query('SELECT NOW()');
        console.log("✅ Connected to the database successfully!");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
    }
    console.log(`🚀 Server running on http://localhost:${PORT}`);
}));
//# sourceMappingURL=app.js.map