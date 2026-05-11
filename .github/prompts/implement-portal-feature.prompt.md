---
description: "Implementar un feature completo en el portal de partners: tipos, esquema Zod, API functions, route handler BFF, hooks React Query y componente. Úsalo cuando tengas las especificaciones técnicas del backend y necesites generar todo el stack frontend de una funcionalidad nueva."
name: "Implementar Feature del Portal"
argument-hint: "Descripción del feature y especificaciones técnicas del backend"
agent: "agent"
---

# Implementar Feature Completo en el Portal de Partners

## Instrucciones de Uso del Proyecto

Antes de generar cualquier código, carga y sigue las convenciones del proyecto:

- [project-conventions.instructions.md](../../.github/instructions/project-conventions.instructions.md)

---

## Input Requerido

Analiza los siguientes argumentos:

**$args**

Si el input incluye una guía técnica de backend (endpoints, estructura de datos, reglas de negocio), extrae de ella:

1. **Nombre del feature** (en inglés, camelCase para archivos/hooks, PascalCase para componentes)
2. **Endpoints involucrados** (`GET`, `PATCH`, `POST`, `DELETE`) con sus paths, payloads y respuestas
3. **Estructura de datos** (campos, tipos, valores opcionales vs requeridos, reglas de validación)
4. **Reglas de negocio críticas** (casos borde, comportamientos especiales, restricciones)
5. **UI requerida** (formulario, lista, modal, pantalla de solo lectura, etc.)

---

## Plan de Implementación

Genera los artefactos en este orden estricto. Cada uno depende del anterior.

---

### Paso 1 — Tipos TypeScript (`src/types/api.ts`)

Agrega las interfaces al archivo existente `src/types/api.ts`. No crees un archivo nuevo.

Reglas:
- Nombra los tipos con sufijo `Response` para respuestas del backend y `Payload` para bodies de request
- Usa `?` para campos opcionales tal como los define el backend
- Usa `| null` cuando el campo puede venir explícitamente como `null` (distinto de ausente)
- Exporta todos los tipos necesarios para el feature
- Agrupa con un comentario de sección:

```ts
// ─── Opening Hours ────────────────────────────────────────────────────────────
```

---

### Paso 2 — Esquema Zod (`src/lib/schemas/<featureName>Schema.ts`)

Crea el archivo si no existe. Reglas:
- Exporta el schema con el nombre `<featureName>Schema`
- Exporta el tipo inferido con el nombre `<FeatureName>FormData`
- Todos los mensajes de error en **español**
- Usa `.refine()` para validaciones cruzadas (ej: `open !== close`)
- Usa `.superRefine()` para validaciones complejas con múltiples errores
- Ejemplo de patrón para campo opcional con validación condicional:

```ts
export const openingHoursSchema = z.object({
  opening_hours: z
    .record(z.union([dayScheduleSchema, z.null()]))
    .optional(),
  timezone: z.string().min(1, "Selecciona una zona horaria").optional(),
});
export type OpeningHoursFormData = z.infer<typeof openingHoursSchema>;
```

---

### Paso 3 — API Functions (`src/lib/api/partner.ts`)

Agrega las funciones al archivo existente. No crees un archivo nuevo.

Reglas:
- Prefijo `call` en todas las funciones exportadas
- Tipado explícito en el genérico de Axios: `apiClient.get<ResponseType>(path)`
- Desestructura `data` directamente: `const { data } = await apiClient.patch<T>(path, payload)`
- Sin manejo de errores inline — React Query lo gestiona
- Agrega sección con comentario si el feature agrupa múltiples funciones:

```ts
// ─── Opening Hours ────────────────────────────────────────────────────────────
export async function callUpdateOpeningHours(payload: UpdateOpeningHoursPayload): Promise<PartnerProfileResponse> {
  const { data } = await apiClient.patch<PartnerProfileResponse>('/partner/profile', payload);
  return data;
}
```

---

### Paso 4 — Route Handler BFF (`src/app/api/partner/<feature>/route.ts`)

Crea el archivo en la ruta correcta según los endpoints del feature. Reglas:

