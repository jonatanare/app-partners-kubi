import { DollarSign, Car, Building2 } from "lucide-react";

const EXAMPLE_AMOUNT = 10;
const DRIVER_PCT = 0.85;
const PLATFORM_PCT = 0.15;

const driverAmount = (EXAMPLE_AMOUNT * DRIVER_PCT).toFixed(2);
const platformAmount = (EXAMPLE_AMOUNT * PLATFORM_PCT).toFixed(2);

const CARDS = [
  {
    Icon: DollarSign,
    label: "Tú decides",
    value: `$${EXAMPLE_AMOUNT.toFixed(2)} MXN`,
    sublabel: "por cada visita validada",
    description:
      "Tú fijas cuánto vale cada cliente que llega a tu negocio. Lo puedes cambiar en cualquier momento desde el portal.",
    color: "teal",
  },
  {
    Icon: Car,
    label: "El conductor recibe",
    value: `$${driverAmount} MXN`,
    sublabel: "85% de tu comisión",
    description:
      "El conductor que recomendó tu negocio recibe el 85% directamente. Por eso tienen un incentivo real de enviarte clientes.",
    color: "emerald",
  },
  {
    Icon: Building2,
    label: "Kubi retiene",
    value: `$${platformAmount} MXN`,
    sublabel: "15% como costo de plataforma",
    description:
      "El 15% cubre la operación de la plataforma: tecnología, soporte y la red de conductores que trae los clientes.",
    color: "slate",
  },
] as const;

const COLOR_MAP = {
  teal: {
    bg: "bg-teal-50",
    icon: "text-teal-600",
    badge: "bg-teal-100 text-teal-800",
    border: "border-teal-100",
  },
  emerald: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-100",
  },
  slate: {
    bg: "bg-slate-50",
    icon: "text-slate-500",
    badge: "bg-slate-100 text-slate-600",
    border: "border-slate-200",
  },
};

export function PricingTransparency() {
  return (
    <section id="precios" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Transparencia total
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Precios claros. Sin letra pequeña.
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Sabes exactamente a dónde va cada peso antes de registrarte.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {CARDS.map(({ Icon, label, value, sublabel, description, color }) => {
            const styles = COLOR_MAP[color];
            return (
              <div
                key={label}
                className={`rounded-2xl border ${styles.border} p-7 flex flex-col gap-4`}
              >
                <div className={`w-11 h-11 rounded-xl ${styles.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${styles.icon}`} strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 leading-none mb-1">
                    {value}
                  </p>
                  <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${styles.badge}`}>
                    {sublabel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Visual example bar */}
        <div className="max-w-2xl mx-auto bg-slate-50 rounded-2xl border border-slate-100 p-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 text-center">
            Ejemplo con $10.00 MXN por visita
          </p>

          {/* Bar */}
          <div className="flex rounded-xl overflow-hidden h-10 mb-4">
            <div
              className="bg-emerald-400 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "85%" }}
            >
              85% conductor
            </div>
            <div
              className="bg-teal-600 flex items-center justify-center text-white text-xs font-bold"
              style={{ width: "15%" }}
            >
              15%
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-600">
              Conductor recibe{" "}
              <strong className="text-slate-900">${driverAmount}</strong>
            </span>
            <span className="text-slate-600">
              Kubi retiene{" "}
              <strong className="text-slate-900">${platformAmount}</strong>
            </span>
          </div>

          <p className="mt-4 text-center text-sm text-slate-500">
            Si <strong>no hay visita validada</strong>, no se descuenta nada.{" "}
            <strong>$0.00 MXN.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
