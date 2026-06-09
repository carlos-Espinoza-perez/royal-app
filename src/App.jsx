import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import StudentPublicPage from './pages/StudentPublicPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminStudentsPage from './pages/AdminStudentsPage.jsx'
import AdminStudentDetailPage from './pages/AdminStudentDetailPage.jsx'
import AdminTransactionsPage from './pages/AdminTransactionsPage.jsx'
import AdminCardsPage from './pages/AdminCardsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/alumno/:id" element={<StudentPublicPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/alumnos" element={<AdminStudentsPage />} />
      <Route path="/admin/alumnos/:id" element={<AdminStudentDetailPage />} />
      <Route path="/admin/transacciones" element={<AdminTransactionsPage />} />
      <Route path="/admin/carnets" element={<AdminCardsPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
