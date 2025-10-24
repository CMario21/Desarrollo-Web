import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { api } from './api/axios';
function App() {
    const [status, setStatus] = useState('cargando...');
    useEffect(() => {
        // Prueba rápida: intenta pegarle a tu API (ajusta la ruta si tienes /health)
        api.get('/health')
            .then(() => setStatus('API OK'))
            .catch(() => setStatus('API no disponible'));
    }, []);
    return (_jsx("div", { style: { minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }, children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("h1", { children: "Votaciones" }), _jsxs("p", { children: ["Estado backend: ", _jsx("strong", { children: status })] })] }) }));
}
export default App;
