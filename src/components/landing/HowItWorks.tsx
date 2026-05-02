import { Car, Smartphone, BadgeCheck, type LucideIcon } from "lucide-react";

const STEPS: {
  number: string;
  Icon: LucideIcon;
  title: string;
  description: string;
  note?: string;
}[] = [
  {
    number: "01",
    Icon: Car,
    title: "El conductor recomienda",
    description:
      "El conductor lleva a su pasajero y muestra el código QR de Kubi pegado en su auto. El pasajero lo escanea mientras viajan.",
  },
  {
    number: "02",
    Icon: Smartphone,
    title: "El pasajero elige y genera un código",
    description:
      "Desde su celular, el pasajero ve las promociones de tu negocio, elige la que más le gusta y genera un código de validación único.",
  },
  {
    number: "03",
    Icon: BadgeCheck,
    title: "El cliente llega, tú validas",
    description:
      "El cliente llega a tu local y presenta su código. Tu staff lo ingresa en el portal Kubi y el sistema confirma el beneficio al instante.",
    note: "Al validar, se descuenta de tu saldo y el conductor recibe su comisión de inmediato — sin papeleo.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Proceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            ¿Cómo funciona?
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Tres pasos simples. Sin apps adicionales, sin hardware especial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {STEPS.map(({ number, Icon, title, description, note }, i) => (
            <div
              key={number}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-teal-100 hover:bg-teal-50/30 transition-colors"
            >
              {/* Connector line (desktop only) */}
              {i < STEPS.length - 1 && (
                <div
                  className="hidden md:block absolute top-13 left-[calc(50%+3rem)] -right-4 h-0.5 bg-linear-to-r from-teal-200 to-transparent z-10"
                  aria-hidden="true"
                />
              )}

              {/* Icon box */}
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-2xl bg-white border border-teal-100 shadow-sm flex items-center justify-center">
                  <Icon className="w-7 h-7 text-teal-600" strokeWidth={1.5} />
                </div>
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {description}
              </p>
              {note && (
                <p className="mt-3 text-xs font-medium text-teal-600 bg-teal-50 rounded-lg px-3 py-2">
                  {note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
