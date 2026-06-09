export const rangos = [
  { nombre: 'Novato', min: 0, max: 149, color: '#7a6a48', simbolo: 'N' },
  { nombre: 'Activo', min: 150, max: 349, color: '#2d5a3d', simbolo: 'A' },
  { nombre: 'Elite', min: 350, max: 649, color: '#23456d', simbolo: 'E' },
  { nombre: 'Leyenda', min: 650, max: Infinity, color: '#8a6424', simbolo: 'L' },
]

export const alumnos = [
  {
    id: '6fbb8fb7-9ff9-48ec-9238-caa79ff5e001',
    nombre: 'Daniela Morales',
    numero: 'RT-2026-001',
    saldo: 780,
    activo: true,
    fotoUrl: '',
    rachaDomingos: 6,
  },
  {
    id: '6fbb8fb7-9ff9-48ec-9238-caa79ff5e002',
    nombre: 'Mateo Ruiz',
    numero: 'RT-2026-002',
    saldo: 520,
    activo: true,
    fotoUrl: '',
    rachaDomingos: 4,
  },
  {
    id: '6fbb8fb7-9ff9-48ec-9238-caa79ff5e003',
    nombre: 'Sofia Hernandez',
    numero: 'RT-2026-003',
    saldo: 310,
    activo: true,
    fotoUrl: '',
    rachaDomingos: 3,
  },
  {
    id: '6fbb8fb7-9ff9-48ec-9238-caa79ff5e004',
    nombre: 'Gabriel Castillo',
    numero: 'RT-2026-004',
    saldo: 145,
    activo: false,
    fotoUrl: '',
    rachaDomingos: 1,
  },
  {
    id: '6fbb8fb7-9ff9-48ec-9238-caa79ff5e005',
    nombre: 'Valeria Cruz',
    numero: 'RT-2026-005',
    saldo: 95,
    activo: true,
    fotoUrl: '',
    rachaDomingos: 2,
  },
]

export const transacciones = [
  {
    id: 'tx-001',
    alumnoId: alumnos[0].id,
    tipo: 'acreditar',
    monto: 100,
    motivo: 'Puntualidad y participacion',
    fecha: '2026-06-07T09:15:00',
  },
  {
    id: 'tx-002',
    alumnoId: alumnos[0].id,
    tipo: 'canjear',
    monto: 50,
    motivo: 'Canje de premio especial',
    fecha: '2026-06-07T10:05:00',
  },
  {
    id: 'tx-003',
    alumnoId: alumnos[0].id,
    tipo: 'acreditar',
    monto: 500,
    motivo: 'Invitado nuevo',
    fecha: '2026-05-31T09:40:00',
  },
  {
    id: 'tx-004',
    alumnoId: alumnos[1].id,
    tipo: 'acreditar',
    monto: 100,
    motivo: 'Biblia fisica',
    fecha: '2026-06-07T09:30:00',
  },
  {
    id: 'tx-005',
    alumnoId: alumnos[2].id,
    tipo: 'sancionar',
    monto: 50,
    motivo: 'Llegada tarde',
    fecha: '2026-06-07T09:50:00',
  },
  {
    id: 'tx-006',
    alumnoId: alumnos[3].id,
    tipo: 'acreditar',
    monto: 50,
    motivo: 'Versiculo de memoria',
    fecha: '2026-05-24T10:10:00',
  },
  {
    id: 'tx-007',
    alumnoId: alumnos[4].id,
    tipo: 'acreditar',
    monto: 100,
    motivo: 'Culto semanal',
    fecha: '2026-06-07T09:25:00',
  },
]

export const frasesMotivacionales = [
  'Somos mas que miembros, somos herederos del reino.',
  'Honramos a Dios con lo que somos, tenemos y hacemos.',
  'Disciplina, generosidad, fe e integridad.',
  'Jovenes que invierten en el reino.',
  'Tu fidelidad construye tu legado.',
]

export function getRangoBySaldo(saldo) {
  return rangos.find((rango) => saldo >= rango.min && saldo <= rango.max) ?? rangos[0]
}

export function getNextRango(saldo) {
  return rangos.find((rango) => rango.min > saldo) ?? null
}

export function getAlumnoById(id) {
  return alumnos.find((alumno) => alumno.id === id) ?? alumnos[0]
}

export function getTransaccionesByAlumno(alumnoId) {
  return transacciones
    .filter((transaccion) => transaccion.alumnoId === alumnoId)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

export function getRanking() {
  return [...alumnos].sort((a, b) => b.saldo - a.saldo)
}

export function getStatsGlobales() {
  const activos = alumnos.filter((alumno) => alumno.activo)
  const ranking = getRanking()
  const hoy = '2026-06-07'

  return {
    alumnosActivos: activos.length,
    royalesCirculacion: alumnos.reduce((total, alumno) => total + alumno.saldo, 0),
    mayorSaldo: ranking[0],
    transaccionesHoy: transacciones.filter((item) => item.fecha.startsWith(hoy)).length,
  }
}

export function getResumenAlumno(alumnoId) {
  const items = getTransaccionesByAlumno(alumnoId)
  const totalAcreditado = items
    .filter((item) => item.tipo === 'acreditar')
    .reduce((total, item) => total + item.monto, 0)
  const totalDescontado = items
    .filter((item) => item.tipo !== 'acreditar')
    .reduce((total, item) => total + item.monto, 0)
  const ranking = getRanking()
  const posicion = ranking.findIndex((alumno) => alumno.id === alumnoId) + 1

  return { totalAcreditado, totalDescontado, posicion }
}
