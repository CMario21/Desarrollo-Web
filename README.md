# API con Autenticación Json Web Tocken

Esta API implementa un sistema de autenticación basado en **JSON Web Tokens (JWT)** utilizando **Node.js** y **Express.js**.  
Permite **registrar usuarios**, **iniciar sesión** (login) y **proteger endpoints** para listar, actualizar y eliminar usuarios.  
El token JWT tiene una **validez de 30 segundos**, tras la cual el usuario debe volver a autenticarse.

---

## URL de la API desplegada en Render

🔗 **https://desarrollo-web-2.onrender.com/**  

---

## Instrucciones para ejecutar la API localmente

### Ejecutar ins
```bash
npm install
```

### Crear archivo .env en la raíz del proyecto
```bash
PORT=4000
JWT_SECRET=clave
TOKEN_EXPIRES_IN=30s
CLIENT_ORIGIN=*
```

### Ejecutar proyecto
```bash
npm run dev
```

---

# Endpoints
## POST /register
Solicitud
```bash
{
  "name": "Carlos",
  "email": "carlos@example.com",
  "password": "12345"
}
```

Respuesta
```bash
{
  "message": "Usuario registrado",
  "user": {
    "id": 1729075855591,
    "name": "Carlos",
    "email": "carlos@example.com"
  }
}

```

## POST /login
Solicitud:
```bash
{'email': 'carlos@example.com', 'password': '12345'}
```
Respuesta:
```bash
{'message': ' Login exitoso. Token generado ', 'token': 'eyJhbGciOiJIUzI1NiIs...', 'expiresIn': '30s'}
```

## GET /users
Encabezados:
```bash
{'Authorization': 'Bearer TOKEN'}
```

Respuesta:
```bash
{'message': 'Lista de usuarios obtenida correctamente', 
  'count': 3, 
  'users': [
    {'id': 1, 'name': 'Alice', 'email': 'alice@example.com'}
]}
```

## PUT /users/:id
Encabezados:
```bash
{'Authorization': 'Bearer TOKEN'}
```

Solicitud:
```bash
{'name': 'Alice Actualizada'}
```
Respuesta:
```bash
{'message': ' Usuario con ID 1 actualizado correctamente', 'user': {'id': 1, 'name': 'Alice Actualizada', 'email': 'alice@example.com'}}
```

## DELETE /users/:id
Encabezados:
```bash
{'Authorization': 'Bearer TOKEN'}
```
Respuesta:
```bash
{'message': 'Usuario con ID 1 eliminado', 'deletedUser': {'id': 1, 'name': 'Alice Actualizada', 'email': 'alice@example.com'}}
```



