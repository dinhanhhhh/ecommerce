import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    getTotalPrice,
    clearCart,
    updateQuantity,
    loading, // Nếu CartContext có loading
  } = useCart();

  if (loading) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl text-gray-800">Đang tải giỏ hàng...</h2>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng trống</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Giỏ hàng</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        {cart.map((item) =>
          item.product ? (
            <div
              key={item.product._id}
              className="flex items-center gap-4 mb-4 pb-4 border-b"
            >
              <img
                src={item.product.image || "/default-product.png"}
                alt={item.product.name || "Sản phẩm không tồn tại"}
                className="w-24 h-24 object-contain"
              />
              <div className="flex-grow">
                <h3 className="text-lg font-medium">
                  {item.product.name || "Sản phẩm đã bị xóa"}
                </h3>
                <p className="text-gray-500">
                  {Number(item.product.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}{" "}
                  x {item.quantity}
                </p>
              </div>

              {/* Nút điều chỉnh số lượng */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              {/* Nút xóa */}
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
              className="flex items-center gap-4 mb-4 pb-4 border-b text-red-500"
            >
              Sản phẩm đã bị xóa khỏi hệ thống
            </div>
          )
        )}

        {/* Tổng tiền và nút thanh toán */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-bold">Tổng tiền:</span>
            <span className="text-xl">
              {getTotalPrice().toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>
          <button
            onClick={clearCart}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
