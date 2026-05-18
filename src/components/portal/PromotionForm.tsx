"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { promotionSchema, type PromotionFormData } from "@/lib/schemas/promotionSchema";
import type { Promotion } from "@/types/api";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PromotionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PromotionFormData) => void;
  isPending: boolean;
  serverError?: string;
  /** Pass a promotion to edit mode; omit for create mode */
  promotion?: Promotion;
}

/** Format a UTC ISO string to the value expected by datetime-local inputs (YYYY-MM-DDTHH:mm) */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PromotionForm({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  serverError,
  promotion,
}: Readonly<PromotionFormProps>) {
  const isEditing = Boolean(promotion);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
  });

  // Observar el campo para saber si el límite diario está activo
  const watchedMaxLeads = useWatch({ control, name: "max_leads_per_day" });
  const hasLimit = watchedMaxLeads != null;

  // Populate form when editing
  useEffect(() => {
    if (isOpen) {
      if (promotion) {
        reset({
          title: promotion.title,
          description: promotion.description,
          reward_value: promotion.reward_value,
          commission_per_lead: promotion.commission_per_lead,
          valid_from: toDatetimeLocal(promotion.valid_from),
          valid_until: toDatetimeLocal(promotion.valid_until),
          max_leads_per_day: promotion.max_leads_per_day ?? null,
        });
      } else {
        reset({
          title: "",
          description: "",
          reward_value: "",
          commission_per_lead: undefined,
          valid_from: "",
          valid_until: "",
          max_leads_per_day: null,
        });
      }
    }
  }, [isOpen, promotion, reset]);

  const handleFormSubmit = (data: PromotionFormData) => {
    // Convert datetime-local values to full ISO 8601 strings
    onSubmit({
      ...data,
      valid_from: new Date(data.valid_from).toISOString(),
      valid_until: new Date(data.valid_until).toISOString(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-h-[90dvh] overflow-y-auto">
      <div className="p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? "Editar promoción" : "Nueva promoción"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-700">{serverError}</p>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Título"
            placeholder="Ej. 10% de descuento en tu visita"
            error={errors.title?.message}
            {...register("title")}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">
              Descripción
            </label>
            <textarea
              id="description"
              placeholder="Descripción detallada de la promoción..."
              rows={3}
              className="w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 bg-white border-slate-300 transition-colors focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 resize-none"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>
          <Input
            label="Beneficio para el pasajero"
            placeholder="Ej. 10% off en consumo total"
            error={errors.reward_value?.message}
            {...register("reward_value")}
          />
          <Input
            label="Comisión por lead ($)"
            type="number"
            min={0}
            step="0.01"
            placeholder="5.00"
            error={errors.commission_per_lead?.message}
            {...register("commission_per_lead", { valueAsNumber: true })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Válida desde"
              type="datetime-local"
              error={errors.valid_from?.message}
              {...register("valid_from")}
            />
            <Input
              label="Válida hasta"
              type="datetime-local"
              error={errors.valid_until?.message}
              {...register("valid_until")}
            />
          </div>

          {/* Límite diario de cupones — REQ-3 */}
          <div className="flex flex-col gap-2 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                id="daily-cap-toggle"
                checked={hasLimit}
                onChange={(e) =>
                  setValue(
                    "max_leads_per_day",
                    e.target.checked ? 10 : null,
                    { shouldValidate: true }
                  )
                }
                className="w-4 h-4 accent-teal-600 cursor-pointer"
              />
              <label
                htmlFor="daily-cap-toggle"
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Activar límite diario de cupones
              </label>
            </div>

            {hasLimit && (
              <div className="flex flex-col gap-1 pl-6">
                <label
                  htmlFor="daily-cap-value"
                  className="text-xs font-medium text-slate-500"
                >
                  Máximo de activaciones por 24 horas
                </label>
                <input
                  id="daily-cap-value"
                  type="number"
                  min={1}
                  step={1}
                  value={typeof watchedMaxLeads === "number" ? watchedMaxLeads : ""}
                  onChange={(e) => {
                    const n = Number.parseInt(e.target.value, 10);
                    if (!Number.isNaN(n) && n >= 1)
                      setValue("max_leads_per_day", n, { shouldValidate: true });
                  }}
                  className="w-32 rounded-xl border border-slate-300 px-3 py-1.5 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
                  placeholder="Ej: 20"
                />
                {errors.max_leads_per_day && (
                  <p className="text-xs text-red-500">{errors.max_leads_per_day.message}</p>
                )}
              </div>
            )}

            <p className="text-xs text-slate-400 pl-6">
              {hasLimit
                ? `La promo desaparecerá del escáner tras ${watchedMaxLeads} activaciones en 24h.`
                : "Sin límite — la promo aparece siempre que tenga saldo y esté vigente."}
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isPending}
              className="flex-1"
            >
              {isEditing ? "Guardar cambios" : "Crear promoción"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
