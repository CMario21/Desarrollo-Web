import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware para JSON
app.use(express.json());

// Base de datos en memoria
const users = [];

// Rutas de API
app.post("/register", (req, res) => {
  const { email } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email ya registrado" });
  }
  users.push(req.body);
  res.json({ message: "Usuario registrado", user: req.body });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: "Credenciales incorrectas" });
  res.json({ message: "Login exitoso", user });
});

// Servir archivos estáticos de React
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
