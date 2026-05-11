"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Mail, Phone, MapPin, Globe, Save, Store } from "lucide-react";
import { useProfile, useUpdateProfile } from "@/lib/hooks/useProfile";
import {
  profileSchema,
  PARTNER_CATEGORIES,
  type ProfileFormValues,
} from "@/lib/schemas/profileSchema";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { OpeningHoursForm } from "@/components/portal/OpeningHoursForm";

const CATEGORY_LABELS: Record<(typeof PARTNER_CATEGORIES)[number], string> = {
  restaurant: "Restaurante",
  bar: "Bar",
  cafe: "Café",
  tour: "Tour / Experiencia",
  other: "Otro",
};

export default function ProfilePage() {
  const { data, isLoading, isError } = useProfile();
  const { mutate: updateProfile, isPending, isSuccess, error } = useUpdateProfile();

  const partner = data;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      business_name: "",
      category: "other",
      manager_name: "",
      phone: "",
      address: "",
      website: "",
    },
  });

  // Poblar el formulario cuando llegan los datos del perfil
  useEffect(() => {
    if (partner) {
      reset({
        business_name: partner.business_name ?? "",
        category: (partner.category as ProfileFormValues["category"]) ?? "other",
        manager_name: partner.manager_name ?? "",
        phone: partner.contact_info?.phone ?? "",
        address: partner.contact_info?.address ?? "",
        website: partner.contact_info?.website ?? "",
      });
    }
  }, [partner, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile({
      business_name: values.business_name,
      category: values.category,
      manager_name: values.manager_name || undefined,
      contact_info: {
        phone: values.phone || undefined,
        address: values.address || undefined,
        website: values.website || undefined,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-slate-500 text-sm">
        No se pudo cargar el perfil. Intenta recargar la página.
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-5xl">
      {/* Encabezado */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mi negocio</h1>
        <p className="text-slate-500 text-sm mt-1">
          Actualiza los datos de tu negocio registrado en Kubi.
        </p>
      </div>

      {/* Fila de estado — pills compactos */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm shadow-sm">
          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-500">Correo:</span>
          <span className="text-slate-900 font-medium">{partner?.email}</span>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-4 py-2.5 text-sm shadow-sm">
          <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-slate-500">Estado:</span>
          <span
            className={`font-medium ${partner?.status === "active" ? "text-teal-600" : "text-slate-400"
              }`}
          >
            {partner?.status === "active" ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>

      {/* Cuadrícula principal: datos del negocio | horarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ── Columna izquierda: formulario de datos ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Store className="h-5 w-5 text-teal-600" />
            <h2 className="text-base font-semibold text-slate-800">Datos del negocio</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Nombre y categoría en fila */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nombre del negocio"
                placeholder="Ej: Tacos el Güero"
                error={errors.business_name?.message}
                {...register("business_name")}
              />

              <div className="flex flex-col gap-1">
                <label htmlFor="category" className="text-sm font-medium text-slate-700">
                  Categoría
                </label>
                <select
                  id="category"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-colors"
                  {...register("category")}
                >
                  {PARTNER_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-red-500">{errors.category.message}</p>
                )}
              </div>
            </div>

            <Input
              label="Nombre del encargado"
              placeholder="Ej: Juan Pérez"
              error={errors.manager_name?.message}
              {...register("manager_name")}
            />

            {/* Información de contacto */}
            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Contacto (opcional)
              </p>
              <div className="flex flex-col gap-3">
                {/* Teléfono y dirección en fila */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none mt-px" />
                    <Input
                      placeholder="Teléfono"
                      className="pl-9"
                      error={errors.phone?.message}
                      {...register("phone")}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none mt-px" />
                    <Input
                      placeholder="Dirección"
                      className="pl-9"
                      error={errors.address?.message}
                      {...register("address")}
                    />
                  </div>
                </div>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none mt-px" />
                  <Input
                    placeholder="Sitio web (https://...)"
                    className="pl-9"
                    error={errors.website?.message}
                    {...register("website")}
                  />
                </div>
              </div>
            </div>

            {/* Error del servidor */}
            {error && (
              <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">
                No se pudo guardar. Intenta de nuevo.
              </p>
            )}

            {/* Éxito */}
            {isSuccess && !isDirty && (
              <p className="text-sm text-teal-700 bg-teal-50 rounded-xl px-4 py-3">
                Cambios guardados correctamente.
              </p>
            )}

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                loading={isPending}
                disabled={!isDirty || isPending}
              >
                <Save className="w-4 h-4" />
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </div>

        {/* ── Columna derecha: horarios ── */}
        <OpeningHoursForm />
      </div>
    </div>
  );
}
