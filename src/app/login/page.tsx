import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Iniciar sesión — Kubi Partners",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center">
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white" aria-hidden="true">
            <path fillRule="evenodd" d="M8 1 L24 1 Q28 1 28 5 L28 21 Q28 25 24 25 L19.5 25 L16 31 L12.5 25 L8 25 Q4 25 4 21 L4 5 Q4 1 8 1 Z M7 4 L25 4 L25 22 L7 22 Z" />
            <rect x="10" y="7" width="12" height="12" rx="0.5" />
          </svg>
        </div>
        <span className="text-slate-900 font-bold text-2xl">kubi</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
        <h1 className="text-xl font-bold text-slate-900 mb-1">Bienvenido de vuelta</h1>
        <p className="text-sm text-slate-500 mb-6">
          Ingresa a tu portal de negocios Kubi
        </p>
        {/* Suspense is required because LoginForm reads useSearchParams() */}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
