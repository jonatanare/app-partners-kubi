"use client";

import { useState } from "react";
import type { Lead } from "@/types/api";
import { Modal } from "@/components/ui/Modal";
import { X, CheckCircle2, Clock } from "lucide-react";
import { usePromotionLeads } from "@/lib/hooks/usePromotionLeads";

interface PromotionLeadsModalProps {
  promoId: string | null;
  promoTitle: string;
  onClose: () => void;
}

function LeadRow({ lead }: Readonly<{ lead: Lead }>) {
  const driver =
    typeof lead.driver_id === "object" ? lead.driver_id : null;

  const date = new Date(lead.updatedAt).toLocaleDateString("es-CR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex items-start justify-between py-3.5 border-b border-slate-50 last:border-0 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-mono font-semibold text-slate-800 tracking-widest">
          {lead.validation_code}
        </p>
        {driver && (
          <p className="text-xs text-slate-500 mt-0.5 truncate">
            {driver.name} · {driver.phone}
          </p>
        )}
        <p className="text-xs text-slate-400 mt-0.5">{date}</p>
      </div>
      <div className="text-right shrink-0">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            lead.status === "completed"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {lead.status === "completed" ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {lead.status === "completed" ? "Validado" : "Pendiente"}
        </span>
        {lead.status === "completed" ? (
          <p className="text-xs text-slate-400 mt-1">
            Conductor: ${lead.driver_amount.toFixed(2)}
          </p>
        ) : (
          <p className="text-xs text-slate-400 mt-1">
            ${lead.commission_amount.toFixed(2)} esperado
          </p>
        )}
      </div>
    </div>
  );
}

export function PromotionLeadsModal({
  promoId,
  promoTitle,
  onClose,
}: Readonly<PromotionLeadsModalProps>) {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "completed"
  >("all");

  const filterLabels: Record<"all" | "pending" | "completed", string> = {
    all: "Todos",
    pending: "Pendientes",
    completed: "Validados",
  };

  const { data, isLoading, error } = usePromotionLeads(
    promoId,
    statusFilter === "all" ? undefined : statusFilter
  );

  const leads = data?.leads ?? [];

  return (
    <Modal isOpen={promoId !== null} onClose={onClose} className="max-h-[85dvh] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <div className="min-w-0">
          <h2 className="text-base font-bold text-slate-900">Leads</h2>
          <p className="text-xs text-slate-500 truncate">{promoTitle}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 shrink-0 ml-3"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 px-6 py-3 border-b border-slate-100 shrink-0">
        {(["all", "pending", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === f
                ? "bg-teal-600 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Lead list */}
      <div className="flex-1 overflow-y-auto px-6">
        {isLoading && (
          <div className="flex justify-center py-12">
            <svg
              className="h-6 w-6 animate-spin text-teal-500"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}
        {error && (
          <p className="py-8 text-center text-sm text-red-500">
            No se pudieron cargar los leads.
          </p>
        )}
        {!isLoading && !error && leads.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-400">
            Sin leads para este filtro aún
          </p>
        )}
        {!isLoading &&
          !error &&
          leads.map((lead) => <LeadRow key={lead._id} lead={lead} />)}
      </div>

      {/* Footer count */}
      {!isLoading && !error && leads.length > 0 && (
        <div className="px-6 py-3 border-t border-slate-100 shrink-0">
          <p className="text-xs text-slate-400 text-center">
            {leads.length} lead{leads.length === 1 ? "" : "s"}
          </p>
        </div>
      )}
    </Modal>
  );
}
