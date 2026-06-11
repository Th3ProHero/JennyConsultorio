import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/public/HomePage';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AgendaPage from './pages/admin/AgendaPage';
import PatientsPage from './pages/admin/PatientsPage';
import FinancesPage from './pages/admin/FinancesPage';
import SettingsPage from './pages/admin/SettingsPage';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="patients" element={<PatientsPage />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
