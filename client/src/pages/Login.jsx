import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api"; // Sử dụng api instance đã cấu hình

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sử dụng api.login thay vì axios.post trực tiếp
      const response = await api.login(form);
      const { data } = response;

      console.log("Login API response:", data);

      // Thêm kiểm tra này
      if (!data || !data._id || !data.token) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      // Tạo userData cẩn thận hơn
      const userData = {
        _id: data._id,
        name: data.name || "",
        email: data.email || "",
        role: data.role || "user",
      };

      // Gọi hàm login từ AuthContext
      login(userData, data.token);

      // Chuyển hướng về trang chủ
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Đăng nhập vào tài khoản
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-center">
            {error}
          </div>
        )}

        <form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          autoComplete="on"
        >
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a
                href="/register"
                className="font-medium text-blue-600 hover:underline"
              >
                Chưa có tài khoản? Đăng ký
              </a>
            </div>
            <div className="text-sm">
              <a href="#" className="text-gray-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
