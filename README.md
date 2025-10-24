# Sistema de Votaciones en Línea

Este proyecto implementa una **plataforma completa de votaciones** con autenticación por roles (Administrador / Votante), desarrollada con:

- **Frontend:** React + TypeScript + React-Bootstrap + React Query  
- **Backend:** Node.js + Express + Prisma + PostgreSQL  
- **Despliegue:** Render (full-stack)

Enlace a la APP (render): https://votaciones-app-5b5c.onrender.com

Enlace a manual usuario: https://drive.google.com/file/d/1RGqIQ-xaq6lr6P5AidaY6B0IqlK5GhIe/view?usp=sharing

Enlace a manual tecnico: https://drive.google.com/file/d/1qlxQDP7aoB2RdYDDC-VOJz568AYsxSDi/view?usp=sharing

---

# Integrantes
- Mario Andres Culajay Roldan 9490-22-5771
- Samuel Estuardo España Son 9490-22-11789

---

## Características Principales

### Rol Administrador
- Crear, editar y eliminar campañas de votación.
- Asignar usuarios como candidatos a una campaña.
- Habilitar, deshabilitar o cerrar campañas.
- Visualizar resultados con gráficas.
- Generar reportes generales de votaciones.

### Rol Votante
- Ver campañas activas en el rango de fechas correspondiente.
- Emitir votos para candidatos disponibles.
- Visualizar resultados de campañas cerradas.

---

## Tecnologías Utilizadas

| Capa | Tecnología | Descripción |
|------|-------------|-------------|
| **Frontend** | React + TypeScript | SPA modular y tipada |
| **UI** | React-Bootstrap | Componentes responsivos y modernos |
| **Backend** | Node.js + Express | API REST con seguridad JWT |
| **ORM** | Prisma | Mapeo objeto-relacional con PostgreSQL |
| **Base de datos** | PostgreSQL | Almacenamiento relacional de usuarios, campañas y votos |
| **Validación** | Zod | Validación tipada de datos en backend |
| **Despliegue** | Render | Hosting automático del cliente y servidor |

---

## Estructura del Proyecto
proyecto.

├── Cliente/ # Frontend (React + TS + Vite)

│ ├── src/.

│ │ ├── api/ # Axios y configuración base.

│ │ ├── context/ # AuthContext (gestión JWT).

│ │ ├── modules/.

│ │ │ ├── admin/ # Vistas del administrador.

│ │ │ └── voter/ # Vistas del votante.

│ │ └── app.tsx, main.tsx # Punto de entrada React.

│ └── package.json.

│

├── server/ # Backend (Node + Express).

│ ├── src/.

│ │ ├── modules/ # Rutas: auth, campaigns, votes.

│ │ ├── middleware/ # Autenticación JWT.

│ │ ├── prisma/ # Configuración ORM Prisma.

│ │ └── server.ts # Punto de entrada del servidor.

│ ├── prisma/schema.prisma # Definición del modelo de BD.

│ └── package.json.

│

└── render.yaml # Configuración de despliegue Render.
