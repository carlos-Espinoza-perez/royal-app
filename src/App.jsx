import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import StudentPublicPage from './pages/StudentPublicPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminStudentsPage from './pages/AdminStudentsPage.jsx'
import AdminStudentDetailPage from './pages/AdminStudentDetailPage.jsx'
import AdminTransactionsPage from './pages/AdminTransactionsPage.jsx'
import AdminCardsPage from './pages/AdminCardsPage.jsx'
import AdminCardEditorPage from './pages/AdminCardEditorPage.jsx'
import AdminScannerPage from './pages/AdminScannerPage.jsx'
import AdminRewardsPage from './pages/AdminRewardsPage.jsx'
import AdminAttendancePage from './pages/AdminAttendancePage.jsx'
import AdminSettingsPage from './pages/AdminSettingsPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/alumno/:id" element={<StudentPublicPage />} />
      
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/alumnos" element={<AdminStudentsPage />} />
        <Route path="/admin/alumnos/:id" element={<AdminStudentDetailPage />} />
        <Route path="/admin/asistencia" element={<AdminAttendancePage />} />
        <Route path="/admin/transacciones" element={<AdminTransactionsPage />} />
        <Route path="/admin/premios" element={<AdminRewardsPage />} />
        <Route path="/admin/carnets" element={<AdminCardsPage />} />
        <Route path="/admin/carnets/editor" element={<AdminCardEditorPage />} />
        <Route path="/admin/escaner" element={<AdminScannerPage />} />
        <Route path="/admin/ajustes" element={<AdminSettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
