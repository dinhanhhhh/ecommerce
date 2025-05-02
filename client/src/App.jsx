import { Routes, Route } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute"; // Sửa ở đây
import AdminOrdersPage from "./pages/AdminOrdersPage";

// Lazy load các component mới
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage"));
const CheckoutSideMenu = lazy(() => import("./components/CheckoutSideMenu"));

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 mt-16">
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes cho user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/mine" element={<MyOrdersPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
            </Route>

            {/* Protected routes cho admin */}
            <Route element={<ProtectedRoute isAdmin />}>
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/orders/:id" element={<OrderDetailPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Floating components */}
      <Suspense fallback={null}>
        <CheckoutSideMenu />
      </Suspense>
    </div>
  );
}

export default App;
