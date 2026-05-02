import Link from "next/link";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-slate-400" strokeWidth={1.5} />
      </div>

      <h1 className="text-white font-bold text-xl mb-2">Sin conexión</h1>
      <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-8">
        Necesitas conexión a internet para validar cupones y consultar tu
        dashboard. Revisa tu red e intenta de nuevo.
      </p>

      <Link
        href="/portal/validate"
        className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors"
      >
        Reintentar
      </Link>
    </div>
  );
}
