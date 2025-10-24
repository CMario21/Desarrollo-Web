import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../modules/auth/Login';
import Register from '../modules/auth/Register';
import Dashboard from '../modules/home/Dashboard';
import { useAuth } from '../context/AuthContext';
import AdminPanel from '../modules/admin/AdminPanel';
import VoterHome from '../modules/voter/VoterHome';
function Private({ children }) {
    const { token } = useAuth();
    return token ? children : _jsx(Navigate, { to: "/login", replace: true });
}
export default function AppRouter() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/", element: _jsx(Private, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) }), _jsx(Route, { path: "/admin/*", element: _jsx(Private, { children: _jsx(AdminPanel, {}) }) }), _jsx(Route, { path: "/", element: _jsx(VoterHome, {}) })] }));
}
