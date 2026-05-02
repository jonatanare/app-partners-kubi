import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const PERKS = [
  "Sin costo fijo ni mensualidad",
  "Soporte por WhatsApp",
  "Cancela cuando quieras",
] as const;

export function RegistrationCTA() {
  return (
    <section className="bg-teal-600 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Launch offer badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/30 text-white text-xs font-semibold tracking-wide uppercase mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" aria-hidden="true" />
          Oferta de lanzamiento · Solo 20 cupos
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
          Recarga $300, opera con $600.
        </h2>
        <p className="text-lg text-teal-100 mb-2 max-w-xl mx-auto">
          Duplicamos tu primera recarga para los primeros 20 partners. Sin mensualidad,
          sin contrato — solo pagas cuando llega un cliente real.
        </p>
        <p className="text-sm text-teal-200/70 mb-10">
          Oferta válida únicamente para los primeros 20 registros.
        </p>

        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-teal-700 font-bold text-xl hover:bg-teal-50 transition-colors shadow-xl"
        >
          Registrar mi negocio gratis
          <ArrowRight className="w-5 h-5" />
        </Link>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          {PERKS.map((perk) => (
            <div key={perk} className="flex items-center gap-1.5 text-teal-100 text-sm">
              <Check className="w-4 h-4 text-teal-300 shrink-0" />
              {perk}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
