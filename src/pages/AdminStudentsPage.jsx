import { Link } from 'react-router-dom'
import { Search, UserPlus } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import { alumnos, getRangoBySaldo } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'

export default function AdminStudentsPage() {
  return (
    <AdminShell title="Gestion de alumnos" eyebrow="Registro real" actions={<button className="royal-button"><UserPlus size={16} /> Nuevo</button>}>
      <RoyalFrame className="admin-panel">
        <label className="search-box">
          <Search size={18} />
          <input placeholder="Buscar alumno" />
        </label>
        <div className="student-admin-list">
          {alumnos.map((alumno) => (
            <Link className="student-admin-row" to={`/admin/alumnos/${alumno.id}`} key={alumno.id}>
              <div className="avatar-small">{alumno.nombre.slice(0, 1)}</div>
              <div>
                <strong>{alumno.nombre}</strong>
                <small>{alumno.numero} · {alumno.activo ? 'Activo' : 'Inactivo'}</small>
                <RangoInsignia rango={getRangoBySaldo(alumno.saldo)} />
              </div>
              <b>{formatRoyales(alumno.saldo)}</b>
            </Link>
          ))}
        </div>
      </RoyalFrame>
    </AdminShell>
  )
}
