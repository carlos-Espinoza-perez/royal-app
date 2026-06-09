import { ShieldCheck } from 'lucide-react'

export default function RangoInsignia({ rango }) {
  return (
    <span className="rank-badge" style={{ '--rank-color': rango.color }}>
      <ShieldCheck size={16} />
      {rango.nombre}
    </span>
  )
}
