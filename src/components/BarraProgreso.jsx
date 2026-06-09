export default function BarraProgreso({ progreso, siguienteRango }) {
  return (
    <div className="progress-block">
      <div className="progress-label">
        <span>Progreso de rango</span>
        <strong>{siguienteRango ? `Hacia ${siguienteRango.nombre}` : 'Rango maximo'}</strong>
      </div>
      <div className="royal-progress" role="progressbar" aria-valuenow={Math.round(progreso)} aria-valuemin="0" aria-valuemax="100">
        <span style={{ width: `${progreso}%` }} />
      </div>
    </div>
  )
}
