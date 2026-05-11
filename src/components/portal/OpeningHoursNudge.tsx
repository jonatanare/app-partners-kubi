"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, X, ChevronRight } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";

const STORAGE_KEY = "kubi_opening_hours_nudge_dismissed";

export function OpeningHoursNudge() {
  const { data: profile, isLoading } = useProfile();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  // Leer localStorage solo en cliente para evitar desajuste de hidratación
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  // No renderizar hasta conocer el estado del localStorage ni mientras carga
  if (dismissed === null || isLoading) return null;
  // Ya descartado
  if (dismissed) return null;
  // Ya configuró horarios — no mostrar
  if (profile?.opening_hours) return null;

  return (
    <div className="flex items-start gap-4 bg-white rounded-2xl border border-amber-200 shadow-sm px-5 py-4 mb-6">
      {/* Ícono */}
      <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
        <Clock className="w-5 h-5 text-amber-500" strokeWidth={1.75} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 mb-0.5">
          Configura tus horarios de atención
        </p>
        <p className="text-xs text-slate-500 leading-relaxed mb-2.5">
          Los pasajeros ven si tu negocio está abierto antes de salir. Negocios
          con horarios configurados reciben más visitas y leads.
        </p>
        <Link
          href="/portal/profile"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
        >
          Configurar ahora
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Botón de cerrar */}
      <button
        type="button"
        onClick={handleDismiss}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors shrink-0"
        aria-label="Cerrar aviso de horarios"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
