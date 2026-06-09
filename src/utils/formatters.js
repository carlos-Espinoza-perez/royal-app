export function formatRoyales(value) {
  return new Intl.NumberFormat('es-NI').format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('es-NI', {
    day: '2-digit',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function getProgressToNextRank(saldo, rango, siguienteRango) {
  if (!siguienteRango) return 100
  const span = siguienteRango.min - rango.min
  return Math.min(100, Math.max(0, ((saldo - rango.min) / span) * 100))
}
