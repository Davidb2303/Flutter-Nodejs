# Documentación del Proyecto: App de Citas

Este documento unifica la propuesta del proyecto y la documentación técnica del mismo.

---

## Propuesta del Proyecto

**Fundación Universitaria de Colombia**  
*Programa de Ingeniería en Desarrollo de Software*  
**Estudiantes:** David Alejandro Ballesteros Padilla, Darian Jose Molina Negrete  
**Fecha:** 24 de Septiembre de 2025

### 1. Introducción
El presente documento propone el desarrollo de una aplicación móvil de citas, creada con Flutter y conectada a una base de datos. El propósito es diseñar un prototipo académico que permita demostrar el manejo de tecnologías móviles y almacenamiento de datos, implementando funcionalidades básicas de interacción entre usuarios.

### 2. Objetivo General
Diseñar y desarrollar una aplicación móvil de citas utilizando Flutter y una base de datos, con funcionalidades esenciales de registro, perfiles y coincidencias.

### 3. Objetivos Específicos
*   Implementar un sistema de registro y autenticación de usuarios.
*   Diseñar perfiles con información básica (foto, nombre, edad, intereses).
*   Permitir interacción entre usuarios mediante “like” o “rechazo”.
*   Generar coincidencias (match) cuando el interés es mutuo.
*   Conectar la aplicación a una base de datos para la persistencia de información.

### 4. Requerimientos Funcionales
- **Registro de usuarios:** El sistema debe permitir a los usuarios registrarse con un nombre de usuario, contraseña, foto, nombre completo, edad e intereses.
- **Autenticación:** Los usuarios deben poder iniciar sesión con su nombre de usuario y contraseña previamente registrados.
- **Gestión de perfiles:** Los usuarios deben poder editar su perfil (foto, nombre, intereses, etc.).
- **Sistema de Likes/Dislikes:** Los usuarios pueden explorar otros perfiles y dar "like" o "dislike" a otros usuarios.
- **Coincidencias (Matches):** Cuando dos usuarios se den "like" mutuamente, se debe generar una coincidencia.
- **Almacenamiento de datos:** Los datos de los usuarios, likes, dislikes y matches se deben guardar en una base de datos.

### 5. Requerimientos No Funcionales
- **Rendimiento:** La aplicación debe responder de manera eficiente, con tiempos de carga inferiores a 2 segundos.
- **Escalabilidad:** El sistema debe ser escalable para permitir el crecimiento en la cantidad de usuarios.
- **Seguridad:** Las contraseñas deben estar cifradas (hashing) y los datos protegidos contra accesos no autorizados.
- **Compatibilidad:** La aplicación debe ser compatible con dispositivos Android e iOS.
- **Usabilidad:** La interfaz debe ser intuitiva y fácil de usar.
- **Disponibilidad:** La app debe tener una tasa de disponibilidad superior al 99%.

### 6. Alcance del Proyecto
El proyecto abarcará:
- Interfaz en Flutter.
- Login y registro de usuarios.
- Gestión de perfiles.
- Visualización de usuarios con sistema de likes.
- Registro de coincidencias (matches).
- Base de datos para usuarios, likes y matches.

### 7. Diagramas
A continuación se presentan los enlaces y marcadores para los diagramas del proyecto.

