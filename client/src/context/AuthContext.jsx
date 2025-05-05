import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
export const USER_LOGOUT_EVENT = "user-logout";
export const USER_LOGIN_EVENT = "user-login";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");

      if (savedUser && savedToken) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        // ⚠️ Gắn token mặc định vào axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;

        // Phát sự kiện đăng nhập lại từ localStorage
        window.dispatchEvent(
          new CustomEvent(USER_LOGIN_EVENT, { detail: parsedUser })
        );
      }
    } catch (error) {
      console.error("Lỗi khi đọc dữ liệu từ localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, token) => {
    try {
      if (userData && token) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);

        // ⚠️ Gắn token mặc định vào axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        window.dispatchEvent(
          new CustomEvent(USER_LOGIN_EVENT, { detail: userData })
        );
      } else {
        console.error(
          "Hàm login được gọi với userData hoặc token không hợp lệ"
        );
      }
    } catch (error) {
      console.error("Lỗi khi lưu vào localStorage:", error);
    }
  };

  const register = (userData, token) => {
    try {
      if (userData && token) {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);

        // ⚠️ Gắn token mặc định vào axios
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        window.dispatchEvent(
          new CustomEvent(USER_LOGIN_EVENT, { detail: userData })
        );
      } else {
        console.error(
          "Hàm register được gọi với userData hoặc token không hợp lệ"
        );
      }
    } catch (error) {
      console.error("Lỗi khi lưu vào localStorage (register):", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Xóa token khỏi axios headers
    delete axios.defaults.headers.common["Authorization"];

    window.dispatchEvent(new CustomEvent(USER_LOGOUT_EVENT));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth phải được dùng bên trong AuthProvider");
  }
  return context;
}
