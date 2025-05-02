import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      isPaid: false,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng của user đang đăng nhập
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product", "title price image") // Thêm trường cần populate
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất đầu tiên
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy 1 đơn hàng theo ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "title price image"); // Thêm populate đầy đủ
    if (order) {
      if (
        order.user._id.toString() === req.user._id.toString() ||
        req.user.role === "admin"
      ) {
        res.json(order);
      } else {
        res.status(403).json({ message: "Access denied!" });
      }
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật đơn hàng đã thanh toán
export const updateOrderToPaid = async (req, res) => {
  console.log("ID nhận được:", req.params.id);
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      await order.save();

      // Populate đầy đủ thông tin trước khi trả về
      const populatedOrder = await Order.findById(order._id).populate(
        "orderItems.product",
        "title price image"
      );

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái giao hàng
export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();

      // Populate đầy đủ thông tin trước khi trả về
      const populatedOrder = await Order.findById(order._id).populate(
        "orderItems.product",
        "title price image"
      );

      res.json(populatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Xóa đơn hàng (chỉ admin)
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    
    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Đơn hàng đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
