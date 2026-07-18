import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Boxes, Package, Layers, Wallet } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { medicines as seed, formatRupiah } from "@/lib/mockData";
import { db } from "@/db";
import { medicines as medicinesTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";

import { medicines as mockMedicines } from "@/lib/mockData";

const getMedicines = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return await db.select().from(medicinesTable);
  } catch (error) {
    console.error("Inventori DB Loader Error, falling back to mockData:", error);
    return mockMedicines;
  }
});

export const Route = createFileRoute("/_authed/inventori")({
  loader: async () => await getMedicines(),
  component: InventoriPage,
});

function InventoriPage() {
  const medicines = Route.useLoaderData();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      medicines.filter((m) =>
        (m.name + m.category + m.location).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  const totalUnits = medicines.reduce((s, m) => s + m.stock, 0);
  const stockValue = medicines.reduce((s, m) => s + m.stock * m.cost, 0);
  const categories = new Set(medicines.map((m) => m.category)).size;

  return (
    <>
      <PageHeader title="Inventori" description="Pantau nilai dan pergerakan stok obat." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Jenis Obat" value={`${medicines.length}`} icon={Package} tone="primary" />
        <StatCard
          label="Total Unit"
          value={totalUnits.toLocaleString("id-ID")}
          icon={Boxes}
          tone="info"
        />
        <StatCard label="Kategori" value={`${categories}`} icon={Layers} tone="success" />
        <StatCard
          label="Nilai Stok"
          value={formatRupiah(stockValue)}
          icon={Wallet}
          tone="warning"
        />
      </div>

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari obat atau lokasi…"
        count={filtered.length}
        headers={["Nama Obat", "Lokasi", "Level Stok", "Stok", "Nilai"]}
        empty={filtered.length === 0}
      >
        {filtered.map((m) => {
          const pct = Math.min(100, Math.round((m.stock / (m.minStock * 4)) * 100));
          return (
            <TableRow key={m.id}>
              <TableCell className="font-medium text-foreground">{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.location}</TableCell>
              <TableCell className="w-48">
                <Progress value={pct} className="h-2" />
              </TableCell>
              <TableCell>
                <StatusBadge
                  label={`${m.stock} ${m.unit}`}
                  tone={
                    m.stock === 0 ? "destructive" : m.stock <= m.minStock ? "warning" : "success"
                  }
                />
              </TableCell>
              <TableCell className="font-semibold">{formatRupiah(m.stock * m.cost)}</TableCell>
            </TableRow>
          );
        })}
      </TablePanel>
    </>
  );
}
