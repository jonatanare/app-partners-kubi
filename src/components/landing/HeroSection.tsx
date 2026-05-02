import Link from "next/link";
import { ArrowRight, ChevronDown, Zap, BadgeDollarSign, TrendingUp } from "lucide-react";

const BENEFITS = [
  { Icon: Zap, text: "Sin costos de instalación" },
  { Icon: BadgeDollarSign, text: "Empieza gratis, sin mensualidad" },
  { Icon: TrendingUp, text: "Solo pagas por conversión" },
] as const;

export function HeroSection() {
  return (
    <section className="relative bg-slate-900 pt-16 overflow-hidden">
      {/* Background gradient glow */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, #0d9488, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" aria-hidden="true" />
            <span>Plataforma de afiliados Kubi</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Convierte el tráfico de{" "}
            <span className="text-teal-400">la ciudad</span>{" "}
            en clientes en tu mesa.
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 max-w-2xl">
            Recibe pasajeros de Uber y DiDi directamente en tu local. Los
            conductores recomiendan tu negocio desde su auto — tú solo validas
            el cupón y listo.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-lg transition-colors shadow-lg shadow-teal-900/40"
            >
              Registrar mi negocio
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-600 text-slate-300 hover:bg-slate-800 font-medium text-lg transition-colors"
            >
              Ver cómo funciona
              <ChevronDown className="w-5 h-5" />
            </a>
          </div>

          {/* Benefits strip */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-6">
            {BENEFITS.map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-slate-400 text-sm">
                <Icon className="w-4 h-4 text-teal-500 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 bg-white"
        style={{ clipPath: "ellipse(55% 100% at 50% 100%)" }}
        aria-hidden="true"
      />
    </section>
  );
}
