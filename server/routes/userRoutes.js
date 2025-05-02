import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js"; // import middleware
import { isAdmin } from "../middlewares/authMiddleware.js"; // kiểm tra role admin

const router = express.Router();

// Đăng ký
router.post("/register", registerUser);

// Đăng nhập
router.post("/login", loginUser);

// Chỉ Admin mới được xem danh sách user
router.get("/", protect, isAdmin, getAllUsers);

export default router;
