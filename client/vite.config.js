import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  // Đọc biến môi trường từ file .env
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      react({
        include: ["**/*.js", "**/*.jsx"],
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL, // Dùng biến từ .env
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
