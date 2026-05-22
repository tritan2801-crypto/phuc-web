import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ShopLayoutWrapper from './components/layout/ShopLayoutWrapper'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetailPage from './pages/Products/DetailPage'
import SolutionDetailPage from './pages/Solutions/DetailPage'
import Blog from './pages/Blog'
import BlogDetailPage from './pages/Blog/DetailPage'
import AgencyPortal from './pages/Agency'

// Admin Pages
import AdminLayout from './pages/Admin/Layout'
import AdminLogin from './pages/Admin/Login'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminProducts from './pages/Admin/Products'
import AdminUsers from './pages/Admin/Users'
import AdminAnalytics from './pages/Admin/Analytics'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <ShopLayoutWrapper>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/giai-phap/:slug" element={<SolutionDetailPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/agency" element={<AgencyPortal />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ShopLayoutWrapper>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
