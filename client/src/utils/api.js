import axios from "axios";

// utils/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});


// Interceptor để tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response: Nếu token hết hạn hoặc không hợp lệ, tự động logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

api.login = (data) => api.post("/api/users/login", data);
api.register = (data) => api.post("/api/users/register", data);

export default api;
