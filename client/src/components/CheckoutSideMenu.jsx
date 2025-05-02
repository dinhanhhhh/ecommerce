import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import CheckoutForm from "./CheckoutForm";
import { useNavigate } from "react-router-dom"; // Thêm dòng này

function CheckoutSideMenu() {
  const {
    cart,
    removeFromCart,
    getTotalPrice,
    clearCart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    updateQuantity,
    loading, // Nếu CartContext có loading
  } = useCart();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate(); // Thêm dòng này

  // Hàm xử lý tăng số lượng
  const handleIncrease = (productId, currentQuantity) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecrease = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  // Hàm xử lý chuyển sang trang CheckoutPage
  const handleGoToCheckout = () => {
    setIsCheckoutOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Lớp nền mờ */}
          <Motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCheckoutOpen(false)}
          />

          {/* Panel giỏ hàng */}
          <Motion.div
            className="fixed right-0 top-0 h-full w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-white shadow-xl z-50"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Giỏ hàng</h2>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="flex-grow overflow-auto">
                {loading ? (
                  <div className="text-center text-gray-500 py-8">
                    Đang tải giỏ hàng...
                  </div>
                ) : cart.length > 0 ? (
                  cart.map((item) =>
                    item.product ? (
                      <div
                        key={item.product._id}
                        className="flex items-center gap-4 mb-4 p-2 border-b"
                      >
                        <img
                          src={item.product.image || "/default-product.png"}
                          alt={item.product.name || "Sản phẩm không tồn tại"}
                          className="w-16 h-16 object-contain"
                        />
                        <div className="flex-grow">
                          <h3 className="text-sm font-medium">
                            {item.product.title ||
                              item.product.name ||
                              "Sản phẩm đã bị xóa"}
                          </h3>
                          <p className="text-gray-500">
                            {Number(item.product.price).toLocaleString(
                              "vi-VN",
                              {
                                style: "currency",
                                currency: "VND",
                              }
                            )}{" "}
                            x {item.quantity}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleDecrease(item.product._id, item.quantity)
                            }
                            className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              handleIncrease(item.product._id, item.quantity)
                            }
                            className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </div>
                    ) : (
                      <div
                        key={item._id || Math.random()}
                        className="flex items-center gap-4 mb-4 p-2 border-b text-red-500"
                      >
                        Sản phẩm đã bị xóa khỏi hệ thống
                      </div>
                    )
                  )
                ) : (
                  <p className="text-center text-gray-500">Giỏ hàng trống</p>
                )}
              </div>

              {/* CHỈ SỬA PHẦN NÀY */}
              {!isFormOpen && (
                <div className="border-t pt-4 mt-auto">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold">Tổng tiền:</span>
                    <span className="text-xl">
                      {getTotalPrice().toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <button
                    onClick={handleGoToCheckout} // Sửa tại đây
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={cart.length === 0}
                  >
                    Thanh toán
                  </button>
                </div>
              )}
              {/* KẾT THÚC PHẦN SỬA */}

              {isFormOpen && (
                <div className="mt-4">
                  <CheckoutForm
                    onSubmit={(data) => {
                      console.log("Thông tin đơn hàng:", data);
                      clearCart();
                      setIsFormOpen(false);
                      setIsCheckoutOpen(false);
                      alert("Đặt hàng thành công!");
                    }}
                  />
                </div>
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CheckoutSideMenu;
