"use client";

import { useEffect } from "react";
import type { Lead } from "@/types/api";

interface ValidationResultProps {
  isOpen: boolean;
  type: "success" | "error";
  lead?: Lead;
  errorMessage?: string;
  onDismiss: () => void;
}

export function ValidationResult({
  isOpen,
  type,
  lead,
  errorMessage,
  onDismiss,
}: ValidationResultProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onDismiss]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-white transition-colors duration-300 ${
        isSuccess ? "bg-emerald-500" : "bg-red-500"
      }`}
      onClick={onDismiss}
      role="alertdialog"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center text-center px-8 max-w-sm">
        {isSuccess ? (
          <>
            {/* Success icon */}
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" aria-hidden="true">
                <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>

            <h2 className="text-4xl font-extrabold mb-3">¡Cupón Válido!</h2>

            {lead && (
              <div className="bg-white/20 rounded-2xl px-6 py-4 mb-6 w-full">
                <p className="text-sm font-medium opacity-80 mb-1">
                  Comisión al conductor
                </p>
                <p className="text-3xl font-bold">
                  ${lead.commission_amount.toFixed(2)}
                </p>
                <p className="text-xs opacity-70 mt-2 font-mono">
                  Código: {lead.validation_code}
                </p>
              </div>
            )}

            <p className="text-lg opacity-90 mb-8">
              Entrega el beneficio al cliente ✓
            </p>
          </>
        ) : (
          <>
            {/* Error icon */}
            <div className="w-28 h-28 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner">
              <svg viewBox="0 0 24 24" className="w-16 h-16 fill-white" aria-hidden="true">
                <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>

            <h2 className="text-4xl font-extrabold mb-3">Código Inválido</h2>
            <p className="text-lg opacity-90 mb-8">
              {errorMessage ?? "El código no existe o ya fue utilizado."}
            </p>
          </>
        )}

        <button
          className={`px-10 py-4 rounded-2xl font-bold text-xl transition-colors ${
            isSuccess
              ? "bg-white text-emerald-700 hover:bg-emerald-50"
              : "bg-white text-red-700 hover:bg-red-50"
          }`}
          onClick={onDismiss}
        >
          {isSuccess ? "Nuevo Cupón" : "Intentar de Nuevo"}
        </button>

        <p className="mt-5 text-sm opacity-60">
          Toca en cualquier lugar para cerrar
        </p>
      </div>
    </div>
  );
}
