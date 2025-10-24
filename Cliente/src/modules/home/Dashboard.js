import { jsx as _jsx } from "react/jsx-runtime";
import { Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import VoterHome from '../voter/VoterHome'; // 👈 importa la vista del votante
export default function Dashboard() {
    const { user } = useAuth();
    // Si aún no se carga el usuario (mientras se verifica token)
    if (!user)
        return _jsx(Spinner, { animation: "border" });
    // Si es administrador → redirige al panel admin
    if (user.rol === 'admin') {
        return _jsx(Navigate, { to: "/admin", replace: true });
    }
    // Si es votante → muestra su panel de votaciones
    if (user.rol === 'voter') {
        return _jsx(VoterHome, {}); // 👈 aquí mostramos los modales de campañas habilitadas
    }
    // Si hay otro rol desconocido o error
    return (_jsx("div", { className: "text-center mt-5", children: _jsx("p", { children: "No se reconoce el rol del usuario." }) }));
}
