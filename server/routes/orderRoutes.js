import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

router
  .route("/")
  .post(protect, createOrder)
  .get(protect, isAdmin, getAllOrders);
router.route("/mine").get(protect, getMyOrders);
router.route("/:id").get(protect, getOrderById);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, isAdmin, updateOrderToDelivered);
router.route("/:id").delete(protect, isAdmin, deleteOrder);

export default router;
