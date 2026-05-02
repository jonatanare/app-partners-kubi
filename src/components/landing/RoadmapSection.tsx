import { Rocket, TrendingUp, Zap } from "lucide-react";

const PHASES = [
  {
    Icon: Rocket,
    tag: "Disponible ahora",
    tagColor: "bg-teal-500 text-white",
    phase: "Fase 1",
    title: "Empieza gratis",
    features: [
      "1 promoción activa incluida",
      "Wallet por consumo — solo pagas cuando hay resultado",
      "Portal web para validar códigos",
      "Dashboard con métricas en tiempo real",
      "Sin suscripción mensual",
    ],
    highlight: true,
  },
  {
    Icon: TrendingUp,
    tag: "Próximamente · 60–90 días",
    tagColor: "bg-amber-100 text-amber-700",
    phase: "Fase 2",
    title: "Planes de crecimiento",
    features: [
      "Hasta 3 o más promociones activas simultáneas",
      "Planes Starter, Growth y Pro",
      "El modelo wallet + revenue share se mantiene",
      "Métricas avanzadas por promoción",
      "Onboarding dedicado para cadenas y franquicias",
    ],
    highlight: false,
  },
  {
    Icon: Zap,
    tag: "Futuro",
    tagColor: "bg-slate-700 text-slate-300",
    phase: "Fase 3",
    title: "Automatización total",
    features: [
      "Recarga de wallet con tarjeta o SPEI en línea",
      "Auto-recarga configurable por umbral",
      "Historial de inversión y proyección de ROI",
      "API abierta para integraciones propias",
      "Acceso anticipado para partners activos de Fase 1",
    ],
    highlight: false,
  },
] as const;

export function RoadmapSection() {
  return (
    <section className="bg-slate-900 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-900/60 border border-teal-700/50 text-teal-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Hoja de ruta
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Construido para crecer contigo.
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Entra hoy sin costo. Los partners que se registran en el
            lanzamiento tendrán acceso prioritario a cada nueva fase —{" "}
            <span className="text-teal-300 font-medium">
              sin sorpresas, sin presión.
            </span>
          </p>
        </div>

        {/* Phases grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PHASES.map(({ Icon, tag, tagColor, phase, title, features, highlight }) => (
            <div
              key={phase}
              className={`relative rounded-2xl p-7 flex flex-col gap-5 border transition-all ${
                highlight
                  ? "bg-teal-600 border-teal-500 shadow-lg shadow-teal-900/40"
                  : "bg-slate-800 border-slate-700"
              }`}
            >
              {/* Tag */}
              <span
                className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${tagColor}`}
              >
                {tag}
              </span>

              {/* Icon + phase */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    highlight ? "bg-white/20" : "bg-slate-700"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${highlight ? "text-white" : "text-slate-400"}`}
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${
                      highlight ? "text-teal-200" : "text-slate-500"
                    }`}
                  >
                    {phase}
                  </p>
                  <p
                    className={`text-xl font-extrabold ${
                      highlight ? "text-white" : "text-slate-100"
                    }`}
                  >
                    {title}
                  </p>
                </div>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                        highlight ? "bg-white/25" : "bg-slate-700"
                      }`}
                      aria-hidden="true"
                    >
                      <svg viewBox="0 0 12 12" className={`w-2.5 h-2.5 ${highlight ? "fill-white" : "fill-teal-400"}`}>
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    <span
                      className={`text-sm leading-snug ${
                        highlight ? "text-teal-50" : "text-slate-400"
                      }`}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-sm text-slate-500 mt-10">
          Los planes de Fase 2 serán opcionales. Puedes quedarte en Fase 1
          indefinidamente con 1 promoción activa.
        </p>
      </div>
    </section>
  );
}
