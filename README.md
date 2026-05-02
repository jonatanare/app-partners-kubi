# app-partners-kubi

Portal PWA para negocios afiliados a la plataforma **Kubi**. Permite a restaurantes, bares,
cafés y otros negocios locales gestionar sus promociones, validar cupones de pasajeros en
tiempo real y monitorear métricas de rendimiento.

Desplegado en: **`partners.getkubi.app`**

---

## Arquitectura de dominios

Este repositorio es uno de tres frontends en la plataforma Kubi:

| Dominio | Repo | Rol |
|---|---|---|
| `getkubi.app` | `app-passenger-kubi` | Marketing Hub + QR flow del pasajero |
| `partners.getkubi.app` | **este repo** | Portal PWA para negocios afiliados |
| `drivers.getkubi.app` | `app-drivers-kubi` | Portal PWA para conductores |
| `api.getkubi.app` | Backend Railway | REST API (Mongoose / Express) |

La raíz de `partners.getkubi.app` (`/`) es una **gateway mínima** con `noindex` y canonical
hacia `getkubi.app/negocios`, que es donde vive el contenido SEO de adquisición de negocios.
El contenido de marketing (landing, FAQ, precios) se encuentra en `src/components/landing/`
como fuente de verdad para ser copiado al repo de passenger.

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| UI | React | 19.2.4 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS v4 | ^4 |
| Iconos | Lucide React | ^1.11 |
| Tipografía | Geist Sans (next/font) | — |
| Fetching / caché | TanStack React Query | v5 |
| Cliente HTTP | Axios | ^1.15 |
| Formularios | React Hook Form + Zod | ^7 / ^4 |
| PWA | Serwist + @serwist/next | ^9.5 |
| Deploy | Vercel | — |

---

## Requisitos previos

- Node.js 20+
- Una instancia del backend corriendo (ver variable `NEXT_PUBLIC_API_URL`)

---

## Variables de entorno

Crear un archivo `.env.local` en la raíz:

```env
# URL base de la API REST de Kubi
# Desarrollo:  http://localhost:3001
# Producción:  https://api.getkubi.app
NEXT_PUBLIC_API_URL=https://api.getkubi.app

# Número de WhatsApp de soporte para recarga de wallet
# Formato: código de país + número, SIN el signo +
# Ejemplo: 50688887777
NEXT_PUBLIC_SUPPORT_WHATSAPP=
```

> `NEXT_PUBLIC_SUPPORT_WHATSAPP` es opcional. Si no se define, el botón de recarga de wallet
> en el Dashboard no se renderiza.

---

## Desarrollo local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

En modo desarrollo, el service worker de Serwist **no se registra** (se carga
condicionalmente solo en producción para evitar conflictos con Turbopack).

### Comandos disponibles

```bash
npm run dev     # Servidor de desarrollo con Turbopack
npm run build   # Build de producción (incluye generación del service worker)
npm run start   # Servidor de producción local
```

---

## Estructura del proyecto

