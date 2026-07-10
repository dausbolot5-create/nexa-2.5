import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { StatCard } from "@/components/StatCard";
import { TableCell, TableRow } from "@/components/ui/table";
import { prescriptions, formatRupiah } from "@/lib/mockData";
import { Clock, Loader, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authed/resep")({
  component: ResepPage,
});

const toneByStatus = { menunggu: "warning", diproses: "info", selesai: "success" } as const;

function ResepPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      prescriptions.filter((p) =>
        (p.code + p.patient + p.doctor).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  const count = (s: string) => prescriptions.filter((p) => p.status === s).length;

  return (
    <>
      <PageHeader title="Resep" description="Kelola resep dokter dan status penebusannya." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Menunggu" value={`${count("menunggu")}`} icon={Clock} tone="warning" />
        <StatCard label="Diproses" value={`${count("diproses")}`} icon={Loader} tone="info" />
        <StatCard
          label="Selesai"
          value={`${count("selesai")}`}
          icon={CheckCircle2}
          tone="success"
        />
      </div>

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari kode, pasien, dokter…"
        count={filtered.length}
        headers={["Kode Resep", "Pasien", "Dokter", "Tanggal", "Item", "Total", "Status"]}
        empty={filtered.length === 0}
      >
        {filtered.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                  <FileText className="h-4 w-4" />
                </span>
                <span className="font-mono text-sm font-medium text-foreground">{p.code}</span>
              </div>
            </TableCell>
            <TableCell className="font-medium text-foreground">{p.patient}</TableCell>
            <TableCell className="text-muted-foreground">{p.doctor}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
            </TableCell>
            <TableCell className="text-muted-foreground">{p.items} obat</TableCell>
            <TableCell className="font-semibold">{formatRupiah(p.total)}</TableCell>
            <TableCell>
              <StatusBadge label={p.status} tone={toneByStatus[p.status]} />
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>
    </>
  );
}