*   **7.1 Diagrama de Secuencia de Actividades:** [Ver en Miro](https://miro.com/welcomeonboard/TGhTd1YzWHhDSmNiODFiVHdVRWhsT0NSZDQveGYxSUdybGVISzVKeEo2alFCODV2a3hRdXRHeU1DUzRROHVnS2RpbGsxYTBEVVJ2TWU1aTF4d0Zld2VJQ0FGaWc5TzE2ZlVic3RjYVhNOVFsVEFNbHJnOEZVMjUvVy91NE9BMXZBd044SHFHaVlWYWk0d3NxeHNmeG9BPT0hdjE=?share_link_id=751280811349)
*   **7.2 Diagrama Entidad Relación:** `[IMAGEN: Inserte aquí el Diagrama Entidad Relación]`
*   **7.3 Caso de Uso:** `[IMAGEN: Inserte aquí el Diagrama de Caso de Uso]`
*   **7.4 Diagrama de Secuencia:** `[IMAGEN: Inserte aquí el Diagrama de Secuencia]`
*   **7.5 Diagrama de Actividades:** `[IMAGEN: Inserte aquí el Diagrama de Actividades]`

### 8. Herramientas a Utilizar
- **Frontend:** Flutter
- **Backend:** Node.js con Express.js
- **Base de datos:** PostgreSQL (manejado con Prisma ORM)
- **Control de versiones:** GitHub

### 9. Cronograma de Actividades
| Semana  | Fechas              | Actividades                                                                                             |
|---------|---------------------|---------------------------------------------------------------------------------------------------------|
| Semana 1| 23 – 27 septiembre  | Definición de requerimientos, Diseño de interfaz, Configuración inicial en Flutter y base de datos.     |
| Semana 2| 28 – 2 octubre      | Implementar registro/login, Vista de perfil, Sistema de exploración, Lógica de coincidencias, Pruebas. |

### 10. Producto Esperado
Una aplicación móvil en Flutter que permita a los usuarios registrarse, crear un perfil, visualizar otros perfiles, dar “like” o “rechazar”, y generar coincidencias, almacenando toda la información en una base de datos.

### 11. Conclusiones
El desarrollo de esta aplicación permitirá aplicar de manera práctica los conocimientos en programación móvil, gestión de bases de datos y diseño de interfaces. La propuesta no solo servirá como evidencia de competencias técnicas, sino también como una experiencia formativa integral que refuerza la capacidad de diseñar, implementar y documentar soluciones tecnológicas completas.

---

## Documentación Técnica del Proyecto

### Arquitectura General
El proyecto sigue una arquitectura cliente-servidor:
-   **Frontend:** Una aplicación móvil desarrollada en Flutter, ubicada en el directorio `/front`.
-   **Backend:** Una API RESTful desarrollada con Node.js y Express, ubicada en el directorio `/src`.
-   **Base de Datos:** Un esquema de base de datos PostgreSQL gestionado por el ORM Prisma, definido en `/prisma`.

### Backend (Node.js)
El servidor se encarga de toda la lógica de negocio, autenticación y comunicación con la base de datos.

-   **Ubicación:** `C:\Users\Alejito\Desktop\BackNodejs\src`
-   **Estructura:**
    -   `controllers/`: Lógica para manejar las peticiones (requests).
    -   `middleware/`: Funciones intermedias, como la autenticación (`auth.js`).
    -   `routes/`: Definición de las rutas de la API.
    -   `server.js`: Archivo principal que inicia el servidor Express.
-   **API Endpoints:** Las rutas están definidas en la carpeta `routes` para entidades como `auth`, `users`, `swipes`, `matches` y `messages`.

### Frontend (Flutter)
La aplicación móvil construida con Flutter para Android, iOS y Web.

-   **Ubicación:** `C:\Users\Alejito\Desktop\BackNodejs\front`
-   **Estructura Clave (`/lib`):**
    -   `main.dart`: Punto de entrada de la aplicación.
    -   `models/`: Clases que modelan los datos (User, Match, Message).
    -   `screens/`: Widgets que representan cada pantalla de la app (Login, Home, Profile, etc.).
    -   `services/`: Lógica para comunicarse con la API del backend (`api_service.dart`).

### Base de Datos (Prisma y PostgreSQL)
Se utiliza Prisma como ORM para interactuar con una base de datos PostgreSQL.

-   **Schema:** La definición de los modelos de datos se encuentra en `C:\Users\Alejito\Desktop\BackNodejs\prisma\schema.prisma`.
-   **Seeding:** Hay un script de inicialización de datos en `C:\Users\Alejito\Desktop\BackNodejs\prisma\seeds\seed.js`.
-   **Modelos SQL (según propuesta):**
    ```sql
    -- Tabla de Usuarios
    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        photo_url VARCHAR(255),
        name VARCHAR(100) NOT NULL,
        age INT,
        interests TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Tabla de Likes/Dislikes
    CREATE TABLE likes (
        like_id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        target_user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        status VARCHAR(10) CHECK (status IN ('like', 'dislike')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, target_user_id)
    );

    -- Tabla de Matches
    CREATE TABLE matches (
        match_id SERIAL PRIMARY KEY,
        user1_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        user2_id INT REFERENCES users(user_id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ```

### Pruebas de API (Postman)
El proyecto incluye una colección de Postman para probar los endpoints de la API.
-   **Ubicación:** `C:\Users\Alejito\Desktop\BackNodejs\postman`
-   **Archivos:**
    -   `Flutter-Dating-API.postman_collection.json`: La colección de requests.
    -   `Flutter-Dating-Development.postman_environment.json`: El entorno de desarrollo con las variables.

### Cómo Levantar el Proyecto

**1. Backend:**
   - Abre una terminal en la raíz del proyecto (`C:\Users\Alejito\Desktop\BackNodejs`).
   - Instala las dependencias: `npm install`
   - Copia el archivo `.env.example` a `.env` y configura la variable `DATABASE_URL` con tu cadena de conexión a PostgreSQL.
   - Aplica las migraciones de la base de datos: `npx prisma migrate dev`
   - (Opcional) Puebla la base de datos con datos de prueba: `npx prisma db seed`
   - Inicia el servidor: `npm start`

**2. Frontend:**
   - Abre otra terminal y navega al directorio del frontend: `cd front`
   - Obtén las dependencias de Flutter: `flutter pub get`
   - Asegúrate de tener un emulador corriendo o un dispositivo conectado.
   - Ejecuta la aplicación: `flutter run`

---
### Ficha Técnica Resumida
-   **Nombre del proyecto:** App de Citas
-   **Tecnologías:** Flutter, Node.js, Express, PostgreSQL, Prisma, GitHub
-   **Objetivo General:** Crear una app de citas con funcionalidades básicas de registro, perfiles y coincidencias.
-   **Funcionalidades:**
    *   Registro/Login
    *   Perfiles con foto, nombre, edad, intereses
    *   Explorar usuarios (like/rechazo)
    *   Generación de matches
-   **Producto Final:** Prototipo funcional de aplicación móvil conectada a base de datos.
