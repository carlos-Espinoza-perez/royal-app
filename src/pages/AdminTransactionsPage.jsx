import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import HistorialItem from '../components/HistorialItem.jsx'
import { alumnos, transacciones } from '../data/mockData.js'

export default function AdminTransactionsPage() {
  const items = [...transacciones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  return (
    <AdminShell title="Historial global" eyebrow="Libro de movimientos">
      <RoyalFrame className="admin-panel">
        <div className="filter-strip">
          <button>Todos</button>
          <button>Acreditar</button>
          <button>Sancionar</button>
          <button>Canjear</button>
        </div>
        <div className="history-list">
          {items.map((transaccion) => {
            const alumno = alumnos.find((item) => item.id === transaccion.alumnoId)
            return (
              <div className="global-history-row" key={transaccion.id}>
                <small>{alumno?.nombre}</small>
                <HistorialItem transaccion={transaccion} />
              </div>
            )
          })}
        </div>
      </RoyalFrame>
    </AdminShell>
  )
}
