---
description: "Use when creating or modifying any file in this Next.js project: components, hooks, API functions, route handlers, schemas, types, or styles. Enforces project architecture, naming conventions, language rules, and coding patterns."
applyTo: "src/**"
---

# App Partners Kubi — Project Conventions

## Language Rules (CRITICAL)

- **Code** (variable names, function names, class names, type names, file names): always in **English**
- **UI text / copies** (labels, placeholders, error messages, button text): always in **Spanish**
- **Code comments**: always in **Spanish**
- **Zod validation error messages**: always in **Spanish** (e.g., `"El campo es requerido"`)
- Never mix languages within the same context

---

## Tech Stack (do not introduce new libraries)

| Concern | Library |
|---------|---------|
| Framework | Next.js App Router |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + `cn()` utility |
| Forms | React Hook Form + `@hookform/resolvers` |
| Validation | Zod |
| Server state | TanStack React Query v5 |
| HTTP client | Axios (centralized instance in `src/lib/api/client.ts`) |
| Icons | Lucide React |

Do not suggest `useState` for server data — always use React Query hooks.

---

## Folder Structure (strictly follow)

```
src/
├── app/
│   ├── api/                  # Next.js route handlers (BFF proxy only)
│   │   ├── auth/             # login, logout, register
│   │   └── partner/          # partner-specific endpoints
│   └── portal/               # Protected pages (App Router)
├── components/
│   ├── ui/                   # Reusable primitives (Button, Input, Modal)
│   ├── auth/                 # Auth forms
│   ├── portal/               # Feature components for the portal
│   └── landing/              # Landing page sections
├── lib/
│   ├── api/                  # client.ts + feature modules (auth.ts, partner.ts)
│   ├── hooks/                # React Query wrappers (one file per feature)
│   ├── schemas/              # Zod schemas (one file per feature)
│   ├── config.ts             # App-wide constants
│   ├── session.ts            # Cookie utilities (server-side only)
│   └── utils.ts              # Utilities (cn(), etc.)
├── providers/                # React context providers
└── types/
    └── api.ts                # All TypeScript interfaces for API responses
```

Never create new top-level folders. Place new files in the existing structure.

---

## Naming Conventions

| Category | Pattern | Examples |
|----------|---------|---------|
| Components | PascalCase | `PromotionForm`, `PortalNav` |
| Hooks | camelCase, `use` prefix | `useDashboard`, `useCreatePromotion` |
| API call functions | camelCase, `call` prefix | `callLogin`, `callGetProfile` |
| Types / Interfaces | PascalCase, `*Response` / `*Payload` suffixes | `DashboardResponse`, `CreatePromotionPayload` |
| Schema files | camelCase | `promotionSchema.ts`, `loginSchema.ts` |
| Component files | PascalCase | `PromotionForm.tsx`, `Button.tsx` |
| Hook / utility files | camelCase | `usePromotions.ts`, `client.ts` |

---

## API Layer

### Axios Client (`src/lib/api/client.ts`)
- Single Axios instance pointing to `/api` (Next.js BFF layer)
- `withCredentials: true` — cookies are sent automatically
- Do not create additional Axios instances

### API Function Files (`src/lib/api/partner.ts`, `src/lib/api/auth.ts`)
- Use `call*` prefix for all exported functions
- Destructure `data` directly from the response:
  ```ts
  const { data } = await apiClient.post<ResponseType>(path, payload);
  return data;
  ```
- Group functions with section comment markers:
  ```ts
  // ─── Promotions ───────────────────────────────────────────────────────────────
  ```
- No inline error handling in API functions — let React Query handle it

### Route Handlers (`src/app/api/**/route.ts`)
- BFF proxy pattern only: read httpOnly cookie → forward to backend with `Authorization` header
- Never expose the backend URL to the client (`NEXT_PUBLIC_API_URL` is server-only)
- Read JWT from the `kubi_token` cookie via `src/lib/session.ts`
- Standard structure:
  ```ts
  export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    // forward to backend
  }
  ```

---

## React Query Hooks

Place all hooks in `src/lib/hooks/`. One file per feature group.

### Query hooks
```ts
export function useDashboard() {
  return useQuery<DashboardResponse>({
    queryKey: ["partner", "dashboard"],
    queryFn: callDashboard,
    staleTime: 1000 * 60 * 2,
  });
}
```

### Mutation hooks
```ts
export function useCreatePromotion() {
  return useMutation<SuccessType, AxiosError<ApiErrorBody>, CreatePromotionPayload>({
    mutationFn: callCreatePromotion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "promotions"] });
    },
  });
}
```

### Stale times
- Dashboard: 2 minutes (`1000 * 60 * 2`)
- Promotions: 30 seconds (`1000 * 30`)
- Global default: 1 minute

---

## Component Patterns

### Props interface
Every component must declare an explicit `Props` or `*Props` interface:
```ts
interface PromotionCardProps {
  promotion: Promotion;
  onEdit?: (id: string) => void;
}
```

UI primitives extend HTML element types:
```ts
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

### UI primitives (`src/components/ui/`)
- Use `forwardRef` for all primitives
- Set `displayName` for debugging
- Use `cn()` from `src/lib/utils.ts` for conditional Tailwind classes
- Never inline complex className logic without `cn()`

### Form components
- Use React Hook Form with `zodResolver`
- Separate create/edit mode with `isEditing` prop
- Use `useEffect` to populate form fields when editing
- Display server errors from `AxiosError<ApiErrorBody>.response.data.error`

---

## Zod Schemas

Place schemas in `src/lib/schemas/`. One file per feature.

Always export both the schema and the inferred type:
```ts
export const promotionSchema = z.object({ ... });
export type PromotionFormData = z.infer<typeof promotionSchema>;
```

- All error messages in Spanish
- Use `.refine()` for cross-field validation
- Use `z.string().min(1, "El campo es requerido")` for required strings

---

## Auth & Session

- JWT is stored exclusively in the `kubi_token` httpOnly cookie — never in `localStorage` or `sessionStorage`
- User data is stored in the `kubi_user` httpOnly cookie
- `getSession()` from `src/lib/session.ts` is **server-side only** (route handlers, Server Components)
- Client-side components receive user data via props or server-fetched state — never read cookies directly
- Always return `401` with `{ error: "No autorizado" }` for unauthenticated requests

---

## TypeScript

- All API response shapes are defined in `src/types/api.ts`
- Use `AxiosError<ApiErrorBody>` for typed error handling in mutations
- Do not use `any` — use `unknown` and narrow the type
- Mark component props objects as `Readonly<Props>` in function signatures

---

## Architecture Boundaries (do not cross)

- Route handlers are **BFF proxies only** — no business logic
- `src/lib/session.ts` is **server-side only** — never import in client components
- The backend Railway URL must never appear in client-side code
- Do not add new state management libraries — React Query handles all server state, React state handles local UI state
