const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let users = []; // Arreglo en memoria

// POST /users - Crear usuario
app.post('/users', (req, res) => {
  const { dpi, name, email, password } = req.body;

  if (!dpi || !name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const userExists = users.find(u => u.dpi === dpi);
  if (userExists) {
    return res.status(409).json({ error: 'El DPI ya está registrado' });
  }

  const newUser = { dpi, name, email, password };
  users.push(newUser);
  res.status(201).json({ message: 'Usuario creado correctamente', user: newUser });
});

// GET /users - Listar usuarios
app.get('/users', (req, res) => {
  res.json(users);
});

// PUT /users/:dpi - Actualizar usuario
app.put('/users/:dpi', (req, res) => {
  const { dpi } = req.params;
  const { name, email, password, newDpi } = req.body;

  const userIndex = users.findIndex(u => u.dpi === dpi);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Si se intenta cambiar el DPI, verificar que no exista otro igual
  if (newDpi && newDpi !== dpi) {
    const duplicate = users.find(u => u.dpi === newDpi);
    if (duplicate) {
      return res.status(409).json({ error: 'El nuevo DPI ya está registrado' });
    }
    users[userIndex].dpi = newDpi;
  }

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  if (password) users[userIndex].password = password;

  res.json({ message: 'Usuario actualizado correctamente', user: users[userIndex] });
});

// DELETE /users/:dpi - Eliminar usuario
app.delete('/users/:dpi', (req, res) => {
  const { dpi } = req.params;
  const userIndex = users.findIndex(u => u.dpi === dpi);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  const deletedUser = users.splice(userIndex, 1);
  res.json({ message: 'Usuario eliminado correctamente', user: deletedUser[0] });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
