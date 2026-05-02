import { getSession } from "@/lib/session";
import { PortalNav } from "@/components/portal/PortalNav";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already redirected unauthenticated users.
  // Read session here only to pass user data to the nav.
  const session = await getSession();

  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-slate-50">
      <PortalNav user={session?.user} />
      <main className="flex-1 overflow-y-auto pb-16 sm:pb-0">{children}</main>
    </div>
  );
}
