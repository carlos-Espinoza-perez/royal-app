import { useParams } from 'react-router-dom'
import { BadgePlus, Gift, QrCode, ShieldMinus } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import { getAlumnoById, getRangoBySaldo, getTransaccionesByAlumno } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'

export default function AdminStudentDetailPage() {
  const { id } = useParams()
  const alumno = getAlumnoById(id)
  const transacciones = getTransaccionesByAlumno(alumno.id)

  return (
    <AdminShell title={alumno.nombre} eyebrow="Expediente del alumno">
      <RoyalFrame className="admin-panel detail-panel">
        <div className="detail-hero">
          <div className="avatar-large">{alumno.nombre.slice(0, 1)}</div>
          <div>
            <span>{alumno.numero}</span>
            <h2>{formatRoyales(alumno.saldo)} Royales</h2>
            <RangoInsignia rango={getRangoBySaldo(alumno.saldo)} />
          </div>
        </div>
        <div className="action-grid">
          <button className="royal-button"><BadgePlus size={16} /> Acreditar</button>
          <button className="royal-button"><ShieldMinus size={16} /> Sancionar</button>
          <button className="royal-button"><Gift size={16} /> Canjear</button>
          <button className="royal-button"><QrCode size={16} /> Ver QR</button>
        </div>
      </RoyalFrame>

      <RoyalFrame className="admin-panel">
        <div className="section-title"><h2>Historial del alumno</h2></div>
        <div className="history-list">
          {transacciones.map((transaccion) => (
            <HistorialItem key={transaccion.id} transaccion={transaccion} />
          ))}
        </div>
      </RoyalFrame>
    </AdminShell>
  )
}
