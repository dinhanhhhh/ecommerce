// src/pages/MyOrdersPage.jsx
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

function MyOrdersPage() {
  const { orders, loading, error, getMyOrders } = useOrder();

  useEffect(() => {
    getMyOrders();
  }, [getMyOrders]);

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Mã đơn: #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <Link
                to={`/orders/${order._id}`}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
              >
                Xem chi tiết
              </Link>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Tổng tiền:</span>
              <span className="font-semibold">
                {order.totalPrice.toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrdersPage;
