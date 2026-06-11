import { motion } from 'framer-motion'

export default function BarraProgreso({ progreso, siguienteRango }) {
  return (
    <div className="progress-block">
      <div className="progress-label">
        <span>Progreso de rango</span>
        <strong>{siguienteRango ? `Hacia ${siguienteRango.nombre}` : 'Rango maximo'}</strong>
      </div>
      <div className="royal-progress" role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin="0" aria-valuemax="100">
        <motion.span 
          initial={{ width: '0%' }}
          animate={{ width: `${progreso}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </div>
    </div>
  )
}
