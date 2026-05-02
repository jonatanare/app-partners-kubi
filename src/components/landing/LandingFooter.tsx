export function LandingFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
            <svg
              viewBox="0 0 32 32"
              className="w-4 h-4 fill-white"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d="M8 1 L24 1 Q28 1 28 5 L28 21 Q28 25 24 25 L19.5 25 L16 31 L12.5 25 L8 25 Q4 25 4 21 L4 5 Q4 1 8 1 Z M7 4 L25 4 L25 22 L7 22 Z" />
              <rect x="10" y="7" width="12" height="12" rx="0.5" />
            </svg>
          </div>
          <span className="text-white font-bold">kubi</span>
        </div>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Kubi. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
