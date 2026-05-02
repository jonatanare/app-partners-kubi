"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { couponSchema, type CouponFormData } from "@/lib/schemas/couponSchema";
import { useValidateCoupon } from "@/lib/hooks/useValidateCoupon";
import { ValidationResult } from "./ValidationResult";
import type { AxiosError } from "axios";
import type { ApiErrorBody } from "@/types/api";

function getValidationErrorMessage(
  error: AxiosError<ApiErrorBody> | null
): string {
  if (error?.response?.status === 402) {
    return "Saldo insuficiente. Por favor, recarga tu wallet.";
  }
  return error?.response?.data?.error ?? "Código inválido o ya utilizado";
}

export function ValidatorScreen() {
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, data, error, isPending, isSuccess, isError, reset } =
    useValidateCoupon();

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
  });

  // Auto-focus input on mount and after result dismissal
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = (formData: CouponFormData) => {
    mutate(formData.validation_code);
  };

  const handleDismiss = () => {
    reset();
    resetForm();
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Extract the input ref from react-hook-form while keeping our own ref
  const { ref: rhfRef, onChange, ...registerRest } = register("validation_code");

  return (
    <div className="pwa-portal flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] px-4 py-8 bg-slate-50">
      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center mx-auto mb-3">
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 fill-teal-600"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M8 1 L24 1 Q28 1 28 5 L28 21 Q28 25 24 25 L19.5 25 L16 31 L12.5 25 L8 25 Q4 25 4 21 L4 5 Q4 1 8 1 Z M7 4 L25 4 L25 22 L7 22 Z" />
              <rect x="10" y="7" width="12" height="12" rx="0.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Validar Cupón</h1>
          <p className="text-sm text-slate-500 mt-1">
            Ingresa el código del pasajero
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
          <input
            {...registerRest}
            ref={(el) => {
              rhfRef(el);
              (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase().replace(/[^A-F0-9]/g, "");
              onChange(e);
            }}
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={6}
            placeholder="A1B2C3"
            className="w-full text-center text-5xl font-mono font-bold tracking-[0.3em] border-2 border-slate-200 rounded-2xl py-5 px-4 text-slate-900 placeholder:text-slate-200 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/15 transition-all uppercase"
            aria-label="Código de validación"
          />

          {errors.validation_code && (
            <p className="text-center text-sm text-red-500">
              {errors.validation_code.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-5 rounded-2xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-2xl font-bold transition-colors disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-teal-500/40 shadow-lg shadow-teal-600/20"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="h-6 w-6 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Validando…
              </span>
            ) : (
              "Validar Cupón"
            )}
          </button>
        </form>
      </div>

      {/* Result overlay */}
      <ValidationResult
        isOpen={isSuccess || isError}
        type={isSuccess ? "success" : "error"}
        lead={data?.lead}
        errorMessage={getValidationErrorMessage(error)}
        onDismiss={handleDismiss}
      />
    </div>
  );
}
