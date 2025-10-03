# Diagrama MER - App de Citas Flutter

## Entidades y Atributos

### USERS (users)
```
┌─────────────────────────────────┐
│             USERS               │
├─────────────────────────────────┤
│ 🔑 id (PK)         │ INT        │
│ 🔑 username (UK)   │ VARCHAR    │
│ 🔑 email (UK)      │ VARCHAR    │
│   password_hash    │ VARCHAR    │
│   name             │ VARCHAR    │
│   age              │ INT        │
│   photo_url        │ VARCHAR    │
│   interests        │ VARCHAR    │
│   created_at       │ DATETIME   │
│   updated_at       │ DATETIME   │
└─────────────────────────────────┘
```

### SWIPES (swipes)
```
┌─────────────────────────────────┐
│             SWIPES              │
├─────────────────────────────────┤
│ 🔑 id (PK)         │ INT        │
│ 🔗 user_id (FK)    │ INT        │
│ 🔗 target_id (FK)  │ INT        │
│   is_like          │ BOOLEAN    │
│   created_at       │ DATETIME   │
└─────────────────────────────────┘
```

### MATCHES (matches)
```
┌─────────────────────────────────┐
│             MATCHES             │
├─────────────────────────────────┤
│ 🔑 id (PK)         │ INT        │
│ 🔗 user1_id (FK)   │ INT        │
│ 🔗 user2_id (FK)   │ INT        │
│   created_at       │ DATETIME   │
└─────────────────────────────────┘
```

### MESSAGES (messages)
```
┌─────────────────────────────────┐
│            MESSAGES             │
├─────────────────────────────────┤
│ 🔑 id (PK)         │ INT        │
│ 🔗 match_id (FK)   │ INT        │
│ 🔗 sender_id (FK)  │ INT        │
│ 🔗 receiver_id (FK)│ INT        │
│   content          │ TEXT       │
│   created_at       │ DATETIME   │
│   read_at          │ DATETIME   │
└─────────────────────────────────┘
```

## Relaciones

### 1. USER ↔ SWIPE (1:N)
- **Un usuario puede hacer muchos swipes** (sentSwipes)
- **Un usuario puede recibir muchos swipes** (receivedSwipes)
- **Cardinalidad**: 1:N (Un usuario : Muchos swipes)

```
USERS ──────────── SWIPES
  │                  │
  │ user_id          │
  └──────────────────┘
  
USERS ──────────── SWIPES
  │                  │
  │ target_id        │
  └──────────────────┘
```

### 2. USER ↔ MATCH (N:M)
- **Un usuario puede tener muchos matches**
- **Un match involucra a dos usuarios**
- **Cardinalidad**: N:M (Muchos usuarios : Muchos matches)

```
USERS ──────────── MATCHES
  │                  │
  │ user1_id         │
  └──────────────────┘
  
USERS ──────────── MATCHES
  │                  │
  │ user2_id         │
  └──────────────────┘
```

### 3. MATCH ↔ MESSAGE (1:N)
- **Un match puede tener muchos mensajes**
- **Un mensaje pertenece a un solo match**
- **Cardinalidad**: 1:N (Un match : Muchos mensajes)

```
MATCHES ─────────── MESSAGES
   │                   │
   │ match_id          │
   └───────────────────┘
```

### 4. USER ↔ MESSAGE (1:N)
- **Un usuario puede enviar muchos mensajes** (sender)
- **Un usuario puede recibir muchos mensajes** (receiver)
- **Cardinalidad**: 1:N (Un usuario : Muchos mensajes)

```
USERS ──────────── MESSAGES
  │                  │
  │ sender_id        │
  └──────────────────┘
  
USERS ──────────── MESSAGES
  │                  │
  │ receiver_id      │
  └──────────────────┘
```

## Diagrama Visual Completo

```
              ┌─────────────┐
              │    USERS    │
              │ (id, email, │
              │  username)  │
              └─────┬───────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ SWIPES  │ │ MATCHES │ │MESSAGES │
  │(user_id,│ │(user1_id│ │(sender_ │
  │target_id│ │user2_id)│ │id,recv_ │
  │is_like) │ │         │ │er_id)   │
  └─────────┘ └────┬────┘ └─────────┘
                   │
                   ▼
             ┌─────────┐
             │MESSAGES │
             │(match_id│
             │content) │
             └─────────┘
```

## Restricciones y Reglas de Negocio

### Restricciones de Unicidad:
- `users.username` - UNIQUE
- `users.email` - UNIQUE
- `swipes(user_id, target_id)` - UNIQUE (Un usuario solo puede hacer swipe una vez a otro)
- `matches(user1_id, user2_id)` - UNIQUE (Solo puede existir un match entre dos usuarios)

### Reglas de Negocio:
1. **Swipe**: Un usuario no puede hacer swipe a sí mismo
2. **Match**: Se crea automáticamente cuando dos usuarios se dan "like" mutuamente
3. **Message**: Solo se pueden enviar mensajes entre usuarios que tienen match
4. **User**: El username y email deben ser únicos en el sistema

### Flujo de la Aplicación:
1. Usuario se registra → Se crea registro en `USERS`
2. Usuario ve perfiles → Hace swipe → Se registra en `SWIPES`
3. Si hay like mutuo → Se crea `MATCH`
4. Usuarios con match → Pueden intercambiar `MESSAGES`

## Índices Recomendados:
- `users(email)` - Para login
- `users(username)` - Para búsquedas
- `swipes(user_id)` - Para obtener swipes de usuario
- `swipes(target_id)` - Para obtener swipes recibidos
- `matches(user1_id, user2_id)` - Para verificar matches
- `messages(match_id)` - Para obtener mensajes de una conversación
- `messages(created_at)` - Para ordenar mensajes por fecha