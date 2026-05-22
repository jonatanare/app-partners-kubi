"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import {
  registerSchema,
  type RegisterFormData,
} from "@/lib/schemas/registerSchema";
import { callRegister } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertTriangle, MapPin, Map } from "lucide-react";

const CATEGORIES = [
  { value: "restaurant", label: "Restaurante" },
  { value: "bar", label: "Bar / Cantina" },
  { value: "cafe", label: "Café / Cafetería" },
  { value: "tour", label: "Tour / Experiencia" },
  { value: "other", label: "Otro" },
] as const;

const STEP_FIELDS: Record<number, (keyof RegisterFormData)[]> = {
  1: ["business_name", "category", "manager_name"],
  2: ["email", "password"],
  3: ["location"],
};

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [locating, setLocating] = useState(false);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    getValues,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const locationValue = watch("location");

  // ── Navigation ────────────────────────────────────────────────────────────
  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  };

  const goBack = () => setStep((s) => s - 1);

  // ── Geolocation capture ──────────────────────────────────────────────────
  const captureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta geolocalización.");
      return;
    }

    setLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords;
        setValue(
          "location",
          { type: "Point", coordinates: [longitude, latitude] },
          { shouldValidate: true }
        );
        setLocationLabel(
          `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
        );
        setLocating(false);
      },
      () => {
        setLocationError(
          "No se pudo obtener la ubicación. Activa el GPS y vuelve a intentarlo."
        );
        setLocating(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await callRegister({
        business_name: data.business_name,
        category: data.category,
        manager_name: data.manager_name,
        email: data.email,
        password: data.password,
        contact_info: {
          phone: data.phone,
          address: data.address,
          website: data.website,
        },
        location: data.location,
      });
      router.push("/portal/validate");
      router.refresh();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? "Error al registrar el negocio")
        : "Error inesperado";
      setError("root", { message });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div
              className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                n <= step ? "bg-teal-600" : "bg-slate-200"
              }`}
            />
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ── Step 1: Business info ─────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Información del negocio
            </h2>

            <Input
              label="Nombre del negocio"
              placeholder="Café Central"
              error={errors.business_name?.message}
              {...register("business_name")}
            />

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">
                Categoría
              </label>
              <select
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 bg-white border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                  errors.category ? "border-red-400" : ""
                }`}
                {...register("category")}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category.message}</p>
              )}
            </div>

            <Input
              label="Nombre del gerente / dueño"
              placeholder="Ana García"
              error={errors.manager_name?.message}
              {...register("manager_name")}
            />

            <Button type="button" size="lg" className="w-full mt-2" onClick={goNext}>
              Continuar →
            </Button>
          </div>
        )}

        {/* ── Step 2: Account + contact ──────────────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Cuenta y datos de contacto
            </h2>

            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="negocio@ejemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              helperText="Mínimo 8 caracteres"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500 mb-3">
                Información de contacto (opcional)
              </p>
              <div className="flex flex-col gap-3">
                <Input
                  label="Teléfono"
                  type="tel"
                  placeholder="+506 2222-3333"
                  {...register("phone")}
                />
                <Input
                  label="Dirección"
                  placeholder="Av. Central 123, San José"
                  {...register("address")}
                />
                <Input
                  label="Sitio web"
                  type="url"
                  placeholder="https://mubrestnegocio.com"
                  {...register("website")}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={goBack}
              >
                ← Atrás
              </Button>
              <Button
                type="button"
                size="lg"
                className="flex-1"
                onClick={goNext}
              >
                Continuar →
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Geolocation ────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Ubicación del negocio
            </h2>
            <p className="text-sm text-slate-500">
              Tu ubicación permite que los pasajeros cercanos vean tus
              promociones en el momento correcto.
            </p>

            <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-amber-800">
                  Debes estar en tu local físico
                </p>
                <p className="text-xs text-amber-700">
                  Captura la ubicación desde el establecimiento, no desde tu
                  casa u otro lugar. Los pasajeros verán tu negocio en el mapa
                  según las coordenadas registradas aquí.
                </p>
              </div>
            </div>

            <div
              className={`rounded-2xl border-2 p-6 text-center flex flex-col items-center gap-3 transition-colors duration-300 ${
                locationValue
                  ? "border-teal-400 bg-teal-50"
                  : "border-dashed border-slate-200"
              }`}
            >
              {locationValue ? (
                <>
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-teal-100">
                    <MapPin className="w-7 h-7 text-teal-600" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-base font-semibold text-teal-700">
                      ¡Ubicación capturada!
                    </p>
                    <p className="text-xs text-teal-600">
                      Tu local quedó registrado correctamente.
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 font-mono bg-white border border-slate-200 rounded-lg px-3 py-1.5">
                    {locationLabel}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={captureLocation}
                  >
                    Volver a capturar
                  </Button>
                </>
              ) : (
                <>
                  <Map className="w-10 h-10 text-slate-300" />
                  <p className="text-sm text-slate-600">
                    Presiona para detectar tu ubicación actual
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    loading={locating}
                    onClick={captureLocation}
                    className="px-6"
                  >
                    {locating ? "Detectando..." : "Detectar mi ubicación"}
                  </Button>
                </>
              )}
            </div>

            {locationError && (
              <p className="text-sm text-red-500 text-center">{locationError}</p>
            )}
            {errors.location && (
              <p className="text-sm text-red-500 text-center">
                La ubicación es requerida para continuar.
              </p>
            )}

            {errors.root && (
              <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-200">
                {errors.root.message}
              </p>
            )}

            <div className="flex gap-3 mt-1">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={goBack}
              >
                ← Atrás
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                loading={isSubmitting}
                disabled={!locationValue}
              >
                Registrar negocio
              </Button>
            </div>
          </div>
        )}
      </form>

      <p className="text-center text-sm text-slate-500">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-teal-600 hover:underline font-medium">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
