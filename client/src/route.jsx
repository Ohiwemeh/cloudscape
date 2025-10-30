import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import { Analytics } from '@vercel/analytics/react';

// Layouts
import MainLayout from "./layout/MainLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

// User Pages
import Dashboard from "./pages/Dashboard.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Settings from "./pages/Settings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import LookBook from "./pages/LookBook.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Help from "./pages/Help.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import New from "./pages/New.jsx";
import Exclusive from "./pages/Exclusive.jsx";
import Profile from "./pages/Profile.jsx";


// Admin Pages
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";
import AdminAnalytics from "./pages/AdminAnalytics.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

export default function AppRouter() {
  return (
    <AuthProvider>
     
      <BrowserRouter>
        <Routes>
     <Analytics />
          {/* Auth Routes */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Public/User Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lookbook" element={<LookBook />} />
            <Route path="new" element={<New />} />
            <Route path="women" element={<Exclusive />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="help" element={<Help />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="products" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<Profile />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
