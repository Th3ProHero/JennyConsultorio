import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import PrivacyNoticePage from './pages/public/PrivacyNoticePage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AgendaPage from './pages/admin/AgendaPage';
import PatientsPage from './pages/admin/PatientsPage';
import FinancesPage from './pages/admin/FinancesPage';
import SettingsPage from './pages/admin/SettingsPage';
import NotesPage from './pages/admin/NotesPage';
import LoginPage from './pages/admin/LoginPage';
import ProtectedRoute from './components/admin/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/aviso-de-privacidad" element={<PrivacyNoticePage />} />

      {/* Login Route */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="agenda" element={<AgendaPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="finances" element={<FinancesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="notes" element={<NotesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
