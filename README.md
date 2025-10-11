# Descripción de la API

Esta API simula un sistema básico de gestión de usuarios, utilizando un arreglo en memoria para almacenar los datos.  
Permite realizar operaciones **CRUD** (Create, Read, Update, Delete) y valida que el **DPI** sea único para cada usuario.

---

## Pasos para ejecutar localmente

### Instalar dependencias
```bash
npm install
```

### Ejecutar la API
```bash
node server.js
```

### Enlace local: http://localhost:3000

---

# URL de la API en Render 
https://desarrollo-web-37ot.onrender.com/users

---

# Endpoints de la API

### Get /users
```bash
Codigo: 200 ok
[
  {
    "dpi": "1234567890101",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "12345"
  },
  {
    "dpi": "9834573845123",
    "name": "Manuel Escobar",
    "email": "manuel@example.com",
    "password": "123458"
  }
]
```
### POST /users
Solicitud:
```bash
{
  "dpi": "9834573845123",
  "name": "Manuel Escobar",
  "email": "manuel@example.com",
  "password": "123458"
}
```
Respuestas
```
Código: 201 Created
{
  "message": "Usuario agregado correctamente"
}
```
```
Código: 409 Conflict
{
  "error": "El usuario con este DPI ya existe"
}
```
### PUT /users/:dpi
Solicitud:
```bash
{
  "name": "Juan Pérez Actualizado",
  "email": "juanperez@example.com",
  "password": "67890"
  "newDPI": "1234567890123"
}
```
Respuestas
```
Código: 200 OK
{
  "message": "Usuario actualizado correctamente"
}
```
```
Código: 404 Not Found
{
  "error": "Usuario no encontrado"
}
```
```
Código: 409 Conflict
{
  "error": "El nuevo DPI ya está registrado"
}
```
### DELETE /users/:dpi
Respuestas
```
Código: 200 OK
{
  "message": "Usuario eliminado correctamente",
  "user": {
    "dpi": "1234567890101",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "12345"
  }
}
```
```
Código: 404 Not Found
{
  "error": "Usuario no encontrado"
}
```




