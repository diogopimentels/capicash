import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { Dashboard } from '@/pages/dashboard/Dashboard'
import { Products } from '@/pages/products/Products'
import { Finance } from '@/pages/finance/Finance'
import SettingsPage from '@/pages/settings'
import { Checkout } from '@/pages/public/Checkout'

import { AuroraBackground } from '@/components/ui/aurora-background'

export default function App() {
  return (
    <BrowserRouter>
      <AuroraBackground />
      <Routes>
        {/* Public Routes */}
        <Route path="/p/:linkId" element={<Checkout />} />

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
      </Routes>
    </BrowserRouter>
  )
}
