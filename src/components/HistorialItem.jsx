import { ArrowDownCircle, ArrowUpCircle, Gift } from 'lucide-react'
import { formatDate, formatRoyales } from '../utils/formatters.js'

const iconMap = {
  acreditar: ArrowUpCircle,
  sancionar: ArrowDownCircle,
  canjear: Gift,
}

const labelMap = {
  acreditar: 'Acreditado',
  sancionar: 'Sancionado',
  canjear: 'Canjeado',
}

export default function HistorialItem({ transaccion, onClick }) {
  const Icon = iconMap[transaccion.tipo] ?? ArrowUpCircle
  const isPositive = transaccion.tipo === 'acreditar'

  return (
    <article 
      className={`history-item ${isPositive ? 'is-positive' : 'is-negative'}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
      role={onClick ? 'button' : undefined}
    >
      <div className="history-icon">
        <Icon size={18} />
      </div>
      <div>
        <strong>{transaccion.motivo}</strong>
        <span>{labelMap[transaccion.tipo]} · {formatDate(transaccion.fecha)}</span>
      </div>
      <b>{isPositive ? '+' : '-'}{formatRoyales(transaccion.monto)}</b>
    </article>
  )
}
