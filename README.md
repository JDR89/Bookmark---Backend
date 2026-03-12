# Bookmark App - Backend API 🚀

Este es el backend oficial de la aplicación **Bookmark**, construido con [NestJS](https://nestjs.com/). Se encarga de proveer una API RESTful robusta, manejar la autenticación de usuarios (JWT y Google OAuth), y gestionar la lógica de base de datos para los Workspaces, Colecciones y Marcadores (Bookmarks).

## 🛠️ Tecnologías Utilizadas

- **Framework:** NestJS (Node.js / TypeScript)
- **Base de Datos:** PostgreSQL
- **ORM:** TypeORM
- **Autenticación:** Passport.js (Estrategias: JWT y Google OAuth20)
- **Seguridad:** Encriptación de contraseñas con bcrypt
- **Despliegue MVP:** Diseñado para entornos como Railway

## ✨ Características Principales

- **Gestión de Usuarios:** Registro e inicio de sesión clásico con email/contraseña, y Social Login vía Google OAuth.
- **Onboarding Automático:** Al registrarse por primera vez, se genera automáticamente un Workspace "Personal", con dos Colecciones ("Read" e "Inspiration") y Bookmarks de ejemplo para una excelente experiencia de usuario.
- **Jerarquía de Datos:** 
  - `Workspaces`: Entornos de trabajo individuales.
  - `Collections`: Carpetas dentro de cada workspace.
  - `Bookmarks`: Enlaces guardados, asignados a una colección específica.
- **Seguridad y Validación:** Endpoints protegidos mediante Guards de NestJS, validación exhaustiva de DTOs usando `class-validator`.

---

## 🚀 Requisitos Previos

Antes de clonar el proyecto, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [PostgreSQL](https://www.postgresql.org/) corriendo de forma local.
- Una cuenta en [Google Cloud Console](https://console.cloud.google.com/) (si deseas probar el login con Google).

## 💻 Instalación y Configuración Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/JDR89/Bookmark---Backend.git
   cd Bookmark---Backend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**
   - Duplica el archivo `.env.template` y renómbralo a `.env`.
   - Llena los valores de acuerdo a tu entorno local (Base de datos, secretos, puertos, etc.).
   *Nota: Para desarrollo local, asegúrate de mantener `NODE_ENV=development` para que TypeORM genere las tablas automáticamente.*

4. **Levantar la Base de Datos Local con Docker:**
   - Si tienes [Docker](https://www.docker.com/) instalado, puedes levantar la base de datos de PostgreSQL usando el archivo `docker-compose.yaml` (esto creará un contenedor llamado `bookmark-db` mapeando el puerto 5432):
   ```bash
   docker-compose up -d
   ```

## 🏃‍♂️ Ejecutando la Aplicación

```bash
# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción (empaquetado)
npm run build
npm run start:prod
```

Una vez iniciada, la API estará escuchando (por defecto) en `http://localhost:3008/api` (o el puerto configurado en tu `.env`).

## ⚙️ Variables de Entorno (.env)

El archivo `.env` requiere las siguientes variables esenciales:

```env
# Entorno
NODE_ENV=development # Cambiar a 'production' al desplegar

# Base de Datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/nombre_db"

# Aplicación
PORT=3008
HOST_API=http://localhost:3008/api
FRONTEND_URL=http://localhost:3000

# Seguridad y Autenticación
JWT_SECRET=tu_secreto_super_seguro
GOOGLE_CLIENT_ID=tu_cliente_id_de_google
GOOGLE_CLIENT_SECRET=tu_cliente_secreto_de_google
```

## 🛤️ Endpoints Principales

Todos los endpoints tienen el prefijo `/api`.

* **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/google`, `/api/auth/check-status`
* **Workspaces:** `/api/workspaces` (GET, POST, PATCH, DELETE)
* **Collections:** `/api/collections` (GET, POST, PATCH, DELETE)
* **Bookmarks:** `/api/bookmarks` (GET, POST, PATCH, DELETE)

*La documentación interactiva con Swagger podría integrarse a futuro bajo `/api/docs`.*

## ☁️ Despliegue en Producción (Railway / Vercel)

1. En tu servidor (ej. Railway), configura las mismas variables de entorno, asegurándote de establecer:
   - `NODE_ENV=production`
   - `DATABASE_URL` con el string provisto por tu proveedor de Base de Datos productiva.
2. NestJS intentará escuchar el `$PORT` dinámico provisto por el host gracias a `process.env.PORT`.
3. Ajusta `FRONTEND_URL` al dominio productivo de Vercel para permitir el CORS y redirigir los callbacks de OAuth correctamente.
