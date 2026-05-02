import type { Metadata } from "next";
import { DashboardMetrics } from "@/components/portal/DashboardMetrics";
import { OnboardingChecklist } from "@/components/portal/OnboardingChecklist";

export const metadata: Metadata = {
  title: "Dashboard — Kubi Partners",
};

export default function DashboardPage() {
  return (
    <div className="p-5 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Métricas de tu negocio en Kubi
        </p>
      </div>
      <OnboardingChecklist />
      <DashboardMetrics />
    </div>
  );
}
