import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCartItem);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart); // Xoá toàn bộ giỏ hàng

export default router;
