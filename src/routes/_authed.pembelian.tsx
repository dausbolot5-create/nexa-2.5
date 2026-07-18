import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { PackagePlus } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatRupiah } from "@/lib/mockData";
import { db } from "@/db";
import { purchases as purchasesTable, suppliers as suppliersTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

const getData = createServerFn({ method: "GET" }).handler(async () => {
  const [purchases, suppliers] = await Promise.all([
    db.select().from(purchasesTable),
    db.select().from(suppliersTable),
  ]);
  return { purchases, suppliers };
});

const addPurchase = createServerFn({ method: "POST" })
  .validator((d: { supplierId: string; items: number; total: number }) => d)
  .handler(async ({ data }) => {
    const now = new Date();
    const code = `PO-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
    const id = `P-${Date.now()}`;
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    await db.insert(purchasesTable).values({
      id,
      code,
      supplierId: data.supplierId,
      date: dateStr,
      itemsCount: data.items,
      total: data.total,
      status: "dipesan",
    });
    return code;
  });

const updateStatus = createServerFn({ method: "POST" })
  .validator((d: { id: string; status: string }) => d)
  .handler(async ({ data }) => {
    await db
      .update(purchasesTable)
      .set({ status: data.status })
      .where(eq(purchasesTable.id, data.id));
  });

export const Route = createFileRoute("/_authed/pembelian")({
  loader: async () => await getData(),
  component: PembelianPage,
});

const tone = {
  diterima: "success",
  dipesan: "info",
  sebagian: "warning",
  diproses: "warning",
} as const;

const statusOptions = [
  { value: "dipesan", label: "Dipesan", cls: "text-info" },
  { value: "diproses", label: "Diproses", cls: "text-warning" },
  { value: "sebagian", label: "Sebagian", cls: "text-warning" },
  { value: "diterima", label: "Diterima", cls: "text-success" },
] as const;

function PembelianPage() {
  const { purchases, suppliers } = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ supplierId: "", items: "", total: "" });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      purchases.filter((p) =>
        ((p.code || "") + (p.supplierId || "")).toLowerCase().includes(q.toLowerCase()),
      ),
    [purchases, q],
  );
  const total = purchases.reduce((s, p) => s + p.total, 0);

  // Map supplierId to supplier name for display
  const supplierMap = useMemo(() => {
    const m: Record<string, string> = {};
    for (const s of suppliers) m[s.id] = s.name;
    return m;
  }, [suppliers]);

  const handleSave = async () => {
    if (!form.supplierId || !form.items || !form.total) {
      return toast.error("Semua field wajib diisi");
    }
    setSaving(true);
    try {
      const code = await addPurchase({
        data: {
          supplierId: form.supplierId,
          items: Number(form.items),
          total: Number(form.total),
        },
      });
      toast.success(`Pesanan ${code} berhasil dibuat`);
      setForm({ supplierId: "", items: "", total: "" });
      setOpen(false);
      router.invalidate();
    } catch {
      toast.error("Gagal membuat pesanan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Pembelian"
        description={`Total pembelian tercatat: ${formatRupiah(total)}`}
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-xl">
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
            <TableCell className="font-medium text-foreground">
              {supplierMap[p.supplierId] || p.supplierId}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(p.date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
            <TableCell className="text-muted-foreground">{p.itemsCount} item</TableCell>
            <TableCell className="font-semibold">{formatRupiah(p.total)}</TableCell>
            <TableCell className="flex items-center gap-2">
              <StatusBadge label={p.status} tone={tone[p.status as keyof typeof tone]} />
              <Select
                onValueChange={async (val) => {
                  await updateStatus({ data: { id: p.id, status: val } });
                  toast.success(`Status ${p.code} → ${val}`);
                  router.invalidate();
                }}
              >
                <SelectTrigger className="h-7 w-[120px] rounded-full text-xs font-medium capitalize border-0 shadow-none focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={`capitalize ${o.cls}`}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Buat Pesanan Pembelian</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>Pemasok</Label>
              <Select
                value={form.supplierId}
                onValueChange={(v) => setForm((f) => ({ ...f, supplierId: v }))}
              >
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Pilih pemasok" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="po-items">Jumlah Item</Label>
              <Input
                id="po-items"
                type="number"
                value={form.items}
                onChange={(e) => setForm((f) => ({ ...f, items: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="po-total">Total (Rp)</Label>
              <Input
                id="po-total"
                type="number"
                value={form.total}
                onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan…" : "Buat Pesanan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
