// src/context/CartContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { CartService } from "../services/cartService";
import { USER_LOGOUT_EVENT, USER_LOGIN_EVENT, useAuth } from "./AuthContext"; // Import event names và useAuth

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext

  // Hàm fetch cart với xử lý lỗi chi tiết
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await CartService.getCart();
      setCart(data?.cartItems?.filter((item) => item.product) || []);
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe sự kiện đăng xuất
  useEffect(() => {
    // Hàm xử lý khi người dùng đăng xuất
    const handleUserLogout = () => {
      console.log("Người dùng đã đăng xuất, xóa giỏ hàng");
      setCart([]); // Reset giỏ hàng về rỗng
      setIsCheckoutOpen(false); // Đóng giỏ hàng nếu đang mở
    };

    // Hàm xử lý khi người dùng đăng nhập
    const handleUserLogin = (event) => {
      console.log("Người dùng đã đăng nhập, tải lại giỏ hàng", event.detail);
      fetchCart(); // Tải lại giỏ hàng khi đăng nhập
    };

    // Đăng ký lắng nghe sự kiện
    window.addEventListener(USER_LOGOUT_EVENT, handleUserLogout);
    window.addEventListener(USER_LOGIN_EVENT, handleUserLogin);

    // Cleanup function để tránh memory leak
    return () => {
      window.removeEventListener(USER_LOGOUT_EVENT, handleUserLogout);
      window.removeEventListener(USER_LOGIN_EVENT, handleUserLogin);
    };
  }, []);

  // Load cart khi user thay đổi
  useEffect(() => {
    if (user) {
      console.log("User thay đổi, tải lại giỏ hàng", user);
      fetchCart();
    }
  }, [user]);

  // Các hàm khác giữ nguyên
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await CartService.addToCart(productId, quantity);
      console.log("addToCart response:", response);
      await fetchCart();
      setIsCheckoutOpen(true);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ:", error.message);
      throw error;
    }
  };

  // Cập nhật số lượng với Optimistic UI
  const updateQuantity = (productId, quantity) => {
    // Cập nhật UI ngay lập tức (optimistic update)
    const updatedCart = cart.map((item) => {
      if (item.product._id === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    // Cập nhật state ngay lập tức
    setCart(updatedCart);

    // Gọi API để cập nhật server
    CartService.updateQuantity(productId, quantity)
      .then(() => {
        // Tùy chọn: fetch lại giỏ hàng sau khi API hoàn thành
        // fetchCart();
      })
      .catch((error) => {
        console.error("Lỗi cập nhật số lượng:", error);
        // Nếu lỗi, fetch lại giỏ hàng để đồng bộ
        fetchCart();
      });
  };

  // Xóa sản phẩm với Optimistic UI
  const removeFromCart = async (productId) => {
    // Lưu giỏ hàng hiện tại để khôi phục nếu có lỗi
    const currentCart = [...cart];

    // Cập nhật UI ngay lập tức
    setCart(cart.filter((item) => item.product._id !== productId));

    try {
      await CartService.removeFromCart(productId);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error.message);
      // Khôi phục giỏ hàng nếu có lỗi
      setCart(currentCart);
    }
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    try {
      await CartService.clearCart();
      await fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa giỏ hàng:", error.message);
      throw error;
    }
  };

  // Tính toán tổng tiền với xử lý null
  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  // Tính tổng số lượng sản phẩm
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalPrice,
        getTotalItems,
        isCheckoutOpen,
        setIsCheckoutOpen,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
