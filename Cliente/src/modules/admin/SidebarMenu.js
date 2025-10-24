import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/modules/admin/SidebarMenu.tsx
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
export default function SidebarMenu() {
    return (_jsxs(Nav, { className: "flex-column bg-light shadow-sm p-3 rounded", children: [_jsx("h5", { className: "fw-bold mb-3 text-primary", children: "Panel de Administraci\u00F3n" }), _jsx(NavLink, { to: "/admin", end: true, className: ({ isActive }) => `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`, children: "\uD83D\uDDF3\uFE0F Administrar Campa\u00F1as" }), _jsx(NavLink, { to: "/admin/campaigns/new", className: ({ isActive }) => `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`, children: "\u2795 Crear Campa\u00F1a" }), _jsx(NavLink, { to: "/admin/reports", className: ({ isActive }) => `nav-link ${isActive ? 'fw-bold text-primary bg-white rounded px-2' : ''}`, children: "\uD83D\uDCCA Reportes" })] }));
}
