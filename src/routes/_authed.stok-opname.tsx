import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { medicines } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/stok-opname")({
  component: StokOpnamePage,
});

function StokOpnamePage() {
  const [q, setQ] = useState("");
  const [counts, setCounts] = useState<Record<string, string>>({});

  const filtered = useMemo(
    () => medicines.filter((m) => m.name.toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  const diffTotal = medicines.reduce((s, m) => {
    const c = counts[m.id];
    if (c === undefined || c === "") return s;
    return s + (Number(c) - m.stock);
  }, 0);

  return (
    <>
      <PageHeader
        title="Stok Opname"
        description="Sesuaikan stok fisik dengan catatan sistem."
        actions={
          <Button
            onClick={() =>
              toast.success("Stok opname disimpan", {
                description: `Selisih total: ${diffTotal} unit`,
              })
            }
            className="rounded-xl"
          >
            <Save className="h-4 w-4" /> Simpan Opname
          </Button>
        }
      />

      <div className="glass flex items-center gap-3 rounded-2xl p-4">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
          <ClipboardCheck className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm text-muted-foreground">Selisih total saat ini</p>
          <p className="text-xl font-bold text-foreground">{diffTotal} unit</p>
        </div>
      </div>

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari obat…"
        count={filtered.length}
        headers={["Nama Obat", "Lokasi", "Stok Sistem", "Stok Fisik", "Selisih"]}
        empty={filtered.length === 0}
      >
        {filtered.map((m) => {
          const c = counts[m.id];
          const diff = c === undefined || c === "" ? null : Number(c) - m.stock;
          return (
            <TableRow key={m.id}>
              <TableCell className="font-medium text-foreground">{m.name}</TableCell>
              <TableCell className="text-muted-foreground">{m.location}</TableCell>
              <TableCell className="font-semibold">{m.stock}</TableCell>
              <TableCell>
                <Input
                  value={c ?? ""}
                  onChange={(e) =>
                    setCounts({ ...counts, [m.id]: e.target.value.replace(/\D/g, "") })
                  }
                  placeholder={String(m.stock)}
                  inputMode="numeric"
                  className="h-9 w-24 rounded-lg"
                />
              </TableCell>
              <TableCell>
                {diff === null ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  <StatusBadge
                    label={diff > 0 ? `+${diff}` : `${diff}`}
                    tone={diff === 0 ? "success" : diff > 0 ? "info" : "destructive"}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TablePanel>
    </>
  );
}
