import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Arreglo en memoria para almacenar usuarios
let users = [];

// Ruta /register
app.post("/register", (req, res) => {
  const { name, dpi, email, password } = req.body;

  // Validar que no exista email
  const exists = users.some((user) => user.email === email);
  if (exists) {
    return res.status(400).json({ message: "El email ya está registrado" });
  }

  // Guardar usuario
  const newUser = { name, dpi, email, password };
  users.push(newUser);

  res.status(201).json({ message: "Registro exitoso" });
});

// Ruta /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  // Retornar datos del usuario (sin contraseña por seguridad)
  const { password: _, ...userData } = user;
  res.json({ message: "Login exitoso", user: userData });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Express corriendo en http://localhost:${PORT}`);
});
