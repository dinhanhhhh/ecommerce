// src/context/OrderContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import api from "../utils/api";

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/api/orders", orderData);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMyOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/orders/mine");
      setOrders(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOrderDetails = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/orders/${orderId}`);
      setCurrentOrder(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Không tìm thấy đơn hàng");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderToPaid = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/api/orders/${orderId}/pay`);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  // Thêm hàm cập nhật trạng thái giao hàng
  const updateOrderToDelivered = useCallback(async (orderId) => {
    setLoading(true);
    try {
      const { data } = await api.put(`/api/orders/${orderId}/deliver`);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? data : o)));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi cập nhật trạng thái");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
const getAllOrders = useCallback(async () => {
  setLoading(true);
  try {
    const { data } = await api.get("/api/orders");
    setOrders(data);
    return data;
  } catch (err) {
    setError(err.response?.data?.message || "Không thể tải đơn hàng");
    throw err;
  } finally {
    setLoading(false);
  }
}, []);

const deleteOrder = useCallback(async (orderId) => {
  setLoading(true);
  try {
    await api.delete(`/api/orders/${orderId}`);
    setOrders((prev) => prev.filter((order) => order._id !== orderId));
    return true;
  } catch (err) {
    setError(err.response?.data?.message || "Lỗi khi xóa đơn hàng");
    throw err;
  } finally {
    setLoading(false);
  }
}, []);


  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        loading,
        error,
        createOrder,
        getMyOrders,
        getOrderDetails,
        updateOrderToPaid,
        updateOrderToDelivered,
        getAllOrders,
        deleteOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder phải được dùng trong OrderProvider");
  }
  return context;
};
