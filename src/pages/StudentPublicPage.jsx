import { Link, useParams } from 'react-router-dom'
import { Coins, Crown, ScrollText, Sparkles, UserRound } from 'lucide-react'
import RoyalFrame from '../components/RoyalFrame.jsx'
import RangoInsignia from '../components/RangoInsignia.jsx'
import BarraProgreso from '../components/BarraProgreso.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import StatSeal from '../components/StatSeal.jsx'
import PublicShell from '../layouts/PublicShell.jsx'
import {
  frasesMotivacionales,
  getAlumnoById,
  getNextRango,
  getRangoBySaldo,
  getResumenAlumno,
  getTransaccionesByAlumno,
} from '../data/mockData.js'
import { formatRoyales, getProgressToNextRank } from '../utils/formatters.js'

export default function StudentPublicPage() {
  const { id } = useParams()
  const alumno = getAlumnoById(id)
  const rango = getRangoBySaldo(alumno.saldo)
  const siguienteRango = getNextRango(alumno.saldo)
  const progreso = getProgressToNextRank(alumno.saldo, rango, siguienteRango)
  const transacciones = getTransaccionesByAlumno(alumno.id)
  const resumen = getResumenAlumno(alumno.id)
  const frase = frasesMotivacionales[alumno.nombre.length % frasesMotivacionales.length]

  return (
    <PublicShell>
      <div className="admin-float">
        <span>Modo maestro</span>
        <Link to={`/admin/alumnos/${alumno.id}`}>Acciones</Link>
      </div>

      <RoyalFrame className="student-certificate">
        <header className="certificate-header">
          <div className="mini-crest"><Crown size={24} /></div>
          <span>Certificado personal</span>
          <h1>{alumno.nombre}</h1>
          <p>{alumno.numero}</p>
        </header>

        <section className="student-identity">
          <div className="portrait">
            <UserRound size={48} />
          </div>
          <div className="balance-panel">
            <span>Saldo actual</span>
            <strong>{formatRoyales(alumno.saldo)}</strong>
            <small>Royales disponibles</small>
          </div>
        </section>

        <section className="rank-panel">
          <RangoInsignia rango={rango} />
          <BarraProgreso progreso={progreso} siguienteRango={siguienteRango} />
        </section>

        <section className="seal-grid">
          <StatSeal label="Acreditado" value={formatRoyales(resumen.totalAcreditado)} detail="Historico" />
          <StatSeal label="Descontado" value={formatRoyales(resumen.totalDescontado)} detail="Sanciones y canjes" />
          <StatSeal label="Ranking" value={`#${resumen.posicion}`} detail="Grupo" />
          <StatSeal label="Racha" value={alumno.rachaDomingos} detail="Domingos" />
        </section>

        <section className="history-section">
          <div className="section-title">
            <ScrollText size={18} />
            <h2>Ultimos movimientos</h2>
          </div>
          <div className="history-list">
            {transacciones.map((transaccion) => (
              <HistorialItem key={transaccion.id} transaccion={transaccion} />
            ))}
          </div>
        </section>

        <footer className="certificate-footer">
          <Sparkles size={18} />
          <em>{frase}</em>
          <Coins size={18} />
        </footer>
      </RoyalFrame>
    </PublicShell>
  )
}
