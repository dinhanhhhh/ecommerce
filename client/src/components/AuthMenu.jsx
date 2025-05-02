import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AuthMenu() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <span className="text-gray-500 animate-pulse">
        Đang kiểm tra đăng nhập...
      </span>
    );
  }

  return user ? (
    <>
      {user.avatar && (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full border mr-2"
        />
      )}
      <span className="text-blue-700 font-semibold">{user.name}</span>
      <button onClick={logout} className="text-red-500 hover:underline ml-2">
        Đăng xuất
      </button>
    </>
  ) : (
    <>
      <Link to="/login" className="text-blue-600 hover:underline">
        Đăng nhập
      </Link>
      <Link to="/register" className="text-blue-600 hover:underline ml-2">
        Đăng ký
      </Link>
    </>
  );
}

export default AuthMenu;
