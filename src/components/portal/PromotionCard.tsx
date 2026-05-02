"use client";

import type { Promotion } from "@/types/api";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Eye, Pencil, PauseCircle, PlayCircle, Trash2 } from "lucide-react";

interface PromotionCardProps {
  promotion: Promotion;
  onEdit: (promotion: Promotion) => void;
  onToggleStatus: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
  onViewLeads: (promotion: Promotion) => void;
  isTogglingStatus?: boolean;
  isDeleting?: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-CR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function PromotionCard({
  promotion,
  onEdit,
  onToggleStatus,
  onDelete,
  onViewLeads,
  isTogglingStatus,
  isDeleting,
}: Readonly<PromotionCardProps>) {
  const isActive = promotion.status === "active";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2">
            {promotion.title}
          </h3>
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
            {promotion.description}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full",
              isActive ? "bg-emerald-400" : "bg-slate-400"
            )}
          />
          {isActive ? "Activa" : "Inactiva"}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
        <div>
          <p className="text-slate-400">Beneficio</p>
          <p className="text-slate-700 font-medium truncate">
            {promotion.reward_value}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Comisión / lead</p>
          <p className="text-slate-700 font-medium">
            ${promotion.commission_per_lead.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-slate-400">Válida desde</p>
          <p className="text-slate-700">{formatDate(promotion.valid_from)}</p>
        </div>
        <div>
          <p className="text-slate-400">Válida hasta</p>
          <p className="text-slate-700">{formatDate(promotion.valid_until)}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewLeads(promotion)}
          className="text-slate-600"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ver leads</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(promotion)}
          className="text-slate-600"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={isTogglingStatus}
          onClick={() => onToggleStatus(promotion)}
          className={cn(
            isActive ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"
          )}
        >
          {isActive ? (
            <PauseCircle className="w-3.5 h-3.5" />
          ) : (
            <PlayCircle className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isActive ? "Desactivar" : "Activar"}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          loading={isDeleting}
          onClick={() => onDelete(promotion)}
          className="text-red-500 hover:bg-red-50 ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Eliminar</span>
        </Button>
      </div>
    </div>
  );
}
