import { Link, NavLink } from 'react-router-dom'
import { ArrowLeft, BadgeDollarSign, BookOpen, IdCard, LayoutDashboard, ScrollText, Bell, Moon, Sun, LogOut, Package, ClipboardCheck, Settings } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/admin', label: 'Panel', icon: LayoutDashboard, end: true },
  { to: '/admin/alumnos', label: 'Alumnos', icon: BookOpen },
  { to: '/admin/asistencia', label: 'Asistencia', icon: ClipboardCheck },
  { to: '/admin/ajustes', label: 'Ajustes', icon: Settings },
]

export default function AdminShell({ title, eyebrow, children, actions, backTo }) {
  const { theme, toggleTheme } = useTheme()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <motion.main 
      className="admin-shell"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{ position: 'absolute', top: 0, left: 0, right: 0 }}
    >
      <aside className="admin-sidebar">
        <div className="user-greeting-header">
          <div className="user-greeting-profile">
            <div className="user-avatar">
              <span>AD</span>
            </div>
            <div className="user-greeting-text">
              <span className="greeting-eyebrow">Hola de nuevo</span>
              <strong className="greeting-name">{user?.email?.split('@')[0] || 'Administrador'}</strong>
            </div>
          </div>
          <div className="desktop-top-right">
            <button className="icon-button" aria-label="Cambiar Tema" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="icon-button" aria-label="Cerrar sesión" onClick={handleLogout}>
              <LogOut size={20} color="var(--muted)" />
            </button>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {backTo && (
              <Link to={backTo} className="icon-button" style={{ color: 'var(--text)' }} aria-label="Volver">
                <ArrowLeft size={24} />
              </Link>
            )}
            <div>
              <span>{eyebrow}</span>
              <h1>{title}</h1>
            </div>
          </div>
          {actions ? <div className="admin-actions">{actions}</div> : null}
        </header>
        {children}
      </section>
    </motion.main>
  )
}
