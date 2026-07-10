import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { purchases, formatRupiah } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/pembelian")({
  component: PembelianPage,
});

const tone = { diterima: "success", dipesan: "info", sebagian: "warning" } as const;

function PembelianPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      purchases.filter((p) =>
        ((p.code || "") + (p.supplier || "")).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  const total = purchases.reduce((s, p) => s + p.total, 0);

  return (
    <>
      <PageHeader
        title="Pembelian"
        description={`Total pembelian tercatat: ${formatRupiah(total)}`}
        actions={
          <Button onClick={() => toast.info("Formulir PO baru (demo)")} className="rounded-xl">
            <PackagePlus className="h-4 w-4" /> Buat Pesanan
          </Button>
        }
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari PO atau pemasok…"
        count={filtered.length}
        headers={["Kode PO", "Pemasok", "Tanggal", "Item", "Total", "Status"]}
        empty={filtered.length === 0}
      >
        {filtered.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-sm font-medium text-foreground">
              {p.code}
            </TableCell>
            <TableCell className="font-medium text-foreground">{p.supplier}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-muted-foreground">{p.items} item</TableCell>
            <TableCell className="font-semibold">{formatRupiah(p.total)}</TableCell>
            <TableCell>
              <StatusBadge label={p.status} tone={tone[p.status]} />
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>
    </>
  );
}
