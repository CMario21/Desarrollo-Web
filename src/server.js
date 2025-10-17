import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "adminUMG2025";
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || "30s";

app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(helmet());
app.use(morgan("dev"));

// === "Base de datos" en memoria (solo para pruebas) ===
let users = [
  { id: 1, name: "Mario", email: "mario@ejemplo.com", password: "123" },
  { id: 2, name: "Felix",   email: "felix@ejemplo.com",   password: "321"  }
];

// === Middleware de autenticación ===
function verifyToken(req, res, next) {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}


app.get("/", (_req, res) =>
  res.json({ ok: true, message: "API JWT funcionando correctamente" })
);


app.post("/register", (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email y password son requeridos" });
  }

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: "Email ya registrado" });
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  const { password: _omit, ...safe } = newUser;
  return res.status(201).json({
    message: "Usuario registrado",
    user: safe,
  });
});


app.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email y password son requeridos" });
  }

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRES_IN }
  );

  res.json({
    message: "Login exitoso. Token generado",
    token,
    expiresIn: TOKEN_EXPIRES_IN,
  });
});


app.get("/users", verifyToken, (_req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u);
  res.json({
    message: "Lista de usuarios obtenida correctamente",
    count: safeUsers.length,
    users: safeUsers,
  });
});


app.put("/users/:id", verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { name, email, password } = req.body || {};
  if (name !== undefined) users[idx].name = name;
  if (email !== undefined) users[idx].email = email;
  if (password !== undefined) users[idx].password = password;

  const { password: _omit, ...safe } = users[idx];
  res.json({
    message: `Usuario con ID ${id} actualizado`,
    user: safe,
  });
});


app.delete("/users/:id", verifyToken, (req, res) => {
  const id = Number(req.params.id);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const deletedUser = users[idx];
  users.splice(idx, 1);

  res.json({
    message: `Usuario con ID ${id} eliminado`,
    deletedUser: { id: deletedUser.id, name: deletedUser.name, email: deletedUser.email },
  });
});

// === Iniciar servidor ===
app.listen(PORT, () => {
  console.log(`API ejetcutandose en http://localhost:${PORT}`);
});
