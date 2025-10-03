# 🚀 Postman Collection - Flutter Dating API

Esta colección contiene todas las pruebas para los endpoints del backend de la aplicación de citas Flutter.

## 📂 Archivos Incluidos

- **`Flutter-Dating-API.postman_collection.json`** - Colección completa con todos los endpoints
- **`Flutter-Dating-Development.postman_environment.json`** - Variables de entorno para desarrollo

## 🔧 Configuración

### 1. Importar en Postman

1. Abre Postman
2. Click en **"Import"**
3. Arrastra los archivos `.json` o selecciónalos
4. Los archivos se importarán automáticamente

### 2. Configurar Environment

1. En Postman, selecciona el environment **"Flutter Dating - Development"**
2. Verifica que `base_url` esté configurada como `http://localhost:8080/api`

## 📋 Orden de Ejecución Recomendado

### 🔐 **1. Authentication**
```
1. Register User (opcional - crear nuevo usuario)
2. Login User (usar credenciales del seed)
3. Verify Token (verificar autenticación)
```

### 👤 **2. Users**
```
4. Get My Profile
5. Get Potential Matches
6. Update My Profile (opcional)
7. Get User Profile by ID
```

### 💕 **3. Swipes**
```
8. Like User
9. Dislike User  
10. Get My Swipes
```

### 🎯 **4. Matches**
```
11. Get All Matches
12. Get Match Details
13. Unmatch User (opcional)
```

### 💬 **5. Messages**
```
14. Send Message
15. Get Messages from Match
16. Mark Messages as Read
17. Get Recent Conversations
```

### 🔧 **6. System**
```
18. Health Check
```

## 🔑 Credenciales de Prueba

### Usuarios del Seed (contraseña: `123456`)
- `maria_garcia` / `maria@test.com`
- `carlos_lopez` / `carlos@test.com`
- `ana_rodriguez` / `ana@test.com`
- `david_martinez` / `david@test.com`
- `sofia_hernandez` / `sofia@test.com`

## ✨ Características Especiales

### 🔄 **Auto-Token Management**
- Los endpoints de **Login** y **Register** automáticamente guardan el JWT token
- El token se usa automáticamente en requests posteriores
- Variable `{{jwt_token}}` se actualiza automáticamente

### 🧪 **Tests Automáticos**
Cada request incluye tests que verifican:
- ✅ Status codes correctos
- ✅ Estructura de respuesta
- ✅ Propiedades requeridas
- ✅ Tipos de datos

### 📊 **Variables Dinámicas**
- `{{base_url}}` - URL base de la API
- `{{jwt_token}}` - Token JWT (auto-gestionado)
- `{{user_id}}` - ID del usuario actual
- `{{match_id}}` - ID de match para testing

## 🏃‍♂️ Flujo de Testing Completo

### Scenario 1: Nuevo Usuario
```
1. Register User (con datos nuevos)
2. Get Potential Matches
3. Like User (varios usuarios)
4. Get All Matches
5. Send Message (si hay matches)
```

### Scenario 2: Usuario Existente
```
1. Login User (maria_garcia)
2. Get All Matches (debería tener 1 match)
3. Get Messages from Match (ver conversación)
4. Send Message (continuar chat)
5. Get Recent Conversations
```

## 🐛 Troubleshooting

### CORS Issues
Si ves errores de CORS, asegúrate de que el servidor esté ejecutándose:
```bash
npm run dev
```

### Authentication Issues
1. Ejecuta **Login** primero
2. Verifica que `{{jwt_token}}` tenga valor
3. Usa **Verify Token** para confirmar autenticación

### Database Issues
Si no hay datos, ejecuta el seed:
```bash
npm run db:seed
```

## 📈 Tests Coverage

La colección incluye tests para:

- ✅ **Authentication** (3 endpoints)
- ✅ **User Management** (4 endpoints) 
- ✅ **Swipe System** (3 endpoints)
- ✅ **Match System** (3 endpoints)
- ✅ **Messaging** (4 endpoints)
- ✅ **Health Check** (1 endpoint)

**Total: 18 endpoints con tests automáticos** 🎉

## 🔗 Links Útiles

- **Health Check**: http://localhost:8080/health
- **API Base**: http://localhost:8080/api
- **Prisma Studio**: `npm run db:studio`

¡Happy Testing! 🚀