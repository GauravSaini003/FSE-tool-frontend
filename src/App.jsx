import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { MainDashboard } from './pages/dashboard/MainDashboard';
import { OrderListPage } from './pages/orders/OrderListPage';
import { CreateOrderPage } from './pages/orders/CreateOrderPage';
import { OrderDetailPage } from './pages/orders/OrderDetailPage';
import { CustomerListPage } from './pages/customers/CustomerListPage';
import { ProductListPage } from './pages/products/ProductListPage';
import { UserManagementPage } from './pages/users/UserManagementPage';
import { SchemeListPage } from './pages/schemes/SchemeListPage';
import { DispatchQueuePage } from './pages/dispatch/DispatchQueuePage';
import { Toaster } from 'react-hot-toast';
import { ROLES } from './utils/constants';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<MainDashboard />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route element={<ProtectedRoute allowedRoles={[ROLES.FSE]} />}>
                <Route path="/orders/new" element={<CreateOrderPage />} />
              </Route>
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route element={<ProtectedRoute allowedRoles={[ROLES.FSE, ROLES.TEAM_LEADER, ROLES.ADMIN]} />}>
                <Route path="/customers" element={<CustomerListPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={[ROLES.FSE, ROLES.WAREHOUSE, ROLES.ADMIN]} />}>
                <Route path="/products" element={<ProductListPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/users" element={<UserManagementPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/schemes" element={<SchemeListPage />} />
              </Route>
              <Route element={<ProtectedRoute allowedRoles={[ROLES.DISPATCH]} />}>
                <Route path="/dispatch-queue" element={<DispatchQueuePage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}