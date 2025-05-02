import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext"; // Đảm bảo bạn có AuthContext

function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuth(); // Lấy thông tin user hiện tại
    console.log("User ở FE:", user);

  const { getOrderDetails, updateOrderToPaid, updateOrderToDelivered } =
    useOrder();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [deliveryLoading, setDeliveryLoading] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderDetails(id);
        setOrder(data);
      } catch (err) {
        setError(err.message || "Không thể tải chi tiết đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id, getOrderDetails]);

  const handlePayment = async () => {
    try {
      setPaymentLoading(true);
      const updatedOrder = await updateOrderToPaid(id);
      setOrder(updatedOrder);
    } catch (err) {
      setError("Lỗi khi thanh toán: " + err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleDelivery = async () => {
    try {
      setDeliveryLoading(true);
      const updatedOrder = await updateOrderToDelivered(id);
      setOrder(updatedOrder);
    } catch (err) {
      setError("Lỗi khi cập nhật trạng thái giao hàng: " + err.message);
    } finally {
      setDeliveryLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Đang tải chi tiết đơn hàng...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!order) {
    return <div className="text-center py-8">Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link to="/orders/mine" className="text-blue-500 hover:underline">
          ← Quay lại danh sách đơn hàng
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Đơn hàng #{order._id}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Thông tin và sản phẩm */}
        <div className="col-span-2">
          {/* Thông tin giao hàng */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin giao hàng</h2>
            <p>
              <strong>Địa chỉ:</strong> {order.shippingAddress.address}
            </p>
            <p>
              <strong>Thành phố:</strong> {order.shippingAddress.city}
            </p>
            <p>
              <strong>Mã bưu điện:</strong> {order.shippingAddress.postalCode}
            </p>
            <p>
              <strong>Quốc gia:</strong> {order.shippingAddress.country}
            </p>
            <div className="mt-4">
              <p>
                <strong>Trạng thái:</strong>{" "}
                {order.isDelivered ? (
                  <span className="text-green-600">
                    Đã giao hàng vào{" "}
                    {new Date(order.deliveredAt).toLocaleString("vi-VN")}
                  </span>
                ) : (
                  <span className="text-yellow-600">Chưa giao hàng</span>
                )}
              </p>
            </div>
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Phương thức thanh toán
            </h2>
            <p>
              <strong>Phương thức:</strong> {order.paymentMethod}
            </p>
            <div className="mt-4">
              <p>
                <strong>Trạng thái:</strong>{" "}
                {order.isPaid ? (
                  <span className="text-green-600">
                    Đã thanh toán vào{" "}
                    {new Date(order.paidAt).toLocaleString("vi-VN")}
                  </span>
                ) : (
                  <span className="text-red-600">Chưa thanh toán</span>
                )}
              </p>
            </div>
          </div>

          {/* Sản phẩm đã đặt */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Sản phẩm đã đặt</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex items-center">
                    <img
                      src={item.product?.image || "/placeholder.png"}
                      alt={item.product?.title || "Sản phẩm"}
                      className="w-20 h-20 object-cover mr-4"
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div>
                      <Link
                        to={`/products/${item.product?._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.product?.title || "Sản phẩm đã bị xóa"}
                      </Link>
                      <p className="text-sm text-gray-500">
                        SL: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {(
                      (item.product?.price || 0) * (item.quantity || 0)
                    ).toLocaleString("vi-VN")}{" "}
                    ₫
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tóm tắt đơn hàng + nút thanh toán/giao hàng */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between mb-2">
                <p>Tiền hàng</p>
                <p>{order.totalPrice.toLocaleString("vi-VN")} ₫</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Phí vận chuyển</p>
                <p>0 ₫</p>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <p>Tổng cộng</p>
              <p>{order.totalPrice.toLocaleString("vi-VN")} ₫</p>
            </div>

            {/* Nút xác nhận giao hàng cho admin */}
            {user?.role === "admin" && !order.isDelivered && (
              <button
                onClick={handleDelivery}
                disabled={deliveryLoading}
                className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600 disabled:bg-gray-400"
              >
                {deliveryLoading ? "Đang xử lý..." : "Xác nhận đã giao hàng"}
              </button>
            )}

            {/* Nút thanh toán */}
            {!order.isPaid && (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full bg-blue-500 text-white py-2 rounded mt-4 hover:bg-blue-600 disabled:bg-gray-400"
              >
                {paymentLoading ? "Đang xử lý..." : "Thanh toán ngay"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
