"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ScanLine, Tag, LayoutDashboard, LogOut, Store } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { callLogout } from "@/lib/api/auth";
import { cn } from "@/lib/utils";
import type { SessionUser } from "@/types/api";

const NAV_ITEMS: { href: string; label: string; Icon: LucideIcon }[] = [
  { href: "/portal/validate", label: "Validar", Icon: ScanLine },
  { href: "/portal/promotions", label: "Promociones", Icon: Tag },
  { href: "/portal/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/portal/profile", label: "Mi negocio", Icon: Store },
];

interface PortalNavProps {
  user?: SessionUser;
}

export function PortalNav({ user }: Readonly<PortalNavProps>) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await callLogout();
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* ── Desktop sidebar ────────────────────────────────────────── */}
      <aside className="hidden sm:flex sm:flex-col w-64 min-h-screen bg-slate-900 text-white shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 h-16 border-b border-slate-800">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" aria-hidden="true">
              <path fillRule="evenodd" d="M8 1 L24 1 Q28 1 28 5 L28 21 Q28 25 24 25 L19.5 25 L16 31 L12.5 25 L8 25 Q4 25 4 21 L4 5 Q4 1 8 1 Z M7 4 L25 4 L25 22 L7 22 Z" />
              <rect x="10" y="7" width="12" height="12" rx="0.5" />
            </svg>
          </div>
          <div>
            <span className="font-bold text-white text-lg leading-none">kubi</span>
            {user?.business_name && (
              <p className="text-xs text-slate-400 truncate max-w-30">
                {user.business_name}
              </p>
            )}
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col flex-1 py-4 px-3 gap-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-teal-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-slate-800 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ──────────────────────────────────── */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 flex justify-around">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2.5 text-xs font-medium transition-colors",
                isActive ? "text-teal-600" : "text-slate-400 hover:text-slate-700"
              )}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Salir
        </button>
      </nav>
    </>
  );
}
