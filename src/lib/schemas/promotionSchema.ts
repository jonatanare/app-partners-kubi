import { z } from "zod";

export const promotionSchema = z
  .object({
    title: z.string().min(1, "El título es requerido"),
    description: z.string().min(1, "La descripción es requerida"),
    reward_value: z.string().min(1, "El beneficio es requerido"),
    commission_per_lead: z
      .number({ error: "Debe ser un número" })
      .min(0, "La comisión no puede ser negativa"),
    valid_from: z.string().min(1, "La fecha de inicio es requerida"),
    valid_until: z.string().min(1, "La fecha de fin es requerida"),
    /**
     * Límite diario de activaciones. null = sin límite.
     * undefined = campo no enviado (equivalente a null para el backend).
     */
    max_leads_per_day: z
      .number({ error: "Debe ser un número entero" })
      .int("Debe ser un número entero")
      .min(1, "El límite mínimo es 1")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (!data.valid_from || !data.valid_until) return true;
      return new Date(data.valid_until) > new Date(data.valid_from);
    },
    {
      message: "La fecha de fin debe ser posterior a la de inicio",
      path: ["valid_until"],
    }
  );

export type PromotionFormData = z.infer<typeof promotionSchema>;