```
src/
├── proxy.ts                        # Middleware de autenticación
├── app/
│   ├── layout.tsx                  # Layout raíz (fuente, metadata global, QueryProvider)
│   ├── page.tsx                    # Gateway de entrada (/ → /portal/validate o /register)
│   ├── globals.css                 # Estilos globales Tailwind v4
│   ├── sw.ts                       # Service worker (Serwist)
│   ├── offline/
│   │   └── page.tsx                # Página de fallback sin conexión
│   ├── login/
│   │   └── page.tsx                # Página de inicio de sesión
│   ├── register/
│   │   └── page.tsx                # Registro de nuevo negocio (3 pasos)
│   ├── portal/
│   │   ├── layout.tsx              # Layout del portal (sidebar + protección de sesión)
│   │   ├── page.tsx                # Redirect → /portal/validate
│   │   ├── validate/page.tsx       # Validador de cupones
│   │   ├── promotions/page.tsx     # Gestión de promociones
│   │   ├── dashboard/page.tsx      # Métricas y saldo
│   │   └── profile/page.tsx        # Perfil del negocio
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      # BFF: POST /api/v1/auth/login
│       │   ├── logout/route.ts     # BFF: limpia cookies de sesión
│       │   └── register/route.ts   # BFF: POST /api/v1/auth/register
│       └── partner/
│           ├── validate/route.ts           # BFF: POST /api/v1/partners/validate
│           ├── dashboard/route.ts          # BFF: GET /api/v1/partners/dashboard
│           ├── profile/route.ts            # BFF: GET/PATCH /api/v1/partners/me
│           └── promotions/
│               ├── route.ts                # BFF: GET + POST /api/v1/partners/promotions
│               └── [id]/
│                   ├── route.ts            # BFF: GET + PATCH + DELETE /api/v1/partners/promotions/:id
│                   ├── leads/route.ts      # BFF: GET /api/v1/partners/promotions/:id/leads
│                   └── status/route.ts     # BFF: PATCH /api/v1/partners/promotions/:id/status
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── landing/                    # Componentes de landing (fuente de verdad para getkubi.app/negocios)
│   │   ├── LandingNav.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── WalletExplainer.tsx
│   │   ├── PricingTransparency.tsx
│   │   ├── RoadmapSection.tsx
│   │   ├── FAQSection.tsx
│   │   ├── RegistrationCTA.tsx
│   │   └── LandingFooter.tsx
│   ├── portal/
│   │   ├── PortalNav.tsx           # Sidebar (desktop) + bottom tab bar (mobile)
│   │   ├── ValidatorScreen.tsx     # Formulario de validación de cupones
│   │   ├── ValidationResult.tsx    # Resultado de validación (éxito / error)
│   │   ├── DashboardMetrics.tsx    # Cards de métricas + alerta de wallet bajo
│   │   ├── OnboardingChecklist.tsx # Checklist para nuevos negocios
│   │   ├── PromotionsList.tsx      # Lista de promociones con filtros
│   │   ├── PromotionCard.tsx       # Card individual de promoción
│   │   ├── PromotionForm.tsx       # Formulario crear / editar promoción
│   │   └── PromotionLeadsModal.tsx # Modal de leads por promoción
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/
│   ├── config.ts                   # Constantes (LOW_WALLET_THRESHOLD, getSupportWhatsAppUrl)
│   ├── session.ts                  # getSession() — lee cookies httpOnly server-side
│   ├── utils.ts                    # cn() — helper de clases Tailwind
│   ├── api/
│   │   ├── client.ts               # Instancia Axios apuntando a /api (BFF)
│   │   ├── auth.ts                 # callLogin / callRegister / callLogout
│   │   └── partner.ts              # callValidate / callDashboard / callListPromotions / ...
│   ├── hooks/
│   │   ├── useDashboard.ts
│   │   ├── usePromotions.ts
│   │   ├── usePromotionMutations.ts
│   │   ├── usePromotionLeads.ts
│   │   ├── useValidateCoupon.ts
│   │   └── useProfile.ts
│   └── schemas/
│       ├── loginSchema.ts
│       ├── registerSchema.ts       # 3 pasos: identidad / cuenta+contacto / geolocalización
│       ├── promotionSchema.ts
│       ├── profileSchema.ts
│       └── couponSchema.ts         # Código de 6 caracteres hex (A-F, 0-9)
├── providers/
│   └── QueryProvider.tsx           # React Query client (staleTime 1 min, retry 1)
└── types/
    └── api.ts                      # Interfaces TypeScript del backend (Partner, Promotion, Lead, ...)
```

---

## Autenticación

El sistema usa un patrón BFF (Backend For Frontend). La URL del backend nunca se expone al
cliente, y el JWT nunca es accesible desde JavaScript.

### Flujo de login

```
Browser → POST /api/auth/login → Route Handler → POST api.getkubi.app/api/v1/auth/login
                                                 ← { token, user }
                                 ← Set-Cookie: kubi_token (httpOnly)
                                 ← Set-Cookie: kubi_user  (httpOnly)
Browser ← { user }
```

### Cookies de sesión

| Cookie | Contenido | Opciones |
|---|---|---|
| `kubi_token` | JWT del backend | `httpOnly`, `secure` (prod), `sameSite=strict`, 7 días |
| `kubi_user` | JSON con `_id`, `email`, `business_name`, `role` | Mismas opciones |

