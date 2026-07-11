import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { users as seed, roleLabel, type User } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/pengguna")({
  component: PenggunaPage,
});

const roleTone = {
  admin: "destructive",
  apoteker: "info",
  kasir: "success",
  pelanggan: "default",
} as const;

function PenggunaPage() {
  const { user } = useAuth();
  const [data, setData] = useState<User[]>(seed);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      data.filter((u) => (u.name + u.username + u.email).toLowerCase().includes(q.toLowerCase())),
    [data, q],
  );

  if (user?.role !== "admin") {
    return (
      <div className="glass mx-auto mt-10 max-w-md rounded-2xl p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-warning" />
        <h2 className="mt-3 text-lg font-bold text-foreground">Akses Terbatas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hanya Administrator yang dapat mengelola pengguna.
        </p>
      </div>
    );
  }

  const toggle = (id: string) => {
    setData((d) => d.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
    toast.success("Status pengguna diperbarui");
  };

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Kelola akun staf dan hak akses berbasis peran."
        actions={
          <Button
            onClick={() => toast.info("Formulir pengguna baru (demo)")}
            className="rounded-xl"
          >
            <UserPlus className="h-4 w-4" /> Tambah Pengguna
          </Button>
        }
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari pengguna…"
        count={filtered.length}
        headers={["Nama", "Username", "Email", "Peran", "Telepon", "Aktif"]}
        empty={filtered.length === 0}
      >
        {filtered.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {u.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{u.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">{u.username}</TableCell>
            <TableCell className="text-muted-foreground">{u.email}</TableCell>
            <TableCell>
              <StatusBadge label={roleLabel[u.role]} tone={roleTone[u.role]} />
            </TableCell>
            <TableCell className="text-muted-foreground">{u.phone}</TableCell>
            <TableCell>
              <Switch checked={u.active} onCheckedChange={() => toggle(u.id)} />
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>
    </>
  );
}
