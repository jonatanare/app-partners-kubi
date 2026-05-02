"use client";

import type { ElementType } from "react";
import { Megaphone, Users, CheckCircle2, CircleDollarSign, Clock, Wallet, MessageCircle } from "lucide-react";
import { useDashboard } from "@/lib/hooks/useDashboard";
import type { PromotionDashboardItem } from "@/types/api";
import { LOW_WALLET_THRESHOLD, getSupportWhatsAppUrl } from "@/lib/config";

function MetricCard({
  title,
  value,
  Icon,
  color = "teal",
}: Readonly<{
  title: string;
  value: string | number;
  Icon: ElementType;
  color?: "teal" | "blue" | "amber" | "emerald";
}>) {
  const colorMap = {
    teal: "bg-teal-50 text-teal-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-sm text-slate-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse">
      <div className="w-10 h-10 rounded-xl bg-slate-100 mb-3" />
      <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
      <div className="h-8 w-16 bg-slate-100 rounded" />
    </div>
  );
}

function WalletBalanceCard({ balance }: Readonly<{ balance: number }>) {
  const isLow = balance < LOW_WALLET_THRESHOLD;
  const whatsappUrl = getSupportWhatsAppUrl(
    "Hola, me gustaría recargar mi wallet en la plataforma Kubi."
  );

  return (
    <div
      className={`col-span-2 rounded-2xl p-5 shadow-sm border flex items-center justify-between gap-4 ${
        isLow
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-slate-100"
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isLow ? "bg-amber-100 text-amber-600" : "bg-teal-50 text-teal-600"
          }`}
        >
          <Wallet className="w-5 h-5" />
        </div>
        <div>
          <p className={`text-sm mb-0.5 ${ isLow ? "text-amber-700" : "text-slate-500" }`}>
            Saldo disponible
          </p>
          <p className={`text-3xl font-bold ${ isLow ? "text-amber-800" : "text-slate-900" }`}>
            ${balance.toFixed(2)}
          </p>
        </div>
      </div>

      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shrink-0 transition-colors ${
            isLow
              ? "bg-amber-500 hover:bg-amber-600 text-white"
              : "bg-teal-600 hover:bg-teal-700 text-white"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Solicitar recarga
        </a>
      )}
    </div>
  );
}

function PromoRow({ promo }: Readonly<{ promo: PromotionDashboardItem }>) {
  const conversionRate =
    promo.total_leads > 0
      ? Math.round((promo.completed_leads / promo.total_leads) * 100)
      : 0;

  return (
    <div className="flex items-start justify-between py-4 border-b border-slate-50 last:border-0 gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`inline-block w-2 h-2 rounded-full shrink-0 ${
              promo.status === "active" ? "bg-emerald-400" : "bg-slate-300"
            }`}
          />
          <p className="text-sm font-medium text-slate-800 truncate">
            {promo.title}
          </p>
        </div>
        <p className="text-xs text-slate-400 ml-4">
          {promo.total_leads} leads · {conversionRate}% conversión
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-900">
          ${promo.total_commission_paid.toFixed(2)}
        </p>
        <p className="text-xs text-slate-400">
          {promo.pending_leads} pendientes
        </p>
      </div>
    </div>
  );
}

export function DashboardMetrics() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse h-20" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 animate-pulse h-48" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-800 font-medium mb-1">
          No se pudo cargar el dashboard
        </p>
        <p className="text-red-600 text-sm">
          Verifica tu conexión e intenta de nuevo.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet balance + top-up CTA */}
      <div className="grid grid-cols-2 gap-4">
        <WalletBalanceCard balance={data?.wallet_balance ?? 0} />
      </div>

      {/* Low-balance alert */}
      {(data?.wallet_balance ?? 0) < LOW_WALLET_THRESHOLD && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
          <Wallet className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            Tu saldo disponible es bajo. Recarga para que los pasajeros puedan
            seguir generando leads.
          </p>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Promos activas"
          value={data?.active_promotions ?? 0}
          Icon={Megaphone}
          color="teal"
        />
        <MetricCard
          title="Leads totales"
          value={data?.total_leads ?? 0}
          Icon={Users}
          color="blue"
        />
        <MetricCard
          title="Leads validados"
          value={data?.completed_leads ?? 0}
          Icon={CheckCircle2}
          color="emerald"
        />
        <MetricCard
          title="Comisiones pagadas"
          value={`$${(data?.total_commission_paid ?? 0).toFixed(2)}`}
          Icon={CircleDollarSign}
          color="amber"
        />
      </div>

      {/* Pending leads info */}
      {(data?.pending_leads ?? 0) > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3">
          <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{data!.pending_leads}</span> leads
            pendientes de validación
          </p>
        </div>
      )}

      {/* Promotions breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800 text-sm">
            Desglose por promoción
          </h3>
          <span className="text-xs text-slate-400">
            {data?.active_promotions ?? 0} activas ·{" "}
            {data?.inactive_promotions ?? 0} inactivas
          </span>
        </div>
        <div className="px-5">
          {data?.promotions && data.promotions.length > 0 ? (
            data.promotions.map((promo) => (
              <PromoRow key={promo.promo_id} promo={promo} />
            ))
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">
              Sin promociones registradas aún
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

