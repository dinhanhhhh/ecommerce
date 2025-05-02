// src/components/ProtectedRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Dùng cho cả route thường và route cần quyền admin.
 * - Nếu chỉ cần đăng nhập: <Route element={<ProtectedRoute />} />
 * - Nếu cần admin: <Route element={<ProtectedRoute isAdmin />} />
 * - Nếu dùng dạng element: <Route path="..." element={<ProtectedRoute isAdmin><Component /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children, isAdmin = false }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (isAdmin && user.role !== "admin") return <Navigate to="/" />;

  // Nếu có children, render children (dạng element), nếu không thì render Outlet (dạng nested)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
