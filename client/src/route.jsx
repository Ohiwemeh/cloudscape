import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./layout/MainLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Settings from "./pages/Settings.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";

// 1. Import the new ProtectedAdminRoute (which uses useAuth)
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
// 2. Import our NEW unified AuthProvider
import { AuthProvider } from "./context/AuthContext.jsx";

export default function AppRouter() {
  return (
    // 3. Wrap your ENTIRE app in the new AuthProvider
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* All your public/user routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Routes */}
          {/* This setup is PERFECT. It will now use the new */}
          {/* ProtectedAdminRoute which checks user.isAdmin */}
          <Route path="/admin" element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