### Middleware de protección (`src/proxy.ts`)

Protege todas las rutas bajo `/portal/*`. Si no existe `kubi_token` en las cookies,
redirige a `/login?callbackUrl=<ruta>`.

### Registro de negocios

El formulario de registro tiene 3 pasos validados con Zod de forma independiente:

1. **Identidad del negocio**: nombre, categoría (`restaurant|bar|cafe|tour|other`), responsable
2. **Cuenta y contacto**: email, contraseña (mín. 8 caracteres), teléfono, dirección, sitio web (opcionales)
3. **Geolocalización**: coordenadas GeoJSON `[longitud, latitud]` obtenidas del navegador

El backend recibe el campo `role: "partner"` inyectado por el Route Handler — el formulario
del cliente nunca lo envía.

---

## Patrón BFF — Route Handlers

Todos los Route Handlers en `src/app/api/` actúan como proxy transparente entre el browser
y el backend de Railway. Responsabilidades:

1. Leer el JWT de la cookie `kubi_token` (inaccesible desde el cliente)
2. Reenviar la request al backend con el header `Authorization: Bearer <token>`
3. Retornar la respuesta del backend al browser sin modificarla

El cliente Axios (`src/lib/api/client.ts`) apunta a `baseURL: "/api"`, nunca a la URL del
backend directamente.

### Tabla de endpoints BFF

| Método | Ruta BFF | Backend destino |
|---|---|---|
| POST | `/api/auth/login` | `POST /api/v1/auth/login` |
| POST | `/api/auth/logout` | — (limpia cookies localmente) |
| POST | `/api/auth/register` | `POST /api/v1/auth/register` |
| POST | `/api/partner/validate` | `POST /api/v1/partners/validate` |
| GET | `/api/partner/dashboard` | `GET /api/v1/partners/dashboard` |
| GET | `/api/partner/profile` | `GET /api/v1/partners/me` |
| PATCH | `/api/partner/profile` | `PATCH /api/v1/partners/me` |
| GET | `/api/partner/promotions` | `GET /api/v1/partners/promotions` |
| POST | `/api/partner/promotions` | `POST /api/v1/partners/promotions` |
| GET | `/api/partner/promotions/[id]` | `GET /api/v1/partners/promotions/:id` |
| PATCH | `/api/partner/promotions/[id]` | `PATCH /api/v1/partners/promotions/:id` |
| DELETE | `/api/partner/promotions/[id]` | `DELETE /api/v1/partners/promotions/:id` |
| PATCH | `/api/partner/promotions/[id]/status` | `PATCH /api/v1/partners/promotions/:id/status` |
| GET | `/api/partner/promotions/[id]/leads` | `GET /api/v1/partners/promotions/:id/leads` |

---

## Páginas del portal

### `/portal/validate` — Validador de cupones

Pantalla principal. El personal del negocio ingresa el código de 6 caracteres que el pasajero
muestra en su app. El código es hexadecimal mayúsculo (solo `A-F` y `0-9`).

**Flujo:**
1. El empleado ingresa el código
2. `useValidateCoupon()` envía `POST /api/partner/validate`
3. Si el backend responde 200, se muestra `ValidationResult` con el resumen del lead
4. Si el saldo del wallet es insuficiente, el backend devuelve 402 — se muestra un mensaje específico
5. Al cerrar el resultado, el formulario se resetea y el foco vuelve al input (optimizado para uso repetido)

Al validar con éxito, se invalida automáticamente la caché del dashboard (`["partner", "dashboard"]`).

### `/portal/dashboard` — Métricas

Muestra un `OnboardingChecklist` (para cuentas nuevas) y un conjunto de `MetricCard`:

| Métrica | Color |
|---|---|
| Wallet (saldo disponible) | teal / amber si bajo |
| Promociones activas | blue |
| Leads totales | teal |
| Leads completados | emerald |
| Leads pendientes | amber |
| Comisión pagada | teal |

Cuando el saldo cae por debajo de `LOW_WALLET_THRESHOLD` (20 USD), la tarjeta de wallet
cambia a fondo ámbar y muestra un botón de WhatsApp para solicitar recarga (si
`NEXT_PUBLIC_SUPPORT_WHATSAPP` está definido).

