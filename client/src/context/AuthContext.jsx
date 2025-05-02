// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
// Tạo một event name cố định để sử dụng
export const USER_LOGOUT_EVENT = "user-logout";
export const USER_LOGIN_EVENT = "user-login"; // Thêm event đăng nhập

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
        // Phát sự kiện đăng nhập khi khôi phục từ localStorage
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

        // Phát sự kiện đăng nhập để các context khác có thể lắng nghe
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

        // Phát sự kiện đăng nhập khi đăng ký thành công
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
    // Xóa dữ liệu auth
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    // Phát sự kiện logout để các context khác có thể lắng nghe
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
