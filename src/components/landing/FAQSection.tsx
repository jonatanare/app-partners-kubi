"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "¿Cuándo se me cobra exactamente?",
    a: "Solo cuando un cliente llega a tu negocio y tu staff valida el código en el portal. Si nadie llega, no se descuenta nada de tu saldo. El registro, la creación de promociones y mantener tu cuenta son completamente gratuitos.",
  },
  {
    q: "¿Qué pasa si me quedo sin saldo?",
    a: "Tus promociones se pausan automáticamente y los pasajeros dejan de ver tus ofertas — pero tus datos, configuración e historial quedan guardados. En cuanto recargues tu saldo, tus promociones se reactivan solas. No pierdes nada.",
  },
  {
    q: "¿Cómo recargo mi saldo?",
    a: "Por el momento la recarga es por transferencia SPEI a la cuenta de Kubi. Una vez que confirmamos el pago (el mismo día hábil), el saldo aparece en tu portal. Estamos trabajando en recarga automática con tarjeta — estará disponible próximamente.",
  },
  {
    q: "¿Puedo pausar o eliminar mis promociones?",
    a: "Sí. Desde el portal puedes activar, pausar o eliminar cualquier promoción en cualquier momento. Si pausas, los pasajeros no verán esa oferta pero el saldo no se descuenta. Si la reactivas, vuelve a aparecer de inmediato.",
  },
  {
    q: "¿Qué son los planes de suscripción que mencionan?",
    a: "En el lanzamiento (Fase 1) todo es gratuito y puedes tener 1 promoción activa. En los próximos meses lanzaremos planes opcionales para negocios que quieran publicar varias promociones simultáneas. Nadie te obligará a cambiar de plan — puedes quedarte en Fase 1 indefinidamente.",
  },
  {
    q: "¿El conductor puede ver mi saldo o mis finanzas?",
    a: "No. El conductor solo recibe una notificación de que generó una comisión y el monto que él recibió. No tiene acceso a tu saldo, tus costos, ni ningún dato financiero de tu negocio.",
  },
  {
    q: "¿Cómo sé que los clientes que llegan son reales?",
    a: "Cada código de validación es único por viaje. El pasajero lo genera en el momento, tiene un solo uso y expira una vez validado. No se puede reutilizar ni compartir sin que el sistema lo detecte. Además, tú o tu staff validan el código manualmente antes de que cualquier cargo se procese.",
  },
] as const;

function FaqItem({
  q,
  a,
  isOpen,
  onToggle,
}: Readonly<{
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}>) {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 py-5 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-base font-semibold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
          {q}
        </span>
        <span className="mt-0.5 shrink-0 w-6 h-6 rounded-full bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center transition-colors">
          {isOpen ? (
            <Minus className="w-3.5 h-3.5 text-teal-600" />
          ) : (
            <Plus className="w-3.5 h-3.5 text-slate-500" />
          )}
        </span>
      </button>
      {isOpen && (
        <p className="pb-5 text-sm text-slate-500 leading-relaxed pr-10">
          {a}
        </p>
      )}
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <section id="preguntas-frecuentes" className="bg-slate-50 py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-semibold tracking-wide uppercase mb-4">
            Preguntas frecuentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Todo lo que necesitas saber antes de registrarte
          </h2>
          <p className="text-lg text-slate-500">
            Sin tecnicismos. Respuestas directas.
          </p>
        </div>

        {/* FAQ list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 sm:px-8">
          {FAQS.map(({ q, a }, i) => (
            <FaqItem
              key={q}
              q={q}
              a={a}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* Support nudge */}
        <p className="text-center text-sm text-slate-400 mt-8">
          ¿Tienes otra pregunta?{" "}
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP ?? ""}?text=${encodeURIComponent("Hola, tengo una pregunta sobre Kubi para negocios.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-600 font-medium hover:underline"
          >
            Escríbenos por WhatsApp →
          </a>
        </p>
      </div>
    </section>
  );
}
