import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatRupiah, medicines as seed, type Medicine } from "@/lib/mockData";
import { medImage } from "@/lib/medImages";

export const Route = createFileRoute("/_authed/obat")({
  component: ObatPage,
});

function stockTone(m: Medicine) {
  if (m.stock === 0) return "destructive" as const;
  if (m.stock <= m.minStock) return "warning" as const;
  return "success" as const;
}

function ObatPage() {
  const [data, setData] = useState<Medicine[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", category: "", unit: "", price: "", stock: "" });

  const filtered = useMemo(
    () =>
      data.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q.toLowerCase()) ||
          (m.category || "").toLowerCase().includes(q.toLowerCase()) ||
          (m.code || "").toLowerCase().includes(q.toLowerCase()),
      ),
    [data, q],
  );

  const save = () => {
    if (!form.name || !form.price) return toast.error("Nama & harga wajib diisi");
    const n = data.length + 1;
    setData((d) => [
      {
        id: `M${n}`,
        code: `OBT-${String(n).padStart(4, "0")}`,
        name: form.name,
        category: form.category || "Lainnya",
        unit: form.unit || "Tablet",
        price: Number(form.price),
        cost: Math.round(Number(form.price) * 0.7),
        stock: Number(form.stock) || 0,
        minStock: 15,
        expiry: "2027-01-01",
        supplier: "PT Kimia Farma",
        location: "Rak A-1",
      },
      ...d,
    ]);
    setOpen(false);
    setForm({ name: "", category: "", unit: "", price: "", stock: "" });
    toast.success("Obat ditambahkan");
  };

  return (
    <>
      <PageHeader
        title="Data Obat"
        description="Kelola daftar obat, harga, dan ketersediaan stok."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-xl">
            <Plus className="h-4 w-4" /> Tambah Obat
          </Button>
        }
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari nama, kode, kategori…"
        count={filtered.length}
        headers={["Kode", "Nama Obat", "Kategori", "Harga", "Stok", "Lokasi", "Kadaluarsa"]}
        empty={filtered.length === 0}
      >
        {filtered.map((m) => (
          <TableRow key={m.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{m.code}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-secondary ring-1 ring-border">
                  <img
                    src={medImage(m.category)}
                    alt={m.name}
                    loading="lazy"
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="font-medium text-foreground">{m.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{m.category}</TableCell>
            <TableCell className="font-semibold">{formatRupiah(m.price)}</TableCell>
            <TableCell>
              <StatusBadge label={`${m.stock} ${m.unit}`} tone={stockTone(m)} />
            </TableCell>
            <TableCell className="text-muted-foreground">{m.location}</TableCell>
            <TableCell className="text-muted-foreground">
              {new Date(m.expiry).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Obat Baru</DialogTitle>
            <DialogDescription>
              Lengkapi data obat untuk menambahkannya ke inventori.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label>Nama Obat</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="cth. Paracetamol 500mg"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Analgesik"
              />
            </div>
            <div className="space-y-2">
              <Label>Satuan</Label>
              <Input
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                placeholder="Tablet"
              />
            </div>
            <div className="space-y-2">
              <Label>Harga Jual</Label>
              <Input
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })}
                placeholder="5000"
                inputMode="numeric"
              />
            </div>
            <div className="space-y-2">
              <Label>Stok Awal</Label>
              <Input
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value.replace(/\D/g, "") })}
                placeholder="100"
                inputMode="numeric"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Batal
            </Button>
            <Button onClick={save} className="rounded-xl">
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
