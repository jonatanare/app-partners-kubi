import z from "zod";

export const PARTNER_CATEGORIES = [
  "restaurant",
  "bar",
  "cafe",
  "tour",
  "other",
] as const;

export const profileSchema = z.object({
  business_name: z.string().min(2, "Mínimo 2 caracteres"),
  category: z.enum(PARTNER_CATEGORIES, {
    message: "Selecciona una categoría válida",
  }),
  manager_name: z.string().min(2, "Mínimo 2 caracteres").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === "" || /^https?:\/\/.+/.test(v),
      "Ingresa una URL válida (https://...)"
    ),
  /** URL de la ficha de Google My Business. Opcional, debe ser URL válida si se proporciona. */
  google_maps_url: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === "" || /^https?:\/\/.+/.test(v),
      "Ingresa una URL válida (https://...)"
    ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
