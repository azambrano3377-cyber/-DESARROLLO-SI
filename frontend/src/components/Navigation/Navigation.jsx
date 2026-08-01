import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  PlusCircle,
  TicketCheck,
  X
} from 'lucide-react';

import './Navigation.css';

function Navigation() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <>
      <header className="mobile-header">
        <div className="mobile-brand">
          <TicketCheck size={26} />
          <span>Help Desk</span>
        </div>

        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Abrir menú de navegación"
        >
          {menuAbierto ? <X /> : <Menu />}
        </button>
      </header>

      <aside className={`sidebar ${menuAbierto ? 'sidebar-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <TicketCheck size={29} />
          </div>

          <div>
            <strong>Help Desk</strong>
            <span>Gestión de incidentes</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/dashboard"
            onClick={cerrarMenu}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/reportar"
            onClick={cerrarMenu}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            <PlusCircle size={20} />
            <span>Registrar incidente</span>
          </NavLink>

          <NavLink
            to="/tickets"
            onClick={cerrarMenu}
            className={({ isActive }) =>
              isActive ? 'nav-item nav-item-active' : 'nav-item'
            }
          >
            <TicketCheck size={20} />
            <span>Listado de tickets</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span>Sistema de soporte técnico</span>
          <small>Versión 1.0</small>
        </div>
      </aside>

      {menuAbierto && (
        <button
          type="button"
          className="sidebar-overlay"
          onClick={cerrarMenu}
          aria-label="Cerrar menú"
        />
      )}
    </>
  );
}

export default Navigation;