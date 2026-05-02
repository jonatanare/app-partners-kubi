import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://getkubi.app/negocios",
  },
  robots: {
    index: false,
  },
};

export default function GatewayPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1 L24 1 Q28 1 28 5 L28 21 Q28 25 24 25 L19.5 25 L16 31 L12.5 25 L8 25 Q4 25 4 21 L4 5 Q4 1 8 1 Z M7 4 L25 4 L25 22 L7 22 Z" />
            <rect x="10" y="7" width="12" height="12" rx="0.5" />
          </svg>
        </div>
        <span className="text-white font-bold text-2xl tracking-tight">kubi</span>
      </div>

      <p className="text-slate-400 text-sm mb-10">Portal para negocios</p>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Link
          href="/portal/validate"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-base transition-colors"
        >
          Iniciar sesión
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-medium text-base transition-colors"
        >
          Registrar mi negocio
        </Link>
      </div>

      {/* External link to marketing landing */}
      <a
        href="https://getkubi.app/negocios"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 text-sm text-slate-500 hover:text-teal-400 transition-colors"
      >
        ¿Qué es Kubi? →
      </a>
    </div>
  );
}

