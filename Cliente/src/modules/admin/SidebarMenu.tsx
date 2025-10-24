// src/modules/admin/SidebarMenu.tsx
import { Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function SidebarMenu() {
  return (
    <Nav className="flex-column bg-light shadow-sm p-3 rounded">
      <h5 className="fw-bold mb-3 text-primary">Panel de Administración</h5>

      <NavLink
        to="/admin"
        end
        className={({ isActive }: { isActive: boolean }) =>
          `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`
        }
      >
        🗳️ Administrar Campañas
      </NavLink>

      <NavLink
        to="/admin/campaigns/new"
        className={({ isActive }: { isActive: boolean }) =>
          `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`
        }
      >
        ➕ Crear Campaña
      </NavLink>

      <NavLink
        to="/admin/reports"
        className={({ isActive }: { isActive: boolean }) =>
          `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`
        }
      >
        📊 Reportes
      </NavLink>
    </Nav>
  )
}
