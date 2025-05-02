import api from "../utils/api";

export const CartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    try {
      const response = await api.get("/api/cart");
      return response; // Trả về cả response, không chỉ data
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng:", error);
      throw error;
    }
  },
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (productId, quantity = 1) => {
    try {
      const { data } = await api.post("/api/cart", {
        productId: productId.toString(), // Chuyển sang string
        quantity,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to add to cart: " + error.message);
    }
  },
  // Cập nhật số lượng sản phẩm
  updateQuantity: async (productId, quantity) => {
    try {
      const { data } = await api.put("/api/cart", {
        productId: productId.toString(),
        quantity,
      });
      return data;
    } catch (error) {
      throw new Error("Failed to update quantity: " + error.message);
    }
  },
  // Xoá sản phẩm khỏi giỏ hàng
  removeFromCart: async (productId) => {
    try {
      const { data } = await api.delete(`/api/cart/${productId}`);
      return data;
    } catch (error) {
      throw new Error("Failed to remove from cart: " + error.message);
    }
  },

  // Xoá toàn bộ giỏ hàng
  clearCart: async () => {
    try {
      const { data } = await api.delete("/api/cart");
      return data;
    } catch (error) {
      throw new Error("Failed to clear cart: " + error.message);
    }
  },
};
