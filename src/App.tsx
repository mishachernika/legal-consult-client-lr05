import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Layout from '@/components/layout/Layout';
import AboutPage from '@/pages/AboutPage';
import ConsultationDetailPage from '@/pages/ConsultationDetailPage';
import ConsultationFormPage from '@/pages/ConsultationFormPage';
import ConsultationsListPage from '@/pages/ConsultationsListPage';
import DashboardPage from '@/pages/DashboardPage';
import HomePage from '@/pages/HomePage';
import LawyerDetailPage from '@/pages/LawyerDetailPage';
import LawyersListPage from '@/pages/LawyersListPage';
import LoginPage from '@/pages/LoginPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotificationsPage from '@/pages/NotificationsPage';
import RegisterPage from '@/pages/RegisterPage';
import SpecializationFormPage from '@/pages/SpecializationFormPage';
import SpecializationsListPage from '@/pages/SpecializationsListPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публічні сторінки без каркасу */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Публічні сторінки з Header/Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
        </Route>

        {/* Захищений кабінет із бічною панеллю */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/consultations" element={<ConsultationsListPage />} />
          <Route path="/consultations/create" element={<ConsultationFormPage />} />
          <Route path="/consultations/:id" element={<ConsultationDetailPage />} />
          <Route path="/consultations/:id/edit" element={<ConsultationFormPage />} />
          <Route path="/lawyers" element={<LawyersListPage />} />
          <Route path="/lawyers/:id" element={<LawyerDetailPage />} />
          <Route path="/specializations" element={<SpecializationsListPage />} />
          <Route
            path="/specializations/create"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <SpecializationFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/specializations/:id/edit"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <SpecializationFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
