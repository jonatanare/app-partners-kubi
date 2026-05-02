"use client";

import { useState } from "react";
import type { Promotion } from "@/types/api";
import type { PromotionFormData } from "@/lib/schemas/promotionSchema";
import { usePromotions } from "@/lib/hooks/usePromotions";
import {
  useCreatePromotion,
  useUpdatePromotion,
  useTogglePromotionStatus,
  useDeletePromotion,
} from "@/lib/hooks/usePromotionMutations";
import { Megaphone, Plus } from "lucide-react";
import { PromotionCard } from "./PromotionCard";
import { PromotionForm } from "./PromotionForm";
import { PromotionLeadsModal } from "./PromotionLeadsModal";
import { Button } from "@/components/ui/Button";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-slate-100 rounded" />
          <div className="h-3 w-full bg-slate-100 rounded" />
        </div>
        <div className="h-5 w-16 bg-slate-100 rounded-full ml-3" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["a", "b", "c", "d"].map((k) => (
          <div key={k} className="space-y-1">
            <div className="h-2.5 w-16 bg-slate-100 rounded" />
            <div className="h-3.5 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-1 border-t border-slate-50">
        {["a", "b", "c", "d"].map((k) => (
          <div key={k} className="h-7 w-16 bg-slate-100 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export function PromotionsList() {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const filterLabels: Record<"all" | "active" | "inactive", string> = {
    all: "Todas",
    active: "Activas",
    inactive: "Inactivas",
  };

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null
  );
  const [leadsPromo, setLeadsPromo] = useState<Promotion | null>(null);

  // Server errors from mutations
  const [formError, setFormError] = useState<string | undefined>();

  // Queries
  const { data, isLoading, error } = usePromotions(
    statusFilter === "all" ? undefined : statusFilter
  );

  // Mutations — each card manages its own toggling/deleting loading state via the hook
  const createMutation = useCreatePromotion();
  const deleteMutation = useDeletePromotion();

  const promotions = data?.promotions ?? [];

  // ── Handlers ────────────────────────────────────────────────────────────────

  const openCreate = () => {
    setEditingPromotion(null);
    setFormError(undefined);
    setFormOpen(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditingPromotion(promo);
    setFormError(undefined);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingPromotion(null);
    setFormError(undefined);
  };

  const handleFormSubmit = (data: PromotionFormData) => {
    setFormError(undefined);
    // Edit path is handled inside PromotionFormWithMutation — this only runs for creates
    createMutation.mutate(data, {
      onSuccess: () => closeForm(),
      onError: (err) => {
        setFormError(err.response?.data?.error ?? "Error al crear la promoción");
      },
    });
  };

  const handleDelete = (promo: Promotion) => {
    if (
      // eslint-disable-next-line no-alert
      !globalThis.confirm(
        `¿Eliminar "${promo.title}"? Esta acción no se puede deshacer.`
      )
    )
      return;
    deleteMutation.mutate(promo._id);
  };

  return (
    <div className="p-5 sm:p-8 max-w-2xl">
      {/* Page header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promociones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona las ofertas de tu negocio
          </p>
        </div>
        <Button variant="primary" size="md" onClick={openCreate}>
          <Plus className="w-4 h-4" />
          Nueva
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === f
                ? "bg-teal-600 text-white"
                : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
          <p className="text-red-800 font-medium mb-1">
            No se pudieron cargar las promociones
          </p>
          <p className="text-red-600 text-sm">
            Verifica tu conexión e intenta de nuevo.
          </p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && promotions.length === 0 && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-10 text-center flex flex-col items-center gap-3">
          <Megaphone className="w-10 h-10 text-slate-300" />
          <p className="text-slate-700 font-medium">Sin promociones aún</p>
          <p className="text-slate-500 text-sm">
            Crea tu primera promoción para empezar a atraer pasajeros.
          </p>
          <Button variant="primary" size="md" onClick={openCreate} className="mt-1">
            Crear primera promoción
          </Button>
        </div>
      )}

      {/* Promotions list */}
      {!isLoading && !error && promotions.length > 0 && (
        <div className="flex flex-col gap-4">
          {promotions.map((promo) => (
            <PromotionCardWithMutations
              key={promo._id}
              promotion={promo}
              onEdit={openEdit}
              onDelete={handleDelete}
              onViewLeads={(p) => setLeadsPromo(p)}
              isDeleting={
                deleteMutation.isPending &&
                deleteMutation.variables === promo._id
              }
            />
          ))}
        </div>
      )}

      {/* Create / Edit form modal */}
      <PromotionFormWithMutation
        isOpen={formOpen}
        onClose={closeForm}
        promotion={editingPromotion ?? undefined}
        serverError={formError}
        onExternalSubmit={editingPromotion ? undefined : handleFormSubmit}
        onEditSuccess={closeForm}
        onEditError={(msg) => setFormError(msg)}
      />

      {/* Leads modal */}
      <PromotionLeadsModal
        promoId={leadsPromo?._id ?? null}
        promoTitle={leadsPromo?.title ?? ""}
        onClose={() => setLeadsPromo(null)}
      />
    </div>
  );
}

// ─── Sub-component: Card with its own toggle status mutation ─────────────────

function PromotionCardWithMutations({
  promotion,
  onEdit,
  onDelete,
  onViewLeads,
  isDeleting,
}: Readonly<{
  promotion: Promotion;
  onEdit: (p: Promotion) => void;
  onDelete: (p: Promotion) => void;
  onViewLeads: (p: Promotion) => void;
  isDeleting: boolean;
}>) {
  const toggleMutation = useTogglePromotionStatus(promotion._id);

  const handleToggle = () => {
    const next = promotion.status === "active" ? "inactive" : "active";
    toggleMutation.mutate(next);
  };

  return (
    <PromotionCard
      promotion={promotion}
      onEdit={onEdit}
      onToggleStatus={handleToggle}
      onDelete={onDelete}
      onViewLeads={onViewLeads}
      isTogglingStatus={toggleMutation.isPending}
      isDeleting={isDeleting}
    />
  );
}

// ─── Sub-component: Form wired to create OR edit mutation ─────────────────────

function PromotionFormWithMutation({
  isOpen,
  onClose,
  promotion,
  serverError,
  onExternalSubmit,
  onEditSuccess,
  onEditError,
}: Readonly<{
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion;
  serverError?: string;
  onExternalSubmit?: (data: PromotionFormData) => void;
  onEditSuccess: () => void;
  onEditError: (msg: string) => void;
}>) {
  const updateMutation = useUpdatePromotion(promotion?._id ?? "");

  const handleSubmit = (data: PromotionFormData) => {
    if (promotion) {
      updateMutation.mutate(data, {
        onSuccess: () => onEditSuccess(),
        onError: (err) => {
          onEditError(err.response?.data?.error ?? "Error al guardar cambios");
        },
      });
    } else {
      onExternalSubmit?.(data);
    }
  };

  return (
    <PromotionForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      isPending={updateMutation.isPending}
      serverError={serverError}
      promotion={promotion}
    />
  );
}
