import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { Products } from '@/pages/products/Products'
import { Finance } from '@/pages/finance/Finance'
import SettingsPage from '@/pages/settings'
import { CheckoutPage } from '@/pages/public/CheckoutPage'
import NotFoundPage from '@/pages/public/NotFoundPage'

import { AuroraBackground } from '@/components/ui/aurora-background'

export default function App() {
  return (
    <BrowserRouter>
      <AuroraBackground />
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route index element={<Navigate to="/auth/login" />} />
        </Route>

        {/* Protected App Routes */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/profile" element={<SettingsPage />} />
        </Route>

        {/* Public Checkout Routes */}
        {/* Option A: Root wildcard (catch-all for slugs) */}
        <Route path="/:slug" element={<CheckoutPage />} />

        {/* Option B: Explicit prefix (safer) */}
        <Route path="/p/:slug" element={<CheckoutPage />} />

        {/* 404 Fallback - MUST be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
