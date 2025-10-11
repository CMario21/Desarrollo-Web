import { useContext } from "react";
import { UserContext } from "../context/UserContext.jsx";

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="text-center">
      <h1 className="mb-4">Bienvenido a la página principal</h1>
      {user ? (
        <p className="lead">Hola, <strong>{user.name}</strong>! Tu sesión está activa.</p>
      ) : (
        <p className="lead">No has iniciado sesión aún. Por favor, inicia sesión para continuar.</p>
      )}
    </div>
  );
}

export default Home;
