# Voya API — The In-Ride Concierge

Backend REST API para la plataforma **Voya**, un sistema geolocalizados de recomendaciones basado en QR para conductores de ride-share. Los pasajeros escanean el código QR del conductor, ven las promociones de negocios cercanos, generan un código de validación y lo presentan al establecimiento para obtener su beneficio. El negocio valida el código y el conductor recibe una comisión automáticamente.

---

## Tabla de contenido

- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura del proyecto](#arquitectura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Variables de entorno](#variables-de-entorno)
- [Comandos disponibles](#comandos-disponibles)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Modelos de datos](#modelos-de-datos)
- [API Reference](#api-reference)
  - [Health](#health)
  - [Auth](#auth)
  - [Público (sin autenticación)](#público-sin-autenticación)
  - [Driver (JWT requerido)](#driver-jwt-requerido)
  - [Partner (JWT requerido)](#partner-jwt-requerido)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Seguridad](#seguridad)
- [Transacción atómica de comisiones](#transacción-atómica-de-comisiones)
- [Generación de QR](#generación-de-qr)
- [Tests](#tests)
- [Clientes HTTP (Insomnia / Thunder Client)](#clientes-http-insomnia--thunder-client)
- [Despliegue en Railway](#despliegue-en-railway)
- [Solución de problemas conocidos](#solución-de-problemas-conocidos)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Runtime | Node.js | 24.x |
| Lenguaje | TypeScript (strict, target ES2020, CommonJS) | 5.7 |
| Framework HTTP | Express | 4.21 |
| ODM | Mongoose | 8.9 |
| Base de datos | MongoDB Atlas | M0 (free tier) |
| Autenticación | JSON Web Tokens (`jsonwebtoken`) | 9 |
| Hashing | bcryptjs | 2.4 |
| Generación de QR | qrcode | 1.5 |
| Validación de env | Zod | 3.24 |
| Dev server | tsx watch | 4.19 |
| Tests | Jest + Supertest + mongodb-memory-server | 29 |
| Despliegue | Railway | — |

---

## Arquitectura del proyecto

```
Pasajero escanea QR del conductor
         │
         ▼
GET /api/v1/promos/:driver_qr_id
  → Busca driver por qr_code_id
  → Consulta partners activos en radio GEO_RADIUS_KM (query $near)
  → Retorna promociones activas y vigentes de esos partners
         │
         ▼
POST /api/v1/leads/create
  → Valida promo activa + driver activo
  → Genera código de validación (6 chars hex, criptográfico)
  → Congela commission_amount desde promo.commission_per_lead
  → Crea Lead con status: pending
         │
         ▼  (pasajero presenta código al establecimiento)
         │
POST /api/v1/partners/validate  [JWT partner]
  → Transacción atómica MongoDB:
      1. Encuentra lead pending por código
      2. Verifica que la promo pertenece al partner autenticado
      3. Marca lead → completed
      4. Incrementa driver.balance += commission_amount
      5. Commit / rollback total en caso de error
         │
         ▼
GET /api/v1/driver/dashboard  [JWT driver]
  → Retorna balance, métricas de leads, últimas 10 conversiones
```

---

## Requisitos previos

- **Node.js 24** (usa `.nvmrc` — ejecuta `nvm use` si tienes nvm instalado)
- **npm 10+**
- **MongoDB Atlas** — cluster M0 gratuito válido para el MVP

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd api-voya

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores reales (ver sección siguiente)

# 4. Levantar servidor de desarrollo
npm run dev
```

Deberías ver en consola:

```
✅ Connected to MongoDB
🚀 Server running on port 4000 [development]
```

---

## Variables de entorno

Copia `.env.example` a `.env` y completa cada variable:

```env
# Entorno de ejecución
NODE_ENV=development

# Puerto del servidor
PORT=4000

# Cadena de conexión a MongoDB Atlas
# Formato: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/voya?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/voya?retryWrites=true&w=majority

# Secreto para firmar JWTs — mínimo 32 caracteres, valor aleatorio y seguro
JWT_SECRET=change_this_to_a_random_string_of_at_least_32_characters

# Duración del token (formato: 7d, 24h, 3600s)
JWT_EXPIRES_IN=7d

# URL del frontend — usada en el QR y en la whitelist de CORS
FRONTEND_URL=http://localhost:5173

# Radio de búsqueda geográfica en kilómetros
GEO_RADIUS_KM=5

# Rondas de bcrypt para hashing de contraseñas (12 en prod, 4 en tests para velocidad)
BCRYPT_ROUNDS=12
```

> **Importante:** No uses comillas simples ni dobles alrededor de los valores en `.env`. `dotenv` las incluye literalmente, lo que rompe la validación de Zod.

### Validación al inicio

`src/config/env.ts` usa Zod para validar todas las variables al arrancar. Si alguna es inválida o está ausente, el proceso termina con `process.exit(1)` y muestra los errores específicos en consola.

---

## Comandos disponibles

```bash
# Servidor de desarrollo con hot-reload (tsx watch)
npm run dev

# Compilar TypeScript → dist/
npm run build

# Servidor de producción (requiere npm run build previo)
npm start

# Ejecutar suite de tests (23 tests, in-memory MongoDB)
npm test

# Tests con detalle de cada caso
npm test -- --verbose

# Tests de un archivo específico
npm test -- tests/auth.test.ts
npm test -- tests/leads.test.ts
npm test -- tests/validate.test.ts
```

---

## Estructura de carpetas

```
api-voya/
├── .env                          # Variables de entorno locales (no commitear)
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore
├── .nvmrc                        # Node.js 24.15.0
├── jest.config.js                # Configuración de Jest (CommonJS)
├── package.json
├── tsconfig.json                 # TypeScript para src/ (target ES2020, CommonJS)
├── tsconfig.test.json            # Extiende tsconfig.json + types jest
├── dist/                         # Salida compilada (generada por npm run build)
├── docs/
│   ├── Especificación Técnica MVP - Voya (The In-Ride Concierge).md
│   └── testing-guide.md          # Guía completa de pruebas manuales + seed
├── insomnia/
│   └── voya-insomnia.json        # Colección Insomnia v4 (Local + Railway envs)
├── thunder-client/
│   ├── voya-collection.json      # 11 requests con auto-capture de tokens
│   └── voya-environment.json     # Variables: baseUrl, tokens, ids…
├── src/
│   ├── app.ts                    # Express app, middlewares, rutas, error handler
│   ├── server.ts                 # Bootstrap: connectDB() + app.listen()
│   ├── config/
│   │   ├── db.ts                 # Conexión a MongoDB con DNS override (8.8.8.8)
│   │   └── env.ts                # Validación de env vars con Zod
│   ├── controllers/
│   │   ├── auth.controller.ts    # register, login
│   │   ├── driver.controller.ts  # getDashboard, getQRAssets
│   │   ├── partner.controller.ts # validate
│   │   └── public.controller.ts  # getPromosByDriverQR, createLead
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # Verificación JWT → req.user
│   │   └── roles.middleware.ts   # requireRole(...roles) factory
│   ├── models/
│   │   ├── Driver.ts             # Modelo Mongoose + índice 2dsphere
│   │   ├── Lead.ts               # Modelo Mongoose + índice compuesto
│   │   ├── Partner.ts            # Modelo Mongoose + índice 2dsphere
│   │   └── Promotion.ts          # Modelo Mongoose
│   ├── routes/
│   │   ├── auth.routes.ts        # POST /register, POST /login
│   │   ├── driver.routes.ts      # GET /dashboard, GET /qr-assets
│   │   ├── partner.routes.ts     # POST /validate
│   │   └── public.routes.ts      # GET /promos/:qr_id, POST /leads/create
│   ├── services/
│   │   ├── commission.service.ts # validateLead() — transacción atómica + retry
│   │   └── qr.service.ts         # generateQRBuffer(), buildScanUrl()
│   └── utils/
│       ├── errors.ts             # Clase AppError(message, statusCode)
│       └── generateCode.ts       # generateValidationCode() — 6 chars hex
└── tests/
    ├── jest.env.ts               # Setea process.env antes de importar módulos
    ├── setup.ts                  # MongoMemoryReplSet, connect/disconnect/clear
    ├── auth.test.ts              # 8 tests de autenticación
    ├── leads.test.ts             # 7 tests de leads y promociones
    └── validate.test.ts          # 8 tests de validación de leads
```

---

## Modelos de datos

### Driver

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `name` | String | ✓ | Trim |
| `email` | String | ✓ | Único, lowercase, trim |
| `password` | String | ✓ | `select: false` — no retornado en queries |
| `phone` | String | ✓ | Trim |
| `qr_code_id` | String | — | UUID v4 auto-generado con `crypto.randomUUID()`, único |
| `balance` | Number | — | Default: 0, min: 0 |
| `status` | `active` \| `inactive` | — | Default: `active` |
| `location` | GeoJSON Point | ✓ | `coordinates: [longitud, latitud]` |
| `role` | `driver` | — | Inmutable, default: `driver` |
| `createdAt` / `updatedAt` | Date | — | Timestamps automáticos |

**Índices:** `2dsphere` en `location`, único en `email`, único en `qr_code_id`

---

### Partner

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `business_name` | String | ✓ | Trim |
| `category` | String | ✓ | Trim (ej: `"restaurant"`, `"cafe"`) |
| `email` | String | ✓ | Único, lowercase, trim |
| `password` | String | ✓ | `select: false` |
| `contact_info.phone` | String | — | Opcional |
| `contact_info.website` | String | — | Opcional |
| `contact_info.address` | String | — | Opcional |
| `location` | GeoJSON Point | ✓ | `coordinates: [longitud, latitud]` |
| `status` | `active` \| `inactive` | — | Default: `active` |
| `role` | `partner` | — | Inmutable, default: `partner` |
| `createdAt` / `updatedAt` | Date | — | Timestamps automáticos |

**Índices:** `2dsphere` en `location`, único en `email`

---

### Promotion

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `partner_id` | ObjectId | ✓ | Ref: Partner |
| `title` | String | ✓ | Trim |
| `description` | String | ✓ | Trim |
| `reward_value` | String | ✓ | Descripción del beneficio para el pasajero |
| `commission_per_lead` | Number | ✓ | Min: 0 — se copia al `commission_amount` del Lead |
| `status` | `active` \| `inactive` | — | Default: `active` |
| `valid_from` | Date | ✓ | Inicio de vigencia |
| `valid_until` | Date | ✓ | Fin de vigencia |
| `createdAt` / `updatedAt` | Date | — | Timestamps automáticos |

**Índices:** compuesto `(partner_id, status)`

> **⚠️ MVP:** Las Promotions **no tienen endpoint de creación**. Deben insertarse directamente en MongoDB Atlas. Ver [docs/testing-guide.md](docs/testing-guide.md) para el proceso de seed paso a paso.

---

### Lead

| Campo | Tipo | Requerido | Notas |
|-------|------|-----------|-------|
| `driver_id` | ObjectId | ✓ | Ref: Driver |
| `promo_id` | ObjectId | ✓ | Ref: Promotion |
| `status` | `pending` \| `completed` | — | Default: `pending` |
| `validation_code` | String | ✓ | 6 chars hex mayúsculas, único, criptográfico |
| `commission_amount` | Number | ✓ | Congelado al momento de creación del lead |
| `createdAt` / `updatedAt` | Date | — | Timestamps automáticos |

**Índices:** compuesto `(driver_id, status)`, único en `validation_code`

---

## API Reference

### Health

#### `GET /health`

Sin autenticación. Verifica que el servidor está operativo.

**Respuesta 200:**
```json
{
  "status": "ok",
  "timestamp": "2026-04-23T10:00:00.000Z"
}
```

---

### Auth

Base path: `/api/v1/auth`

#### `POST /api/v1/auth/register`

Registra un nuevo driver o partner. El campo `role` determina qué modelo se crea.

**Body para `role: "driver"`:**
```json
{
  "role": "driver",
  "name": "Carlos López",
  "email": "carlos@voya.com",
  "password": "password123",
  "phone": "+50688887777",
  "location": {
    "type": "Point",
    "coordinates": [-84.0879, 9.9281]
  }
}
```

**Body para `role: "partner"`:**
```json
{
  "role": "partner",
  "business_name": "Café Central",
  "category": "restaurant",
  "email": "cafe@voya.com",
  "password": "password123",
  "contact_info": {
    "phone": "+50622223333",
    "address": "Av. Central 123, San José",
    "website": "https://cafecentral.com"
  },
  "location": {
    "type": "Point",
    "coordinates": [-84.0879, 9.9281]
  }
}
```

> ⚠️ Coordenadas en formato GeoJSON estándar: `[longitud, latitud]`. La longitud va primero, al revés de Google Maps.

**Respuesta 201:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "680000000000000000000001",
    "name": "Carlos López",
    "email": "carlos@voya.com",
    "phone": "+50688887777",
    "qr_code_id": "550e8400-e29b-41d4-a716-446655440000",
    "balance": 0,
    "status": "active",
    "role": "driver",
    "location": { "type": "Point", "coordinates": [-84.0879, 9.9281] }
  }
}
```

| Código | Motivo |
|--------|--------|
| 400 | `role` inválido (solo `driver` o `partner`) |
| 400 | `password` con menos de 8 caracteres |
| 400 | Campo requerido faltante (validación Mongoose) |
| 409 | Email ya registrado |

---

#### `POST /api/v1/auth/login`

Autentica un usuario existente y retorna un JWT fresco.

**Body:**
```json
{
  "role": "driver",
  "email": "carlos@voya.com",
  "password": "password123"
}
```

**Respuesta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "680000000000000000000001",
    "name": "Carlos López",
    "email": "carlos@voya.com",
    "role": "driver"
  }
}
```

| Código | Motivo |
|--------|--------|
| 400 | Faltan `email`, `password` o `role` |
| 400 | `role` inválido |
| 401 | Email no registrado o password incorrecto |

---

### Público (sin autenticación)

#### `GET /api/v1/promos/:driver_qr_id`

Retorna las promociones activas y vigentes de partners cercanos al driver. Este es el endpoint que consume el frontend cuando el pasajero escanea el QR.

**Parámetro de ruta:** `driver_qr_id` — el valor del campo `qr_code_id` del driver (UUID).

**Lógica interna:**
1. Busca el driver por `qr_code_id` con `status: active`.
2. Consulta partners activos dentro de `GEO_RADIUS_KM` km usando `$near` con índice `2dsphere`.
3. Filtra promociones con `status: active`, `valid_from <= ahora <= valid_until`.
4. Popula `partner_id` con `business_name`, `category`, `location`, `contact_info`.

**Respuesta 200:**
```json
{
  "driver_id": "680000000000000000000001",
  "promos": [
    {
      "_id": "680000000000000000000003",
      "partner_id": {
        "_id": "680000000000000000000002",
        "business_name": "Café Central",
        "category": "restaurant",
        "location": { "type": "Point", "coordinates": [-84.0879, 9.9281] },
        "contact_info": {
          "phone": "+50622223333",
          "address": "Av. Central 123, San José",
          "website": "https://cafecentral.com"
        }
      },
      "title": "10% de descuento en tu próxima visita",
      "description": "Presenta este código al cajero para obtener tu descuento",
      "reward_value": "10% off en consumo total",
      "commission_per_lead": 5,
      "status": "active",
      "valid_from": "2026-01-01T00:00:00.000Z",
      "valid_until": "2026-12-31T23:59:59.000Z"
    }
  ]
}
```

Si no hay partners en el radio o no hay promos vigentes, retorna `promos: []`.

| Código | Motivo |
|--------|--------|
| 404 | Driver no encontrado o con `status: inactive` |

---

#### `POST /api/v1/leads/create`

Crea un lead cuando el pasajero elige una promoción. No requiere autenticación.

**Body:**
```json
{
  "driver_id": "680000000000000000000001",
  "promo_id": "680000000000000000000003"
}
```

**Respuesta 201:**
```json
{
  "lead": {
    "_id": "680000000000000000000004",
    "driver_id": "680000000000000000000001",
    "promo_id": "680000000000000000000003",
    "status": "pending",
    "validation_code": "A1B2C3",
    "commission_amount": 5,
    "createdAt": "2026-04-23T10:00:00.000Z",
    "updatedAt": "2026-04-23T10:00:00.000Z"
  }
}
```

**Detalles importantes:**
- `validation_code` — 6 caracteres hexadecimales en mayúscula generados con `crypto.randomBytes(3)`. Se garantiza unicidad con hasta 10 intentos de colisión.
- `commission_amount` — se congela copiando `promo.commission_per_lead` en el momento de creación del lead. Cambios futuros a la promo no afectan leads ya creados.

| Código | Motivo |
|--------|--------|
| 400 | Faltan `driver_id` o `promo_id` |
| 404 | Promo no encontrada, con `status: inactive` o fuera de fechas de vigencia |
| 404 | Driver no encontrado o con `status: inactive` |

---

### Driver (JWT requerido)

Todas las rutas bajo `/api/v1/driver` requieren:
```
Authorization: Bearer <driverToken>
```

El JWT debe tener `role: "driver"` en su payload. Un token de partner retorna **403 Forbidden**.

---

#### `GET /api/v1/driver/dashboard`

Retorna las métricas del driver autenticado.

**Respuesta 200:**
```json
{
  "balance": 25,
  "total_leads": 5,
  "completed_leads": 4,
  "pending_leads": 1,
  "recent_conversions": [
    {
      "_id": "680000000000000000000004",
      "promo_id": {
        "_id": "680000000000000000000003",
        "title": "10% de descuento en tu próxima visita",
        "reward_value": "10% off en consumo total"
      },
      "status": "completed",
      "validation_code": "A1B2C3",
      "commission_amount": 5
    }
  ]
}
```

`recent_conversions` contiene los últimos 10 leads con `status: completed`, ordenados por `updatedAt` descendente, con `promo_id` populado mostrando solo `title` y `reward_value`.

| Código | Motivo |
|--------|--------|
| 401 | Token ausente, malformado o expirado |
| 403 | Token con `role: partner` |
| 404 | Driver no encontrado |

---

#### `GET /api/v1/driver/qr-assets`

Retorna el código QR del driver como imagen PNG o como URL JSON.

**Sin query params → imagen PNG:**

Respuesta `200`:
- `Content-Type: image/png`
- Imagen de 400×400 px
- `Content-Disposition: attachment; filename="qr-<uuid>.png"`

**Con `?format=url` → JSON:**

Respuesta `200`:
```json
{
  "url": "http://localhost:5173/scan/550e8400-e29b-41d4-a716-446655440000",
  "qr_code_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

La URL apunta a `{FRONTEND_URL}/scan/{qr_code_id}`.

| Código | Motivo |
|--------|--------|
| 401 | Token ausente, malformado o expirado |
| 403 | Token con `role: partner` |
| 404 | Driver no encontrado |

---

### Partner (JWT requerido)

Todas las rutas bajo `/api/v1/partners` requieren:
```
Authorization: Bearer <partnerToken>
```

El JWT debe tener `role: "partner"`. Un token de driver retorna **403 Forbidden**.

---

#### `POST /api/v1/partners/validate`

Valida un lead por código de validación. Marca el lead como completado y acredita la comisión al conductor en una sola transacción atómica.

**Body:**
```json
{
  "validation_code": "A1B2C3"
}
```

> El servidor normaliza el código a mayúsculas automáticamente. `"a1b2c3"` y `"A1B2C3"` son equivalentes.

**Respuesta 200:**
```json
{
  "message": "Lead validated successfully",
  "lead": {
    "_id": "680000000000000000000004",
    "driver_id": "680000000000000000000001",
    "promo_id": "680000000000000000000003",
    "status": "completed",
    "validation_code": "A1B2C3",
    "commission_amount": 5,
    "createdAt": "2026-04-23T10:00:00.000Z",
    "updatedAt": "2026-04-23T10:05:00.000Z"
  }
}
```

| Código | Motivo |
|--------|--------|
| 400 | `validation_code` ausente |
| 400 | Código inválido o ya utilizado (`status: completed`) |
| 401 | Token ausente, malformado o expirado |
| 403 | Token con `role: driver` |
| 403 | El código no pertenece a una promoción de este partner |
| 409 | Conflicto de validación concurrente |

---

## Autenticación y autorización

### Flujo JWT

1. El cliente llama a `/api/v1/auth/register` o `/api/v1/auth/login`.
2. El servidor firma un JWT con payload `{ sub: userId, role: 'driver'|'partner' }` y expiración `JWT_EXPIRES_IN` (default: 7 días).
3. El cliente incluye el token en cada request protegido:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### `auth.middleware.ts`

- Extrae el token del header `Authorization: Bearer <token>`.
- Verifica la firma con `jwt.verify(token, env.JWT_SECRET)`.
- Adjunta el payload decodificado a `req.user: { sub: string, role: 'driver'|'partner' }`.
- Retorna `401` si el token falta, está malformado o expiró.

### `roles.middleware.ts`

Factory `requireRole(...roles)` que verifica `req.user.role`:
- `requireRole('driver')` — solo permite `role: driver`, retorna `403` si no coincide.
- `requireRole('partner')` — solo permite `role: partner`, retorna `403` si no coincide.

---

## Seguridad

| Medida | Implementación |
|--------|----------------|
| Headers HTTP seguros | `helmet()` — configura CSP, X-Frame-Options, HSTS, etc. |
| CORS restringido | Whitelist: `FRONTEND_URL` + `localhost:5173`/`3000` en development |
| Límite de payload | `express.json({ limit: '10kb' })` — previene ataques de payload grande |
| Sanitización MongoDB | `express-mongo-sanitize` — elimina operadores `$` y `.` del body |
| Hashing de contraseñas | `bcryptjs` con `BCRYPT_ROUNDS=12` en producción |
| Secreto JWT | Mínimo 32 caracteres, validado por Zod al inicio |
| Códigos de validación | `crypto.randomBytes(3)` — criptográficamente seguros |
| DNS público forzado | `setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])` antes de conectar a Atlas |

---

## Transacción atómica de comisiones

`src/services/commission.service.ts` implementa la validación de leads con una **transacción MongoDB** que garantiza atomicidad total:

```
session.startTransaction()
  │
  ├── 1. Lead.findOne({ validation_code, status: 'pending' })
  │        └─ AppError(400) si no existe o ya fue completado
  │
  ├── 2. Promotion.findOne({ _id: lead.promo_id, partner_id })
  │        └─ AppError(403) si el código no pertenece a este partner
  │
  ├── 3. Lead.findOneAndUpdate(pending → completed)
  │        └─ AppError(409) si fue completado concurrentemente
  │
  ├── 4. Driver.updateOne({ $inc: { balance: commission_amount } })
  │
  └── session.commitTransaction()
        └─ session.abortTransaction() si cualquier paso falla
```

**Retry automático:** Si MongoDB retorna un `TransientTransactionError` (conflicto de escritura en el catálogo, común en replica sets de prueba), el servicio reintenta la transacción completa hasta **3 veces** antes de propagar el error.

---

## Generación de QR

`src/services/qr.service.ts` expone dos funciones:

- **`generateQRBuffer(qr_code_id: string): Promise<Buffer>`**  
  Genera un `Buffer` PNG de 400×400 px con 2 px de margen, apuntando a `{FRONTEND_URL}/scan/{qr_code_id}`.

- **`buildScanUrl(qr_code_id: string): string`**  
  Retorna solo la URL sin generar la imagen: `${FRONTEND_URL}/scan/${qr_code_id}`.

El `qr_code_id` de cada driver es un UUID v4 generado con `crypto.randomUUID()` al momento del registro y almacenado con `unique: true` en MongoDB.

---

## Tests

La suite usa `mongodb-memory-server` con un **ReplicaSet en memoria** — requerido para que las transacciones MongoDB funcionen en el entorno de test sin necesitar una conexión a Atlas.

```bash
npm test
```

**Resultado esperado:**
```
 PASS  tests/auth.test.ts      (8 tests)
 PASS  tests/leads.test.ts     (7 tests)
 PASS  tests/validate.test.ts  (8 tests)

Tests: 23 passed, 23 total
```

### Descripción de cada suite

#### `tests/auth.test.ts` — 8 tests
- Registro exitoso de driver (retorna JWT + user sin campo `password`)
- Registro exitoso de partner
- Email duplicado → 409
- Role inválido → 400
- Password menor a 8 caracteres → 400
- Login exitoso con credenciales correctas
- Login con password incorrecto → 401
- Token de driver en ruta protegida de partner → 403

#### `tests/leads.test.ts` — 7 tests
- GET promos con driver y partner activos y promo vigente → retorna lista
- GET promos con UUID de driver inexistente → 404
- GET promos sin partners cercanos → `promos: []`
- GET promos con promo vencida → `promos: []`
- POST leads/create → crea lead con código único y `commission_amount` congelado
- POST leads/create con campos faltantes → 400
- POST leads/create con promo inactiva → 404

#### `tests/validate.test.ts` — 8 tests
- Validación exitosa → lead completado + `driver.balance` incrementado
- Código ya validado → 400
- Segunda validación no acredita doble comisión (idempotencia)
- Partner incorrecto (promo de otro partner) → 403
- Sin token → 401
- Código inexistente → 400
- Token de driver en endpoint de partner → 403
- Token de partner en endpoint de driver → 403

### Configuración de tests

| Archivo | Propósito |
|---------|-----------|
| `tests/jest.env.ts` | Setea `process.env` antes de que cualquier módulo `src/` sea importado. Usa `BCRYPT_ROUNDS=4` para tests más rápidos. |
| `tests/setup.ts` | Exporta `connect()`, `disconnect()`, `clearDatabase()` usando `MongoMemoryReplSet`. |
| `jest.config.js` | CommonJS (no `.ts`) para evitar dependencia de `ts-node`. Usa `transform` array syntax con `ts-jest`. |
| `tsconfig.test.json` | Extiende `tsconfig.json` con `rootDir: "."` y `types: ["node", "jest"]`. |

---

## Clientes HTTP (Insomnia / Thunder Client)

### Insomnia

Importa `insomnia/voya-insomnia.json` desde **File → Import → From File**.

Incluye:
- **2 entornos**: `Voya API - Local` (`http://localhost:4000`) y `Voya API - Railway` (URL de producción)
- **4 carpetas**: Auth, Public, Driver, Partner
- **11 requests** preconfigurados con `Bearer {{token}}` donde corresponde

### Thunder Client (VS Code)

Importa ambos archivos desde el panel de Thunder Client:
- `thunder-client/voya-collection.json`
- `thunder-client/voya-environment.json`

| Variable de entorno | Descripción |
|---------------------|-------------|
| `baseUrl` | `http://localhost:4000` |
| `driverToken` | JWT del driver (auto-capturado en registro/login) |
| `partnerToken` | JWT del partner |
| `driverQrId` | UUID del QR del driver (`user.qr_code_id`) |
| `driverId` | `_id` del driver |
| `promoId` | `_id` de la Promotion creada en Atlas |
| `validationCode` | Código de 6 chars del Lead |

---

## Despliegue en Railway

1. Conecta tu repositorio GitHub a Railway desde [railway.app](https://railway.app).
2. Configura las variables de entorno en Railway → **Variables**:

```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<valor-secreto-minimo-32-chars>
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://tu-frontend.railway.app
GEO_RADIUS_KM=5
BCRYPT_ROUNDS=12
```

3. Railway detecta automáticamente el `package.json` y ejecuta:
   - **Build:** `npm run build` (TypeScript → `dist/`)
   - **Start:** `npm start` (`node dist/server.js`)

4. En MongoDB Atlas → **Network Access**, agrega la IP de Railway o usa `0.0.0.0/0` para desarrollo.

---

## Solución de problemas conocidos

### `querySrv ECONNREFUSED` al conectar a MongoDB Atlas

**Causa:** El DNS del ISP o red corporativa bloquea las consultas SRV requeridas por el protocolo `mongodb+srv://`.

**Solución aplicada en `src/config/db.ts`:**
```typescript
import { setServers } from 'node:dns';
// Antes de mongoose.connect():
setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
```

---

### Variables de entorno con comillas simples o dobles

**Síntoma:** `MONGODB_URI` u otras variables aparecen vacías o la validación de Zod falla con valores que parecen correctos.

**Causa:** `dotenv` incluye las comillas como parte literal del valor.

**Solución:** Valores sin comillas en `.env`:
```env
# ❌ Incorrecto
MONGODB_URI='mongodb+srv://...'

# ✅ Correcto
MONGODB_URI=mongodb+srv://...
```

---

### `TransientTransactionError` en tests de validación

**Causa:** El replica set en memoria puede generar conflictos de escritura en el catálogo durante la ejecución de tests paralelos.

**Solución aplicada:** `validateLead()` reintenta la transacción automáticamente hasta **3 veces** cuando detecta `TransientTransactionError` en `error.errorLabels`.

---

### Password visible en la respuesta de registro

**Causa:** `select: false` en Mongoose solo filtra queries (`findOne`, `find`, etc.) — no el resultado de `Model.create()`.

**Solución aplicada:**
```typescript
const userObj = doc.toObject({ versionKey: false });
delete (userObj as Record<string, unknown>)['password'];
res.status(201).json({ token, user: userObj });
```

---

### `jest.config.ts` requiere `ts-node`

**Causa:** Jest intenta ejecutar archivos `.ts` de configuración usando `ts-node`, que puede no estar instalado como dependencia.

**Solución aplicada:** El archivo de configuración usa extensión `.js` con `module.exports` (CommonJS) en lugar de `.ts`.

---

*Voya API MVP v1.0.0 — 23 de abril de 2026*
