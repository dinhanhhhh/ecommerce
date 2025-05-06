import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.register(form);
      const { data } = response;
      console.log("Register API response:", data);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900 mb-4">
          Tạo tài khoản mới
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center">
            {error}
          </div>
        )}
        <form className="space-y-6" onSubmit={handleSubmit} autoComplete="on">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ tên
            </label>
            <input
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>
        <div className="text-sm text-center mt-3">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
}
