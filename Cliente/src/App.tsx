import { useEffect, useState } from 'react';
// antes: import { api } from './api/axios'
import api from './api/axios'


function App() {
  const [status, setStatus] = useState<string>('cargando...');

  useEffect(() => {
    // Prueba rápida: intenta pegarle a tu API (ajusta la ruta si tienes /health)
    api.get('/health')
      .then(() => setStatus('API OK'))
      .catch(() => setStatus('API no disponible'));
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Votaciones</h1>
        <p>Estado backend: <strong>{status}</strong></p>
      </div>
    </div>
  );
}

export default App;