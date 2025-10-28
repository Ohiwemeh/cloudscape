import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";
// 1. Import your new admin routes
import adminRoutes from "./routes/adminroutes.js"; 

dotenv.config();

const { MONGO_URI, PORT = 5000, JWT_SECRET } = process.env;
if (!MONGO_URI) console.warn("Warning: MONGO_URI not set. Set it in .env or .env.local");
if (!JWT_SECRET) console.warn("Warning: JWT_SECRET not set. JWT tokens will fail without it.");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/users", userRoutes);
// 2. Use your new admin routes at the /api/admin path
app.use("/api/admin", adminRoutes); 

// Connect MongoDB (if not in test environment)
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("DB error:", err));
}

// Health check
app.get("/", (req, res) => res.send("API running..."));

// Start server (if not imported for testing)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
