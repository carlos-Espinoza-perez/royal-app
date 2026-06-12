import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, UserPlus } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import { getRangoBySaldo } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'
import { useToast } from '../contexts/ToastContext.jsx'
import Modal from '../components/Modal.jsx'

export default function AdminStudentsPage() {
  const { alumnos, addAlumno, loading } = useSupabaseData()
  const { showToast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newNombre, setNewNombre] = useState('')

  const filteredAlumnos = alumnos.filter(a => 
    a.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.numero.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = (e) => {
    e.preventDefault()
    if (!newNombre) return
    addAlumno(newNombre)
    showToast(`Alumno ${newNombre} creado exitosamente.`)
    setIsModalOpen(false)
    setNewNombre('')
  }

  return (
    <AdminShell backTo="/admin" 
      title="Gestion de alumnos" 
      eyebrow="Registro real" 
      actions={<button className="royal-button" onClick={() => setIsModalOpen(true)}><UserPlus size={16} /> Nuevo</button>}
    >
      <RoyalFrame className="admin-panel">
        <label className="search-box">
          <Search size={18} />
          <input 
            placeholder="Buscar alumno" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
        <div className="student-admin-list">
          {filteredAlumnos.map((alumno) => (
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
          {filteredAlumnos.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted)' }}>
              No se encontraron alumnos.
            </div>
          )}
        </div>
      </RoyalFrame>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Alumno">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="modal-form-group">
            <label>Nombre completo</label>
            <input 
              required
              placeholder="Ej. Juan Pérez" 
              value={newNombre} 
              onChange={e => setNewNombre(e.target.value)} 
              autoFocus
            />
          </div>
          <button type="submit" className="royal-button royal-button--gold" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
            Guardar Alumno
          </button>
        </form>
      </Modal>
    </AdminShell>
  )
}
