import { createFileRoute, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/AppShell";
import { navItems } from "@/lib/nav";

export const Route = createFileRoute("/_authed")({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { user, can } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (!user) return <Navigate to="/login" />;

  // Pengecekan Akses Berbasis Peran
  // Cari path saat ini di navigasi (exact match atau prefix jika child route)
  const navItem = navItems.find(
    (item) => pathname === item.to || pathname.startsWith(item.to + "/"),
  );

  // Jika path ada di navItems, pastikan user punya akses
  if (navItem && !can(navItem.roles)) {
    // Redirect pengguna ke rute default berdasarkan peran mereka jika tidak punya akses
    if (user.role === "pelanggan") return <Navigate to="/portal-pelanggan" />;
    return <Navigate to="/dashboard" />;
  }

  // Khusus untuk role pelanggan: cegah akses ke semua route management/utama
  if (user.role === "pelanggan" && !pathname.startsWith("/portal-pelanggan")) {
    return <Navigate to="/portal-pelanggan" />;
  }
  // Khusus untuk role pegawai: cegah akses ke portal pelanggan
  if (user.role !== "pelanggan" && pathname.startsWith("/portal-pelanggan")) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