Debajo de las métricas se lista el rendimiento por promoción (tabla de `PromotionDashboardItem`).

### `/portal/promotions` — Gestión de promociones

Lista todas las promociones del negocio con filtro por estado (`active / inactive`).

Cada `PromotionCard` permite:
- Ver detalle de la promoción
- Activar / desactivar (toggle de estado)
- Editar (abre `PromotionForm` en modo edición)
- Ver leads asociados (abre `PromotionLeadsModal`)
- Eliminar

Crear nueva promoción abre `PromotionForm` en modo creación.

**Campos de una promoción:**

| Campo | Tipo | Validación |
|---|---|---|
| `title` | string | Requerido |
| `description` | string | Requerido |
| `reward_value` | string | Requerido (ej: "10% descuento") |
| `commission_per_lead` | number | ≥ 0 |
| `valid_from` | string (ISO date) | Requerido |
| `valid_until` | string (ISO date) | Debe ser posterior a `valid_from` |

### `/portal/profile` — Mi negocio

Permite al negocio actualizar su información. Campos de solo lectura: email, estado de cuenta.
Campos editables:

| Campo | Validación |
|---|---|
| Nombre del negocio | Mín. 2 caracteres |
| Categoría | `restaurant / bar / cafe / tour / other` |
| Responsable | Mín. 2 caracteres |
| Teléfono | Opcional |
| Dirección | Opcional |
| Sitio web | Opcional — debe ser `https://...` si se ingresa |

El botón de guardar se deshabilita cuando el formulario no tiene cambios (`isDirty: false`).
Al guardar, llama `PATCH /api/partner/profile` e invalida la caché `["partner-profile"]`.

**Dependencia de backend:** requiere que existan los endpoints `GET /api/v1/partners/me`
y `PATCH /api/v1/partners/me`.

### `/login` — Inicio de sesión

Formulario simple con email y contraseña. Redirige a `/portal/validate` al autenticar.
Si viene con `?callbackUrl=`, redirige a esa ruta tras el login.

### `/register` — Registro de negocio

Formulario de 3 pasos con validación por paso (Zod + React Hook Form). Al completar el paso 3
(geolocalización), llama `POST /api/auth/register` y redirige al portal.

### `/offline` — Sin conexión

Fallback del service worker cuando no hay red. Muestra un botón para reintentar desde
`/portal/validate`.

---

## React Query — Hooks y cachés

| Hook | Query key | staleTime | Descripción |
|---|---|---|---|
| `useDashboard()` | `["partner", "dashboard"]` | 2 min | Métricas generales y saldo |
| `usePromotions(status?)` | `["partner", "promotions", status]` | 30 s | Lista de promociones |
| `usePromotionLeads(id, status?)` | `["partner", "promotions", id, "leads", status]` | 30 s | Leads de una promoción |
| `useProfile()` | `["partner-profile"]` | 5 min | Datos del perfil del negocio |

### Mutaciones

| Hook | Invalida |
|---|---|
| `useValidateCoupon()` | `["partner", "dashboard"]` |
| `useCreatePromotion()` | `["partner", "promotions"]` |
| `useUpdatePromotion(id)` | `["partner", "promotions"]` |
| `useTogglePromotionStatus(id)` | `["partner", "promotions"]` |
| `useDeletePromotion()` | `["partner", "promotions"]`, `["partner", "dashboard"]` |
| `useUpdateProfile()` | `["partner-profile"]` |

El `QueryProvider` configura `retry: 1` y `refetchOnWindowFocus: false` globalmente.

---

## PWA

La app es instalable como PWA (Progressive Web App) con soporte offline.

### Configuración (`public/manifest.json`)

- `start_url`: `/portal/validate` — la pantalla de validación abre por defecto
- `display`: `standalone`
- `theme_color`: `#0d9488` (teal-500)
- Shortcuts: "Validar cupón" → `/portal/validate`, "Dashboard" → `/portal/dashboard`

### Service Worker (`src/app/sw.ts`)

Generado con Serwist. Estrategias de caché por ruta:

