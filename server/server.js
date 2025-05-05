import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "https://ecommerce-frontend-4239.onrender.com", // Domain frontend trên Render
      "http://localhost:5173", // Dev environment
    ],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);
// MongoDB connect
connectDB();

// Routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

export default app;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}
