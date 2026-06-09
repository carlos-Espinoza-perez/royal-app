import { NavLink } from 'react-router-dom'
import { BadgeDollarSign, BookOpen, IdCard, LayoutDashboard, ScrollText } from 'lucide-react'

const navItems = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/alumnos', label: 'Alumnos', icon: BookOpen },
  { to: '/admin/transacciones', label: 'Historial', icon: ScrollText },
  { to: '/admin/carnets', label: 'Carnets', icon: IdCard },
]

export default function AdminShell({ title, eyebrow, children, actions }) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-mark">
          <BadgeDollarSign size={24} />
          <div>
            <strong>Royal Treasury</strong>
            <span>Administracion</span>
          </div>
        </div>
        <nav className="admin-nav" aria-label="Navegacion admin">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.end}>
                <Icon size={18} />
                {item.label}
              </NavLink>
            )
          })}
        </nav>
      </aside>
      <section className="admin-content">
        <header className="admin-header">
          <div>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
          {actions ? <div className="admin-actions">{actions}</div> : null}
        </header>
        {children}
      </section>
    </main>
  )
}
