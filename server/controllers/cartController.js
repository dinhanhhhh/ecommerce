import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

// Helper kiểm tra ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Thêm/Xử lý sản phẩm trong giỏ hàng
export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  // Validate input
  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    // Kiểm tra sản phẩm còn tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    let cart = await Cart.findOne({ user: req.user._id }).populate(
      "cartItems.product"
    );

    if (cart) {
      // Loại bỏ các item có product null khỏi cart trước khi thao tác
      cart.cartItems = cart.cartItems.filter((item) => item.product !== null);

      const existingItem = cart.cartItems.find(
        (item) =>
          item.product &&
          item.product._id &&
          item.product._id.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.cartItems.push({ product: productId, quantity });
      }
    } else {
      cart = new Cart({
        user: req.user._id,
        cartItems: [{ product: productId, quantity }],
      });
    }

    const savedCart = await cart.save();
    await savedCart.populate("cartItems.product");

    // Lọc lại lần nữa trước khi trả về
    const filteredCartItems = savedCart.cartItems.filter(
      (item) => item.product !== null
    );

    res.status(200).json({
      ...savedCart.toObject(),
      cartItems: filteredCartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật giỏ hàng",
      error: error.message,
    });
  }
};

// Lấy thông tin giỏ hàng
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: "cartItems.product",
        select: "title price image stock",
      })
      .lean();

    if (!cart) {
      return res.status(200).json({
        cartItems: [],
        message: "Giỏ hàng trống",
      });
    }

    // Loại bỏ các item có product null
    const validCartItems = cart.cartItems.filter(
      (item) => item.product !== null
    );

    // Thêm thông tin tồn kho
    const enrichedCart = validCartItems.map((item) => ({
      ...item,
      product: {
        ...item.product,
        available: (item.product.stock ?? 0) >= item.quantity,
      },
    }));

    res.status(200).json({
      ...cart,
      cartItems: enrichedCart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi lấy giỏ hàng",
      error: error.message,
    });
  }
};

// Xoá sản phẩm khỏi giỏ hàng
export const removeFromCart = async (req, res) => {
  const { productId } = req.params;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { cartItems: { product: productId } } },
      { new: true }
    ).populate("cartItems.product");

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    // Lọc lại các item có product null
    const filteredCartItems = cart.cartItems.filter(
      (item) => item.product !== null
    );

    res.status(200).json({
      ...cart.toObject(),
      cartItems: filteredCartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi xoá sản phẩm",
      error: error.message,
    });
  }
};

// Cập nhật số lượng sản phẩm
export const updateCartItem = async (req, res) => {
  const { productId, quantity } = req.body; // Lấy productId từ body

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "ID sản phẩm không hợp lệ" });
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).json({ message: "Số lượng không hợp lệ" });
  }

  try {
    const cart = await Cart.findOneAndUpdate(
      {
        user: req.user._id,
        "cartItems.product": productId,
      },
      { $set: { "cartItems.$.quantity": quantity } },
      { new: true }
    ).populate("cartItems.product");

    if (!cart) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ" });
    }

    // Lọc lại các item có product null
    const filteredCartItems = cart.cartItems.filter(
      (item) => item.product !== null
    );

    res.status(200).json({
      ...cart.toObject(),
      cartItems: filteredCartItems,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi cập nhật số lượng",
      error: error.message,
    });
  }
};
// Xoá toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { cartItems: [] } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    }

    res.status(200).json({
      message: "Đã xoá toàn bộ giỏ hàng",
      cart: cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi server khi xoá giỏ hàng",
      error: error.message,
    });
  }
};