- Patrón BFF estricto: leer cookie `kubi_token` → reenviar al backend real con `Authorization: Bearer`
- Importar `getSession` de `src/lib/session.ts`
- Devolver `401` si no hay sesión activa con mensaje en español
- Enviar el body tal cual llega, sin transformaciones
- La URL del backend se lee de `process.env.NEXT_PUBLIC_API_URL` (solo server-side)

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const body = await request.json();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/partners/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
```

---

### Paso 5 — React Query Hooks (`src/lib/hooks/use<FeatureName>.ts`)

Crea el archivo si no existe. Importa `queryClient` desde `src/providers/QueryProvider.tsx` o usa `useQueryClient()`. Reglas:

**Query hooks (GET)**:
```ts
export function useOpeningHours() {
  return useQuery<PartnerProfileResponse>({
    queryKey: ['partner', 'profile'],
    queryFn: callGetProfile,
    staleTime: 1000 * 60 * 2,
    select: (data) => data.opening_hours, // si aplica
  });
}
```

**Mutation hooks (PATCH/POST/DELETE)**:
```ts
export function useUpdateOpeningHours() {
  const queryClient = useQueryClient();
  return useMutation<PartnerProfileResponse, AxiosError<ApiErrorBody>, UpdateOpeningHoursPayload>({
    mutationFn: callUpdateOpeningHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner', 'profile'] });
    },
  });
}
```

Stale times según feature:
- Perfil del partner: 2 minutos
- Datos frecuentes (promotions): 30 segundos
- Default: 1 minuto

---

### Paso 6 — Componente (`src/components/portal/<ComponentName>.tsx`)

Crea el componente. Reglas:

- Declara interfaz `<ComponentName>Props` explícita al inicio del archivo
- Usa React Hook Form con `zodResolver` y el schema del Paso 2
- Usa `useEffect` para poblar campos al editar
- Muestra errores del servidor desde `mutation.error` (tipo `AxiosError<ApiErrorBody>`)
- Texto de UI siempre en **español**
- Clases con `cn()` para condicionales
- Iconos de Lucide React si son necesarios
- Usa los primitivos de `src/components/ui/` (`Button`, `Input`, `Modal`) — no crees nuevos

**Patrón de manejo de errores del servidor**:
```tsx
{mutation.error && (
  <p className="text-sm text-red-500">
    {(mutation.error as AxiosError<ApiErrorBody>).response?.data?.error ?? 'Ocurrió un error inesperado'}
  </p>
)}
```

**Patrón de estado de carga**:
```tsx
<Button type="submit" disabled={mutation.isPending}>
  {mutation.isPending ? 'Guardando...' : 'Guardar cambios'}
</Button>
```

---

## Checklist de Validación

Antes de presentar el código generado, verifica cada punto:

- [ ] **Tipos**: todos los campos opcionales usan `?`, campos nulos explícitos usan `| null`
- [ ] **Zod**: mensajes de error en español, validaciones cruzadas con `.refine()`
- [ ] **API functions**: prefijo `call`, sin try/catch, tipado genérico completo
- [ ] **Route handler**: autentica con `getSession()`, nunca expone `NEXT_PUBLIC_API_URL` al cliente
- [ ] **Hook query**: `queryKey` en array, `staleTime` definido
- [ ] **Hook mutation**: tipado `<TData, TError, TVariables>`, invalida queries relacionadas en `onSuccess`
- [ ] **Componente**: interfaz `Props` explícita, formulario con `zodResolver`, errores del servidor visibles
- [ ] **Idioma**: código en inglés, UI en español, comentarios en español
- [ ] **Sin librerías nuevas**: solo las del stack definido en las convenciones

---

## Casos Borde a Considerar Siempre

Para cada feature, evalúa si aplican estos casos y manéjalos en el código:

1. **Campo ausente vs `null`**: ¿el backend distingue entre campo no configurado (`undefined`) y campo explícitamente vacío (`null`)? Si sí, maneja ambos en el componente.
2. **Actualizaciones parciales**: ¿el endpoint acepta PATCH parcial? Si sí, envía solo los campos modificados.
3. **Estado de carga inicial**: muestra skeleton o spinner mientras se carga, no un formulario vacío que parezca un bug.
4. **Feedback de éxito**: muestra confirmación visual (toast o mensaje inline) cuando la mutación tiene éxito.
5. **Validación client-side vs server-side**: el Zod schema debe replicar las validaciones del backend para dar feedback inmediato, pero siempre manejar también errores `400` del servidor.
