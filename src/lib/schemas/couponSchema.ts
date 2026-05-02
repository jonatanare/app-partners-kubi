import { z } from "zod";

export const couponSchema = z.object({
  validation_code: z
    .string()
    .min(1, "Ingresa el código")
    .min(6, "El código debe tener 6 caracteres")
    .max(6, "El código debe tener 6 caracteres")
    .regex(/^[A-F0-9]+$/, "Formato inválido (solo A-F y 0-9)"),
});

export type CouponFormData = z.infer<typeof couponSchema>;
