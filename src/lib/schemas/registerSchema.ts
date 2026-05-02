import { z } from "zod";

// ─── Step 1: Business identity ──────────────────────────────────────────────
export const step1Schema = z.object({
  business_name: z.string().min(2, "Mínimo 2 caracteres"),
  category: z.enum(
    ["restaurant", "bar", "cafe", "tour", "other"] as const,
    { error: "Selecciona una categoría" }
  ),
  manager_name: z.string().min(2, "Mínimo 2 caracteres"),
});

// ─── Step 2: Account + contact ───────────────────────────────────────────────
export const step2Schema = z
  .object({
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    phone: z.string().optional(),
    address: z.string().optional(),
    website: z.string().optional(),
  });

// ─── Step 3: Geolocation ─────────────────────────────────────────────────────
export const step3Schema = z.object({
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});

// ─── Full schema (all steps merged) ─────────────────────────────────────────
export const registerSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type Step1Fields = keyof z.infer<typeof step1Schema>;
export type Step2Fields = keyof z.infer<typeof step2Schema>;
export type Step3Fields = keyof z.infer<typeof step3Schema>;
