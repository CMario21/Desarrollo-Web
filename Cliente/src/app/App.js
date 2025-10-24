import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function AppShell({ children }) {
    const { user, logout } = useAuth();
    const nav = useNavigate();
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, { bg: "dark", variant: "dark", expand: "sm", children: _jsxs(Container, { children: [_jsx(Navbar.Brand, { as: Link, to: "/", children: "Votaciones" }), _jsxs(Nav, { className: "ms-auto", children: [!user && _jsx(Nav.Link, { as: Link, to: "/login", children: "Login" }), !user && _jsx(Nav.Link, { as: Link, to: "/register", children: "Register" }), user && _jsxs(Navbar.Text, { className: "me-3", children: ["Hola, ", user.nombre] }), user && _jsx(Nav.Link, { onClick: () => { logout(); nav('/login'); }, children: "Salir" })] })] }) }), _jsx(Container, { className: "py-4", children: children })] }));
}
