# Diagrama MER Gráfico - App de Citas Flutter

## Diagrama Entidad-Relación Visual

```
                                    ┌─────────────────────────────────────┐
                                    │              USERS                  │
                                    │─────────────────────────────────────│
                                    │ 🔑 id (INT) PK                     │
                                    │ 🔒 username (VARCHAR) UNIQUE        │
                                    │ 🔒 email (VARCHAR) UNIQUE           │
                                    │   password_hash (VARCHAR)           │
                                    │   name (VARCHAR)                    │
                                    │   age (INT) NULL                    │
                                    │   photo_url (VARCHAR) NULL          │
                                    │   interests (VARCHAR) NULL          │
                                    │   created_at (DATETIME)             │
                                    │   updated_at (DATETIME)             │
                                    └─────────────┬───────────────────────┘
                                                  │
                           ┌──────────────────────┼──────────────────────┐
                           │                      │                      │
                           │                      │                      │
                           ▼                      ▼                      ▼
                  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
                  │     SWIPES      │    │     MATCHES     │    │    MESSAGES     │
                  │─────────────────│    │─────────────────│    │─────────────────│
                  │ 🔑 id (INT) PK  │    │ 🔑 id (INT) PK  │    │ 🔑 id (INT) PK  │
                  │ 🔗 user_id (FK) │    │ 🔗 user1_id(FK) │    │ 🔗 match_id(FK) │
                  │ 🔗 target_id(FK)│    │ 🔗 user2_id(FK) │    │ 🔗 sender_id(FK)│
                  │   is_like (BOOL)│    │   created_at    │    │ 🔗 receiver_id  │
                  │   created_at    │    │     (DATETIME)  │    │   content (TEXT)│
                  │     (DATETIME)  │    └─────────┬───────┘    │   created_at    │
                  └─────────────────┘              │            │     (DATETIME)  │
                           ▲                       │            │   read_at       │
                           │                       │            │   (DATETIME)    │
                           │                       ▼            └─────────────────┘
                           │              ┌─────────────────┐            ▲
                           │              │    MESSAGES     │            │
                           │              │   (Relacionada) │            │
                           │              │─────────────────│            │
                           │              │ Cada match puede│            │
                           │              │ tener múltiples │            │
                           │              │    mensajes     │            │
                           │              └─────────────────┘            │
                           │                                             │
                           └─────────────────────────────────────────────┘
```

## Relaciones Detalladas con Cardinalidades

### 1️⃣ USER → SWIPE (Relación: Hace/Recibe)
```
    USERS                           SWIPES
┌─────────────┐    1        N   ┌─────────────┐
│             │───────────────→│             │
│ id (PK)     │                │ user_id(FK) │
│             │                │             │
│             │    1        N  │             │
│             │───────────────→│ target_id   │
│             │                │    (FK)     │
└─────────────┘                └─────────────┘
   Cardinalidad: 1:N (Un usuario puede hacer muchos swipes)
   Cardinalidad: 1:N (Un usuario puede recibir muchos swipes)
```

### 2️⃣ USER → MATCH (Relación: Participa en)
```
    USERS                           MATCHES
┌─────────────┐    1        N   ┌─────────────┐
│             │───────────────→│             │
│ id (PK)     │                │ user1_id(FK)│
│             │                │             │
│             │    1        N  │             │
│             │───────────────→│ user2_id(FK)│
│             │                │             │
└─────────────┘                └─────────────┘
   Cardinalidad: N:M (Muchos usuarios pueden tener muchos matches)
```

### 3️⃣ MATCH → MESSAGE (Relación: Contiene)
```
    MATCHES                         MESSAGES
┌─────────────┐    1        N   ┌─────────────┐
│             │───────────────→│             │
│ id (PK)     │                │ match_id(FK)│
│             │                │             │
└─────────────┘                └─────────────┘
   Cardinalidad: 1:N (Un match puede tener muchos mensajes)
```

### 4️⃣ USER → MESSAGE (Relación: Envía/Recibe)
```
    USERS                           MESSAGES
┌─────────────┐    1        N   ┌─────────────┐
│             │───────────────→│             │
│ id (PK)     │                │ sender_id   │
│             │                │    (FK)     │
│             │    1        N  │             │
│             │───────────────→│ receiver_id │
│             │                │    (FK)     │
└─────────────┘                └─────────────┘
   Cardinalidad: 1:N (Un usuario puede enviar muchos mensajes)
   Cardinalidad: 1:N (Un usuario puede recibir muchos mensajes)
```

## Diagrama de Flujo de Datos

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   REGISTRO  │ → │   SWIPES    │ → │   MATCHES   │ → │  MENSAJES   │
│             │    │             │    │             │    │             │
│ Usuario se  │    │ Usuario ve  │    │ Like mutuo  │    │ Usuarios    │
│ registra en │    │ perfiles y  │    │ crea un     │    │ con match   │
│ la app      │    │ hace swipe  │    │ match       │    │ chatean     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   Tabla USERS        Tabla SWIPES       Tabla MATCHES      Tabla MESSAGES
```

## Diagrama de Chen (Entidad-Relación Clásico)

```
                                ┌─────────────┐
                                │    USERS    │
                                │   (ENTITY)  │
                                └──────┬──────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                │                      │                      │
                ▼                      ▼                      ▼
        ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
        │     HACE      │      │  PARTICIPA    │      │    ENVÍA      │
        │ (RELACIÓN)    │      │ (RELACIÓN)    │      │ (RELACIÓN)    │
        └───────┬───────┘      └───────┬───────┘      └───────┬───────┘
                │                      │                      │
                ▼                      ▼                      ▼
        ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
        │    SWIPES     │      │    MATCHES    │      │   MESSAGES    │
        │   (ENTITY)    │      │   (ENTITY)    │◄─────┤   (ENTITY)    │
        └───────────────┘      └───────────────┘      └───────────────┘
                                       │
                                       │
                                ┌──────────────┐
                                │   CONTIENE   │
                                │ (RELACIÓN)   │
                                └──────────────┘
```

## Leyenda de Símbolos

- 🔑 **PK** = Primary Key (Clave Primaria)
- 🔗 **FK** = Foreign Key (Clave Foránea) 
- 🔒 **UNIQUE** = Restricción de Unicidad
- **1:N** = Uno a Muchos
- **N:M** = Muchos a Muchos
- **NULL** = Permite valores nulos

## Restricciones y Validaciones

```
╔══════════════════════════════════════════════════════════════════╗
║                          RESTRICCIONES                          ║
╠══════════════════════════════════════════════════════════════════╣
║ • users.username = UNIQUE (No puede repetirse)                  ║
║ • users.email = UNIQUE (No puede repetirse)                     ║
║ • swipes(user_id, target_id) = UNIQUE (Un swipe por par)        ║
║ • matches(user1_id, user2_id) = UNIQUE (Un match por par)       ║
║ • user_id ≠ target_id (No puede hacer swipe a sí mismo)         ║
║ • messages solo entre usuarios con match                        ║
╚══════════════════════════════════════════════════════════════════╝
```