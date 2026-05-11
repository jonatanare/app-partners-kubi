"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, AlertTriangle, CheckCircle2, Info, Save } from "lucide-react";
import type { AxiosError } from "axios";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import {
  openingHoursSchema,
  type OpeningHoursFormData,
  type DayFormState,
} from "@/lib/schemas/openingHoursSchema";
import { useUpdateOpeningHours } from "@/lib/hooks/useOpeningHours";
import { useProfile } from "@/lib/hooks/useProfile";
import type {
  OpeningHours,
  DaySchedule,
  UpdateOpeningHoursPayload,
  ApiErrorBody,
} from "@/types/api";

// ─── Constantes ───────────────────────────────────────────────────────────────

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DayKey = (typeof DAY_ORDER)[number];

const DAY_LABELS: Record<DayKey, string> = {
  monday:    "Lunes",
  tuesday:   "Martes",
  wednesday: "Miércoles",
  thursday:  "Jueves",
  friday:    "Viernes",
  saturday:  "Sábado",
  sunday:    "Domingo",
};

const NEXT_DAY_LABEL: Record<DayKey, string> = {
  monday:    "martes",
  tuesday:   "miércoles",
  wednesday: "jueves",
  thursday:  "viernes",
  friday:    "sábado",
  saturday:  "domingo",
  sunday:    "lunes",
};

const MX_TIMEZONES = [
  { label: "Cancún (UTC-5, sin horario de verano)", value: "America/Cancun" },
  { label: "Ciudad de México / Monterrey (UTC-6)",  value: "America/Mexico_City" },
  { label: "Tijuana (UTC-8)",                       value: "America/Tijuana" },
  { label: "Hermosillo (UTC-7, sin horario de verano)", value: "America/Hermosillo" },
  { label: "Chihuahua (UTC-7)",                     value: "America/Chihuahua" },
];

const DEFAULT_DAY: DayFormState = { enabled: false, open: "09:00", close: "18:00" };

// ─── Helpers de conversión ────────────────────────────────────────────────────

function dayToFormState(schedule: DaySchedule | undefined): DayFormState {
  if (!schedule) return { ...DEFAULT_DAY };
  return { enabled: true, open: schedule.open, close: schedule.close };
}

function profileToFormData(
  opening_hours: OpeningHours | undefined,
  timezone: string | undefined
): OpeningHoursFormData {
  return {
    days: {
      monday:    dayToFormState(opening_hours?.monday),
      tuesday:   dayToFormState(opening_hours?.tuesday),
      wednesday: dayToFormState(opening_hours?.wednesday),
      thursday:  dayToFormState(opening_hours?.thursday),
      friday:    dayToFormState(opening_hours?.friday),
      saturday:  dayToFormState(opening_hours?.saturday),
      sunday:    dayToFormState(opening_hours?.sunday),
    },
    timezone: timezone ?? "America/Cancun",
  };
}

function formDataToPayload(data: OpeningHoursFormData): UpdateOpeningHoursPayload {
  const opening_hours: OpeningHours = {};

  for (const key of DAY_ORDER) {
    const state = data.days[key];
    // enabled=true → enviar horario; enabled=false → enviar null (cerrado explícito)
    opening_hours[key] = state.enabled
      ? { open: state.open, close: state.close }
      : null;
  }

  return { opening_hours, timezone: data.timezone };
}

// ─── Subcomponente: fila de un día ────────────────────────────────────────────

interface DayRowProps {
  readonly dayKey: DayKey;
  readonly control: ReturnType<typeof useForm<OpeningHoursFormData>>["control"];
  readonly errors: ReturnType<typeof useForm<OpeningHoursFormData>>["formState"]["errors"];
}

