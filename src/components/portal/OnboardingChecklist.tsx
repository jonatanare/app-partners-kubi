"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Wallet, Megaphone, QrCode, X, ChevronRight } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { getSupportWhatsAppUrl } from "@/lib/config";

const STORAGE_KEY = "kubi_onboarding_done";

interface Step {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  cta: React.ReactNode;
  isDone: boolean;
}

export function OnboardingChecklist() {
  const queryClient = useQueryClient();
  const { data } = useDashboard();
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  // Read localStorage only on client to avoid SSR mismatch
  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  // Always fetch fresh data when checklist mounts so steps reflect
  // the latest state without requiring a manual page reload.
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["partner", "dashboard"] });
  }, [queryClient]);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  // Don't render until we know the localStorage state
  if (dismissed === null) return null;
  if (dismissed) return null;

  const walletBalance = data?.wallet_balance ?? 0;
  const activePromotions = data?.active_promotions ?? 0;
  const completedLeads = data?.completed_leads ?? 0;

  const whatsappUrl = getSupportWhatsAppUrl(
    "Hola, quiero recargar mi wallet para empezar a usar Kubi."
  );

  const allDone = walletBalance > 0 && activePromotions > 0 && completedLeads > 0;

  const steps: Step[] = [
    {
      id: "wallet",
      icon: Wallet,
      title: "Recarga tu wallet",
      description:
        "Sin saldo, tus promociones no pueden pagar comisiones. Recarga vía SPEI — el equipo de Kubi lo acredita el mismo día hábil.",
      isDone: walletBalance > 0,
      cta: whatsappUrl ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
        >
          Solicitar recarga por WhatsApp
          <ChevronRight className="w-3.5 h-3.5" />
        </a>
      ) : null,
    },
    {
      id: "promotion",
      icon: Megaphone,
      title: "Crea tu primera promoción",
      description:
        "Define qué ofreces a los pasajeros y cuánto vale cada visita. Solo toma 2 minutos.",
      isDone: activePromotions > 0,
      cta: (
        <Link
          href="/portal/promotions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
        >
          Ir a Promociones
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
    {
      id: "validate",
      icon: QrCode,
      title: "Valida tu primer código",
      description:
        "Cuando llegue un cliente, ingresa su código en la pantalla de validación. Solo toma 5 segundos.",
      isDone: completedLeads > 0,
      cta: (
        <Link
          href="/portal/validate"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-800 transition-colors"
        >
          Ver pantalla de validación
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      ),
    },
  ];

  const completedCount = steps.filter((s) => s.isDone).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Primeros pasos
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {completedCount} de {steps.length} completados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress bar */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-slate-400">
              {Math.round((completedCount / steps.length) * 100)}%
            </span>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            aria-label="Cerrar guía de inicio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-50">
        {steps.map(({ id, icon: Icon, title, description, cta, isDone }) => (
          <div
            key={id}
            className={`flex items-start gap-4 px-5 py-4 transition-colors ${
              isDone ? "opacity-50" : ""
            }`}
          >
            {/* Status icon */}
            <div className="mt-0.5 shrink-0">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-teal-500" />
              ) : (
                <Circle className="w-5 h-5 text-slate-300" />
              )}
            </div>

            {/* Icon + content */}
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isDone ? "bg-teal-50" : "bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isDone ? "text-teal-500" : "text-slate-400"}`}
                  strokeWidth={1.75}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold mb-0.5 ${
                    isDone ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  {title}
                </p>
                {!isDone && (
                  <>
                    <p className="text-xs text-slate-500 leading-relaxed mb-2">
                      {description}
                    </p>
                    {cta}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer dismiss */}
      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {allDone
            ? "¡Todo listo! Ya puedes recibir clientes."
            : "Completa los pasos para recibir tus primeros clientes."}
        </p>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
        >
          Ya entendí, no mostrar más
        </button>
      </div>
    </div>
  );
}
