import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TriangleAlert, PackageX, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { medicines } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/stok-alert")({
  component: StokAlertPage,
});

function daysUntil(date: string) {
  return Math.round((new Date(date).getTime() - new Date("2025-07-08").getTime()) / 86400000);
}

function StokAlertPage() {
  const [q, setQ] = useState("");
  const low = medicines.filter((m) => m.stock <= m.minStock);
  const out = medicines.filter((m) => m.stock === 0);
  const expiring = medicines.filter((m) => daysUntil(m.expiry) < 120);

  const alerts = useMemo(() => {
    const set = [...new Set([...low, ...expiring])];
    return set.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()));
  }, [q, low, expiring]);

  return (
    <>
      <PageHeader title="Peringatan Stok" description="Obat yang perlu segera ditindaklanjuti." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Stok Menipis"
          value={`${low.length}`}
          icon={TriangleAlert}
          tone="warning"
        />
        <StatCard label="Stok Habis" value={`${out.length}`} icon={PackageX} tone="destructive" />
        <StatCard
          label="Akan Kadaluarsa"
          value={`${expiring.length}`}
          icon={CalendarClock}
          tone="info"
        />
      </div>

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari obat…"
        count={alerts.length}
        headers={["Nama Obat", "Kategori", "Stok", "Kadaluarsa", "Peringatan", "Aksi"]}
        empty={alerts.length === 0}
      >
        {alerts.map((m) => {
          const d = daysUntil(m.expiry);
          const stockWarn = m.stock === 0 ? "Habis" : m.stock <= m.minStock ? "Menipis" : null;
          const expWarn = d < 120 ? `${d} hari lagi` : null;
          return (
            <TableRow key={m.id}>
              <TableCell className="font-medium text-foreground">{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.category}</TableCell>
              <TableCell>
                <StatusBadge
                  label={`${m.stock} ${m.unit}`}
                  tone={m.stock === 0 ? "destructive" : "warning"}
                />
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(m.expiry).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </TableCell>
              <TableCell className="space-x-1">
                {stockWarn && <StatusBadge label={stockWarn} tone="warning" />}
                {expWarn && <StatusBadge label={expWarn} tone="info" />}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-lg"
                  onClick={() => toast.success(`Pesanan ${m.name} dibuat`)}
                >
                  Pesan
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TablePanel>
    </>
  );
}
