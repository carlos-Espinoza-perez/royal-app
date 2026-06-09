import { Link } from 'react-router-dom'
import { Plus, Zap } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import StatSeal from '../components/StatSeal.jsx'
import { getRanking, getRangoBySaldo, getStatsGlobales } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'

export default function AdminDashboardPage() {
  const stats = getStatsGlobales()
  const ranking = getRanking()

  return (
    <AdminShell
      title="Panel principal"
      eyebrow="Resumen del reino"
      actions={<Link className="royal-button" to="/admin/alumnos">Gestionar</Link>}
    >
      <section className="admin-stat-grid">
        <StatSeal label="Activos" value={stats.alumnosActivos} detail="Alumnos" />
        <StatSeal label="Circulacion" value={formatRoyales(stats.royalesCirculacion)} detail="Royales" />
        <StatSeal label="Mayor saldo" value={stats.mayorSaldo.nombre.split(' ')[0]} detail={formatRoyales(stats.mayorSaldo.saldo)} />
        <StatSeal label="Hoy" value={stats.transaccionesHoy} detail="Movimientos" />
      </section>

      <RoyalFrame className="admin-panel">
        <div className="section-title">
          <h2>Ranking oficial</h2>
        </div>
        <div className="ranking-list">
          {ranking.map((alumno, index) => (
            <Link className="ranking-row" to={`/admin/alumnos/${alumno.id}`} key={alumno.id}>
              <span className="rank-position">{index + 1}</span>
              <div>
                <strong>{alumno.nombre}</strong>
                <small>{alumno.numero}</small>
                <RangoInsignia rango={getRangoBySaldo(alumno.saldo)} />
              </div>
              <b>{formatRoyales(alumno.saldo)}</b>
              <span className="quick-actions">
                <Plus size={16} />
                <Zap size={16} />
              </span>
            </Link>
          ))}
        </div>
      </RoyalFrame>
    </AdminShell>
  )
}
