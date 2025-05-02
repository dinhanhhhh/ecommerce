import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Đảm bảo đường dẫn đúng

function NavLinks() {
  const { user } = useAuth(); // Lấy user từ context

  return (
    <>
      <Link to="/" className="text-gray-600 hover:text-gray-800">
        Trang chủ
      </Link>
      <Link to="/products" className="text-gray-600 hover:text-gray-800">
        Sản phẩm
      </Link>
      {user?.role === "admin" && (
        <Link to="/admin/orders" className="text-gray-600 hover:text-gray-800">
          Quản lý đơn hàng
        </Link>
      )}
    </>
  );
}
export default NavLinks;
