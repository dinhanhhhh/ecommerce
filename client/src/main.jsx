// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext"; // Thêm dòng này

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <OrderProvider>
            {" "}
            {/* Thêm OrderProvider ở đây */}
            <App />
          </OrderProvider>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