function DayRow({ dayKey, control, errors }: DayRowProps) {
  // Observar valores en tiempo real para la advertencia de turno nocturno
  const open    = useWatch({ control, name: `days.${dayKey}.open` });
  const close   = useWatch({ control, name: `days.${dayKey}.close` });
  const enabled = useWatch({ control, name: `days.${dayKey}.enabled` });

  // Turno nocturno: close < open (p. ej. 22:00 → 02:00)
  const isOvernight =
    enabled && open && close && open !== close && close < open;

  const dayErrors = errors.days?.[dayKey];

  return (
    <div className="flex flex-col gap-2 py-3 border-b border-slate-100 last:border-0">
      <div className="flex flex-wrap items-center gap-4">
        {/* Nombre del día + toggle */}
        <div className="flex items-center gap-3 w-28 shrink-0">
          <Controller
            control={control}
            name={`days.${dayKey}.enabled`}
            render={({ field }) => (
              <button
                type="button"
                role="switch"
                aria-checked={field.value}
                onClick={() => field.onChange(!field.value)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200",
                  field.value ? "bg-teal-600" : "bg-slate-300"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                    field.value ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              enabled ? "text-slate-800" : "text-slate-400"
            )}
          >
            {DAY_LABELS[dayKey]}
          </span>
        </div>

        {/* Campos de hora (solo cuando está habilitado) */}
        {enabled ? (
          <div className="flex flex-wrap items-start gap-3">
            {/* Hora de apertura */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`days.${dayKey}.open`}
                className="text-xs text-slate-500 font-medium"
              >
                Apertura
              </label>
              <Controller
                control={control}
                name={`days.${dayKey}.open`}
                render={({ field }) => (
                  <input
                    id={`days.${dayKey}.open`}
                    type="time"
                    {...field}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm text-slate-900 bg-white",
                      "border-slate-300 transition-colors",
                      "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
                      dayErrors?.open &&
                        "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                )}
              />
              {dayErrors?.open && (
                <p className="text-xs text-red-500">{dayErrors.open.message}</p>
              )}
            </div>

            {/* Hora de cierre */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor={`days.${dayKey}.close`}
                className="text-xs text-slate-500 font-medium"
              >
                Cierre
              </label>
              <Controller
                control={control}
                name={`days.${dayKey}.close`}
                render={({ field }) => (
                  <input
                    id={`days.${dayKey}.close`}
                    type="time"
                    {...field}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-sm text-slate-900 bg-white",
                      "border-slate-300 transition-colors",
                      "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
                      dayErrors?.close &&
                        "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                )}
              />
              {dayErrors?.close && (
                <p className="text-xs text-red-500">{dayErrors.close.message}</p>
              )}
            </div>
          </div>
        ) : (
          <span className="text-sm text-slate-400 italic">Cerrado</span>
        )}
      </div>

      {/* Advertencia de turno nocturno */}
      {isOvernight && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>
            Turno nocturno: el negocio abre el{" "}
            <strong>{DAY_LABELS[dayKey].toLowerCase()}</strong> a las{" "}
            <strong>{open}</strong> y cierra el{" "}
            <strong>{NEXT_DAY_LABEL[dayKey]}</strong> a las{" "}
            <strong>{close}</strong>.
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

interface OpeningHoursFormProps {}

export function OpeningHoursForm(_props: OpeningHoursFormProps) {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const mutation = useUpdateOpeningHours();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<OpeningHoursFormData>({
    resolver: zodResolver(openingHoursSchema),
    defaultValues: profileToFormData(undefined, undefined),
  });

  // Poblar el formulario cuando llegan los datos del perfil
  useEffect(() => {
    if (profile) {
      reset(profileToFormData(profile.opening_hours, profile.timezone));
    }
  }, [profile, reset]);

  const onSubmit = (data: OpeningHoursFormData) => {
    setShowSuccess(false);
    mutation.mutate(formDataToPayload(data), {
      onSuccess: () => {
        setShowSuccess(true);
        // Ocultar el mensaje de éxito después de 4 segundos
        setTimeout(() => setShowSuccess(false), 4000);
      },
    });
  };

  // ─── Estado de carga ──────────────────────────────────────────────────────

  if (isProfileLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        {DAY_ORDER.map((day) => (
          <div key={day} className="h-10 bg-slate-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // ─── Banner de onboarding ─────────────────────────────────────────────────

  const hasNoHours = !profile?.opening_hours;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5">
        {/* Encabezado */}
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" />
          <h2 className="text-base font-semibold text-slate-800">
            Horarios de atención
          </h2>
        </div>

        {/* Banner de onboarding cuando aún no hay horarios configurados */}
        {hasNoHours && (
          <div className="flex items-start gap-2 rounded-xl bg-teal-50 border border-teal-200 px-4 py-3 text-sm text-teal-800">
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Configura tus horarios para que los pasajeros sepan cuándo
              visitarte.
            </span>
          </div>
        )}

        {/* Selector de zona horaria */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="timezone"
            className="text-sm font-medium text-slate-700"
          >
            Zona horaria
          </label>
          <Controller
            control={control}
            name="timezone"
            render={({ field }) => (
              <select
                id="timezone"
                {...field}
                className={cn(
                  "w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 bg-white",
                  "border-slate-300 transition-colors",
                  "focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20",
                  errors.timezone &&
                    "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                )}
              >
                {MX_TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.timezone && (
            <p className="text-xs text-red-500">{errors.timezone.message}</p>
          )}
        </div>

        {/* Filas de días */}
        <div>
          {DAY_ORDER.map((dayKey) => (
            <DayRow
              key={dayKey}
              dayKey={dayKey}
              control={control}
              errors={errors}
            />
          ))}
        </div>

        {/* Error del servidor */}
        {mutation.error && (
          <p className="text-sm text-red-500">
            {(mutation.error as AxiosError<ApiErrorBody>).response?.data
              ?.error ?? "Ocurrió un error inesperado. Intenta de nuevo."}
          </p>
        )}

        {/* Feedback de éxito */}
        {showSuccess && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Horarios guardados correctamente.</span>
          </div>
        )}

        {/* Botón de guardar */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={!isDirty || mutation.isPending}
            loading={mutation.isPending}
          >
            <Save className="w-4 h-4" />
            {mutation.isPending ? "Guardando..." : "Guardar horarios"}
          </Button>
        </div>
      </div>
    </form>
  );
}
