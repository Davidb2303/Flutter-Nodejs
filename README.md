# Backend API para App de Citas Flutter

Backend completo en Node.js con Express, Prisma y MySQL para la aplicación de citas tipo Tinder.

## 🚀 Características

- ✅ **Autenticación JWT** completa (registro, login, verificación)
- ✅ **Sistema de usuarios** con perfiles personalizables
- ✅ **Sistema de swipes** (like/dislike) 
- ✅ **Sistema de matches** automático
- ✅ **Chat/Mensajería** entre matches
- ✅ **Base de datos MySQL** con Prisma ORM
- ✅ **Middleware de seguridad** (helmet, cors, rate limiting)

## 📋 Requisitos Previos

- Node.js 16+ 
- MySQL 8.0+
- npm o yarn

## ⚙️ Instalación

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos

Crea una base de datos MySQL:
```sql
CREATE DATABASE dating_app;
```

### 3. Configurar variables de entorno

Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
```env
DATABASE_URL="mysql://usuario:contraseña@localhost:3306/dating_app"
JWT_SECRET="tu_jwt_secret_muy_seguro_aqui"
PORT=8080
NODE_ENV=development
```

### 4. Configurar Prisma

```bash
# Generar cliente de Prisma
npm run db:generate

# Aplicar esquema a la base de datos
npm run db:push
```

### 5. Ejecutar el servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📡 Endpoints de la API

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/register` | Registro de usuario |
| POST | `/login` | Inicio de sesión |
| GET | `/verify` | Verificar token JWT |

### 👤 Usuarios (`/api/users`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/potential-matches` | Obtener usuarios para hacer match |
| GET | `/me` | Obtener mi perfil |
| PUT | `/me` | Actualizar mi perfil |
| GET | `/:id` | Obtener perfil de usuario |

### 💕 Swipes (`/api/swipes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Procesar swipe (like/dislike) |
| GET | `/me` | Obtener mi historial de swipes |

### 🎯 Matches (`/api/matches`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos mis matches |
| GET | `/:matchId` | Obtener detalles de un match |
| DELETE | `/:matchId` | Deshacer un match |

### 💬 Mensajes (`/api/messages`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/` | Enviar mensaje |
| GET | `/conversations` | Obtener conversaciones recientes |
| GET | `/match/:matchId` | Obtener mensajes de un match |
| PUT | `/match/:matchId/read` | Marcar mensajes como leídos |

## 📝 Ejemplos de Uso

### Registro de Usuario
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "email": "juan@email.com", 
    "password": "123456",
    "name": "Juan Pérez",
    "age": 25
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "juan123",
    "password": "123456"
  }'
```

### Procesar Swipe
```bash
curl -X POST http://localhost:8080/api/swipes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -d '{
    "targetId": 2,
    "isLike": true
  }'
```

## 🗄️ Estructura de Base de Datos

### Tablas Principales:
- **users** - Información de usuarios
- **swipes** - Registro de likes/dislikes  
- **matches** - Matches confirmados
- **messages** - Mensajes del chat

### Relaciones:
- Usuario puede tener muchos swipes enviados/recibidos
- Match conecta dos usuarios 
- Mensajes pertenecen a un match específico

## 🛡️ Seguridad

- **JWT Authentication** para todas las rutas protegidas
- **Bcrypt** para hash de contraseñas
- **Helmet** para headers de seguridad
- **CORS** configurado
- **Rate Limiting** para prevenir spam
- **Validación** de datos de entrada

## 🔧 Scripts Disponibles

```bash
npm start          # Ejecutar en producción
npm run dev        # Ejecutar en desarrollo con nodemon
npm run db:generate # Generar cliente de Prisma
npm run db:push    # Aplicar esquema a BD
npm run db:migrate # Crear migración
npm run db:studio  # Abrir Prisma Studio
```

## 🌐 Configuración para Flutter

En tu Flutter app, configura la URL base:

```dart
// lib/services/user_service.dart
static const String baseUrl = 'http://localhost:8080/api';
```

Para dispositivos físicos, usa la IP de tu máquina:
```dart
static const String baseUrl = 'http://192.168.1.XXX:8080/api';
```

## 📊 Monitoreo

- Health check: `GET /health`
- Logs en consola para debugging
- Variables de entorno para diferentes ambientes

## 🚀 Despliegue

Para producción, configura:

1. **Variables de entorno** seguras
2. **Base de datos** en la nube (AWS RDS, Google Cloud SQL, etc.)
3. **JWT_SECRET** completamente aleatorio
4. **CORS** con dominios específicos
5. **HTTPS** obligatorio

---

**¡Tu backend está listo para conectarse con tu app Flutter! 🎉**