| Ruta / patrón | Estrategia | Cache name | Motivo |
|---|---|---|---|
| `/portal/validate` | NetworkFirst (5s timeout) | `validate-page` | Siempre datos frescos para validación |
| `/portal/dashboard`, `/portal/promotions`, `/portal/profile` | StaleWhileRevalidate | `portal-pages` | Mostrar inmediato, actualizar en background |
| `/api/partner/**`, `/api/auth/**` | NetworkFirst (5s timeout) | `api-cache` | API preferente en red, fallback a caché |
| `/_next/static/**` | CacheFirst | `next-static` | Assets estáticos inmutables |
| Resto | `defaultCache` (Serwist) | — | Estrategia por defecto |
| Fallback de documento | — | — | Sirve `/offline` cuando no hay red |

### Turbopack y Serwist

`@serwist/next` registra un plugin de webpack que es incompatible con Turbopack (usado en
`next dev`). La solución implementada en `next.config.ts`:

```ts
async function buildConfig() {
  if (process.env.NODE_ENV === "production") {
    const withSerwistInit = (await import("@serwist/next")).default;
    // Serwist se importa dinámicamente — nunca se ejecuta en dev
    const withSerwist = withSerwistInit({ swSrc: "src/app/sw.ts", swDest: "public/sw.js" });
    return withSerwist(nextConfig);
  }
  return nextConfig; // En dev: Next.js sin Serwist, Turbopack sin conflictos
}
```

---

## Seguridad

Los siguientes headers HTTP se aplican a todas las rutas via `next.config.ts`:

| Header | Valor |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` |

El JWT nunca se expone en el cliente. La cookie `kubi_token` es `httpOnly` y `sameSite=strict`.
El cliente Axios nunca conoce la URL del backend — toda comunicación pasa por los Route Handlers.

---

## Despliegue en Vercel

El archivo `vercel.json` configura el despliegue:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "regions": ["iad1"],
  "alias": ["partners.getkubi.app"]
}
```

**Variables de entorno en Vercel (producción):**

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.getkubi.app` |
| `NEXT_PUBLIC_SUPPORT_WHATSAPP` | número de soporte |

**CORS del backend:** el servidor Railway debe incluir `https://partners.getkubi.app` en los
orígenes permitidos.

---

## Tipos TypeScript — Modelos del backend

Definidos en `src/types/api.ts`, reflejan los modelos Mongoose del backend:

- `Partner` — negocio afiliado (wallet, categoría, ubicación GeoJSON, estado)
- `Driver` — conductor (balance, qr_code_id, ubicación GeoJSON)
- `Promotion` — promoción (título, descripción, reward_value, commission_per_lead, fechas)
- `Lead` — registro de visita de pasajero (commission_amount, driver_amount 80%, platform_fee 20%)
- `SessionUser` — subconjunto de usuario guardado en cookie (\_id, email, business_name, role)
- `GeoPoint` — `{ type: "Point", coordinates: [lon, lat] }` (GeoJSON estándar)

Los errores del backend usan la clave `error` (no `message`), tipados como `ApiErrorBody`.

---

## Componentes de landing (fuente de verdad)

Los componentes en `src/components/landing/` no se usan en el portal activo pero se
**preservan intencionalmente** como fuente de verdad visual para ser copiados a
`app-passenger-kubi` al construir la página `getkubi.app/negocios`.

Ver `docs-generated/plan-otros-repositorios.md` para la tabla completa de adaptaciones
requeridas por componente.

---

## Documentación adicional

| Archivo | Contenido |
|---|---|
| `docs-generated/Documentacion Backend.md` | Endpoints y modelos del backend |
| `docs-generated/frontend-backend-contract.md` | Contrato de integración frontend–backend |
| `docs-generated/partner-integration-guide.md` | Guía de integración para partners |
| `docs-generated/wallet-revenue-share-testing-guide.md` | Pruebas del modelo de revenue share |
| `docs-generated/domain-strategy.md` | Estrategia de dominios y arquitectura multi-repo |
| `docs-generated/plan-otros-repositorios.md` | Plan de implementación para app-passenger-kubi y app-drivers-kubi |
