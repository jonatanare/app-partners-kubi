import { z } from "zod";

// Regex: formato HH:MM en 24h
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Esquema de un día individual (con estado activo/cerrado para el form)
const dayFormStateSchema = z
  .object({
    enabled: z.boolean(),
    open: z.string(),
    close: z.string(),
  })
  .superRefine((val, ctx) => {
    // Los días cerrados no necesitan validación de horas
    if (!val.enabled) return;

    if (!TIME_REGEX.test(val.open)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["open"],
        message: "Formato de hora inválido (HH:MM)",
      });
    }

    if (!TIME_REGEX.test(val.close)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["close"],
        message: "Formato de hora inválido (HH:MM)",
      });
    }

    // El backend rechaza open === close (valor ambiguo)
    if (
      TIME_REGEX.test(val.open) &&
      TIME_REGEX.test(val.close) &&
      val.open === val.close
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["close"],
        message: "La hora de cierre no puede ser igual a la de apertura",
      });
    }
  });

export type DayFormState = z.infer<typeof dayFormStateSchema>;

export const openingHoursSchema = z.object({
  days: z.object({
    monday:    dayFormStateSchema,
    tuesday:   dayFormStateSchema,
    wednesday: dayFormStateSchema,
    thursday:  dayFormStateSchema,
    friday:    dayFormStateSchema,
    saturday:  dayFormStateSchema,
    sunday:    dayFormStateSchema,
  }),
  timezone: z.string().min(1, "Selecciona una zona horaria"),
});

export type OpeningHoursFormData = z.infer<typeof openingHoursSchema>;
