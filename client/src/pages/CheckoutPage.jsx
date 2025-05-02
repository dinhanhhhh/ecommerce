import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import PropTypes from "prop-types";

function CheckoutPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { createOrder, loading: orderLoading } = useOrder();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    shippingAddress: {
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
    paymentMethod: "COD",
  });

  const [error, setError] = useState("");

  // SỬA: handleChange để nhận shippingAddress lồng nhau
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shippingAddress.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // SỬA: validate các trường địa chỉ
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.shippingAddress.address.trim() ||
      !formData.shippingAddress.city.trim() ||
      !formData.shippingAddress.postalCode.trim() ||
      !formData.shippingAddress.country.trim()
    ) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const orderData = {
        ...formData,
        orderItems: cart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
        })),
        totalPrice: getTotalPrice(),
      };

      const createdOrder = await createOrder(orderData);
      clearCart();
      // Thêm thông báo cho COD
      if (createdOrder.paymentMethod === "COD") {
        alert(
          "Đơn hàng COD đã được tạo. Vui lòng chuẩn bị tiền mặt khi nhận hàng."
        );
      }
      navigate(`/orders/${createdOrder._id}`);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tạo đơn hàng");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Giỏ hàng trống</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Thanh Toán</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Phần tóm tắt đơn hàng giữ nguyên */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product._id}
                className="flex justify-between border-b pb-2"
              >
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {(item.product.price * item.quantity).toLocaleString("vi-VN")}
                  ₫
                </p>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Phần form thanh toán - SỬA các trường địa chỉ */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            {/* SỬA: Các trường địa chỉ thành từng input riêng */}
            <div>
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input
                type="text"
                name="shippingAddress.address"
                value={formData.shippingAddress.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Thành phố
              </label>
              <input
                type="text"
                name="shippingAddress.city"
                value={formData.shippingAddress.city}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Mã bưu điện
              </label>
              <input
                type="text"
                name="shippingAddress.postalCode"
                value={formData.shippingAddress.postalCode}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quốc gia</label>
              <input
                type="text"
                name="shippingAddress.country"
                value={formData.shippingAddress.country}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Phương thức thanh toán
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-300"
              >
                <option value="COD">Thanh toán khi nhận hàng</option>
                <option value="BankTransfer">Chuyển khoản ngân hàng</option>
                <option value="CreditCard">Thẻ tín dụng</option>
              </select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={orderLoading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {orderLoading ? "Đang xử lý..." : "Đặt hàng ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

CheckoutPage.propTypes = {
  // Add any props if needed
};

export default CheckoutPage;
