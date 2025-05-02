// src/pages/AdminOrdersPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useOrder } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";

function AdminOrdersPage() {
  const { orders, loading, error, getAllOrders, deleteOrder } = useOrder();
  const { user } = useAuth();
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "admin") {
      getAllOrders();
    }
  }, [user, getAllOrders]);

  const handleDelete = async (orderId) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      setDeleteLoading(true);
      try {
        await deleteOrder(orderId);
        // Reload orders after deletion
        getAllOrders();
      } catch (err) {
        alert("Lỗi khi xóa đơn hàng: " + err.message);
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  if (loading) return <div className="text-center p-4">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border-b">Mã đơn</th>
              <th className="py-3 px-4 border-b">Ngày đặt</th>
              <th className="py-3 px-4 border-b">Khách hàng</th>
              <th className="py-3 px-4 border-b">Tổng tiền</th>
              <th className="py-3 px-4 border-b">Thanh toán</th>
              <th className="py-3 px-4 border-b">Giao hàng</th>
              <th className="py-3 px-4 border-b">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">#{order._id.slice(-6)}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="py-3 px-4 border-b">
                  {order.user?.name || "Khách"}
                </td>
                <td className="py-3 px-4 border-b">
                  {order.totalPrice.toLocaleString("vi-VN")}₫
                </td>
                <td className="py-3 px-4 border-b">
                  {order.isPaid ? (
                    <span className="text-green-600">Đã thanh toán</span>
                  ) : (
                    <span className="text-red-600">Chưa thanh toán</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  {order.isDelivered ? (
                    <span className="text-green-600">Đã giao</span>
                  ) : (
                    <span className="text-yellow-600">Chưa giao</span>
                  )}
                </td>
                <td className="py-3 px-4 border-b">
                  <div className="flex justify-between items-center px-4">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={() => handleDelete(order._id)}
                      disabled={deleteLoading}
                      className="text-red-500 hover:underline disabled:opacity-50"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {orders.length === 0 && (
          <div className="text-center py-8">Không có đơn hàng nào</div>
        )}
      </div>
    </div>
  );
}

export default AdminOrdersPage;
