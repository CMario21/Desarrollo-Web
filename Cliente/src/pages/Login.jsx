import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext); // función para guardar usuario en el contexto

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
      } else {
        login(data.user); // guarda los datos del usuario en el contexto
        navigate("/home"); // redirige a Home
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="row justify-content-center w-100">
      <div className="col-md-6 col-lg-4">
        <div className="card shadow p-4 border-success">
          <h2 className="mb-4 text-center">Login</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-success w-100">Ingresar</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
