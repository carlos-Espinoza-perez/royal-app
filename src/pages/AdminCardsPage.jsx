import { Download, Move, Upload } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import { alumnos } from '../data/mockData.js'

export default function AdminCardsPage() {
  return (
    <AdminShell title="Generador de carnets" eyebrow="Identificacion oficial">
      <RoyalFrame className="admin-panel cards-workspace">
        <div className="upload-zone">
          <Upload size={24} />
          <strong>Subir imagen base</strong>
          <span>PNG o JPG del carnet sin datos</span>
        </div>
        <div className="card-preview">
          <span>Royal Treasury</span>
          <strong>Nombre del alumno</strong>
          <small>RT-2026-000</small>
          <div className="qr-placeholder">QR</div>
        </div>
        <div className="action-grid">
          <button className="royal-button"><Move size={16} /> Calibrar</button>
          <button className="royal-button"><Download size={16} /> Generar PDF</button>
        </div>
      </RoyalFrame>
      <RoyalFrame className="admin-panel">
        <div className="section-title"><h2>Seleccion de alumnos</h2></div>
        <div className="checkbox-list">
          {alumnos.map((alumno) => (
            <label key={alumno.id}>
              <input type="checkbox" defaultChecked={alumno.activo} />
              <span>{alumno.nombre}</span>
              <small>{alumno.numero}</small>
            </label>
          ))}
        </div>
      </RoyalFrame>
    </AdminShell>
  )
}
