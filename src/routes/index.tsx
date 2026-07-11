import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  // Arahkan ke portal pelanggan jika rolenya adalah pelanggan
  if (user.role === "pelanggan") return <Navigate to="/portal-pelanggan" />;

  return <Navigate to="/dashboard" />;
}
