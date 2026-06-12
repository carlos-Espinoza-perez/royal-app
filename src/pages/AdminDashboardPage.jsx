import { Link } from 'react-router-dom'
import { Plus, Zap, QrCode } from 'lucide-react'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import StatSeal from '../components/StatSeal.jsx'
import { getRangoBySaldo } from '../data/mockData.js'
import { formatRoyales } from '../utils/formatters.js'
import { useSupabaseData } from '../contexts/SupabaseDataContext.jsx'

export default function AdminDashboardPage() {
  const { alumnos, transacciones, loading } = useSupabaseData()

  const activos = alumnos.filter((alumno) => alumno.activo)
  const ranking = [...alumnos].sort((a, b) => b.saldo - a.saldo)
  const hoy = new Date().toISOString().split('T')[0]

  const stats = {
    alumnosActivos: activos.length,
    royalesCirculacion: alumnos.reduce((total, alumno) => total + alumno.saldo, 0),
    mayorSaldo: ranking[0] || { nombre: 'N/A', saldo: 0 },
    transaccionesHoy: transacciones.filter((item) => item.fecha.startsWith(hoy)).length,
  }

  return (
    <AdminShell
      title="Panel principal"
      eyebrow="Resumen del reino"
    >
      <section className="admin-stat-grid">
        <StatSeal label="Activos" value={stats.alumnosActivos} detail="Alumnos" />
        <StatSeal label="Circulacion" value={formatRoyales(stats.royalesCirculacion)} detail="Royales" />
        <StatSeal label="Mayor saldo" value={stats.mayorSaldo.nombre.split(' ')[0]} detail={formatRoyales(stats.mayorSaldo.saldo)} />
        <StatSeal label="Hoy" value={stats.transaccionesHoy} detail="Movimientos" />
      </section>

      <div style={{ margin: 'var(--space-md) 0' }}>
        <Link 
          to="/admin/escaner" 
          className="royal-button royal-button--gold" 
          style={{ width: '100%', padding: '1.25rem', fontSize: '1.2rem', justifyContent: 'center', boxShadow: '0 8px 16px rgba(212, 175, 55, 0.2)' }}
        >
          <QrCode size={24} style={{ marginRight: '0.5rem' }} /> Escanear Pase Rápido
        </Link>
      </div>

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
