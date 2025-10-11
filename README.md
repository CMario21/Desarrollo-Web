Descripcion de la API
Esta API simula un sistema básico de gestión de usuarios, utilizando un arreglo en memoria para almacenar los datos.  
Permite realizar operaciones CRUD (Create, Read, Update, Delete) y valida que el **DPI** sea único para cada usuario.

Pasos para ejecutar localmente
- Instalar dependencias
npm install

- Ejecutar API
node server.js

La api se ejecutara en el siguiente enlace: http://localhost:3000

URL de la API en render: https://desarrollo-web-37ot.onrender.com/users

Endpoints de la API
-GET /users
CODIGO: 200 OK
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

-POST/users
Solicitud
{
  "dpi": "1234567890101",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "12345"
}

Respuestas
CODIGO: 201 Created
{
  "message": "Usuario creado correctamente",
  "user": {
    "dpi": "1234567890101",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "12345"
  }
}

CODIGO: 409 Conflict
{
  "error": "El DPI ya está registrado"
}

-PUT/users/:dpi
Solicitud
{
  "name": "Juan Actualizado",
  "email": "juan.actualizado@example.com",
  "password": "abc123",
  "newDpi": "1234567890999"
}

Respuestas
CODIGO: 200 OK
{
  "message": "Usuario actualizado correctamente",
  "user": {
    "dpi": "1234567890999",
    "name": "Juan Actualizado",
    "email": "juan.actualizado@example.com",
    "password": "abc123"
  }
}

CODIGO: 404 Not Found
{
  "error": "Usuario no encontrado"
}

CODIGO: 404 Not Found
{
  "error": "Usuario no encontrado"
}

-DELETE /users/:dpi
Respuestas
CODIGO: 200 OK
{
  "message": "Usuario eliminado correctamente",
  "user": {
    "dpi": "1234567890101",
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "12345"
  }
}

CODIGO: 404 Not Found
{
  "error": "Usuario no encontrado"
}












