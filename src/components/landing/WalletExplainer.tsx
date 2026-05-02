import { Banknote, Tag, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    Icon: Banknote,
    step: "01",
    title: "Carga tu presupuesto",
    description:
      "Transfiere vía SPEI el monto que quieras invertir. El equipo de Kubi lo acredita en tu cuenta el mismo día hábil.",
    note: "Sin mínimos. Empieza desde lo que necesites.",
  },
  {
    Icon: Tag,
    step: "02",
    title: "Tú defines el valor de cada visita",
    description:
      "Al crear una promoción decides cuánto vale que un pasajero llegue a tu negocio. Puedes ajustarlo en cualquier momento.",
    note: "Ejemplo: $10 MXN por cada cliente que llegue validado.",
  },
  {
    Icon: ShieldCheck,
    step: "03",
    title: "Solo se descuenta cuando hay resultado",
    description:
      "Nada se cobra al crear la promo. Tu saldo se consume únicamente cuando un cliente llega y tu staff valida el código en el portal.",
    note: "Sin visita confirmada = sin costo.",
  },
] as const;

export function WalletExplainer() {
  return (
    <section id="presupuesto" className="bg-slate-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Tu presupuesto
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Funciona como tu cuenta de Google Ads,{" "}
            <span className="text-teal-600">pero para tu local.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Cargas un saldo una vez. La plataforma lo consume solo cuando llega
            un cliente real. Sin costos fijos, sin sorpresas.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {STEPS.map(({ Icon, step, title, description, note }, i) => (
            <div
              key={step}
              className="relative bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:border-teal-100 hover:shadow-md transition-all"
            >
              {/* Step number connector (desktop) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-10 left-[calc(100%-1px)] w-8 h-0.5 bg-linear-to-r from-teal-200 to-transparent z-10"
                  aria-hidden="true"
                />
              )}

              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-teal-600" strokeWidth={1.75} />
                </div>
                <span className="text-3xl font-extrabold text-slate-100 leading-none mt-1">
                  {step}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {description}
              </p>
              <p className="text-xs font-medium text-teal-600 bg-teal-50 rounded-lg px-3 py-2">
                {note}
              </p>
            </div>
          ))}
        </div>

        {/* SPEI note */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
            Recarga mínima: sin mínimo
          </div>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">·</span>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
            Transferencia SPEI — acreditación el mismo día hábil
          </div>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">·</span>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
            Saldo nunca expira
          </div>
        </div>
      </div>
    </section>
  );
}
