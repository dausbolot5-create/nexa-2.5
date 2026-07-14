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
import { formatRupiah, type Medicine } from "@/lib/mockData";
import { medImage } from "@/lib/medImages";
import { db } from "@/db";
import { medicines as medicinesTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { useRouter } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getMedicines = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(medicinesTable);
});

const saveMedicine = createServerFn({ method: "POST" })
  .validator((d: Record<string, unknown>) => d)
  .handler(async ({ data }) => {
    await db.insert(medicinesTable).values(data);
  });

const updateMedicine = createServerFn({ method: "POST" })
  .validator((d: { id: string; data: Record<string, unknown> }) => d)
  .handler(async ({ data: { id, data } }) => {
    await db.update(medicinesTable).set(data).where(eq(medicinesTable.id, id));
  });

const deleteMedicineFn = createServerFn({ method: "POST" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(medicinesTable).where(eq(medicinesTable.id, id));
  });

export const Route = createFileRoute("/_authed/obat")({
  loader: async () => await getMedicines(),
  component: ObatPage,
});

function stockTone(m: Medicine) {
  if (m.stock === 0) return "destructive" as const;
  if (m.stock <= m.minStock) return "warning" as const;
  return "success" as const;
}

function ObatPage() {
  const loaderData = Route.useLoaderData();
  const [data, setData] = useState<Medicine[]>(loaderData);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
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

  const router = useRouter();

  const save = async () => {
    if (!form.name || !form.price) return toast.error("Nama & harga wajib diisi");

    if (editId) {
      const updateData = {
        name: form.name,
        category: form.category || "Lainnya",
        unit: form.unit || "Tablet",
        price: Number(form.price),
        stock: Number(form.stock) || 0,
      };
      await updateMedicine({ id: editId, data: updateData });
      toast.success("Obat berhasil diperbarui");
    } else {
      const newObat = {
        id: crypto.randomUUID(),
        code: `OBT-${Date.now().toString().slice(-4)}`,
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
        manufacturer: "Generik",
      };
      await saveMedicine({ data: newObat });
      toast.success("Obat ditambahkan ke database");
    }

    router.invalidate();
    setOpen(false);
    setEditId(null);
    setForm({ name: "", category: "", unit: "", price: "", stock: "" });
  };

  const handleEdit = (m: Medicine) => {
    setEditId(m.id);
    setForm({
      name: m.name,
      category: m.category,
      unit: m.unit,
      price: m.price.toString(),
      stock: m.stock.toString(),
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus obat ini?")) return;
    await deleteMedicineFn({ data: id });
    toast.success("Obat dihapus");
    router.invalidate();
  };

  return (
    <>
      <PageHeader
        title="Data Obat"
        description="Kelola daftar obat, harga, dan ketersediaan stok."
        actions={
          <Button
            onClick={() => {
              setEditId(null);
              setForm({ name: "", category: "", unit: "", price: "", stock: "" });
              setOpen(true);
            }}
            className="rounded-xl"
          >
            <Plus className="h-4 w-4" /> Tambah Obat
          </Button>
        }
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari nama, kode, kategori…"
        count={filtered.length}
        headers={["Kode", "Nama Obat", "Kategori", "Harga", "Stok", "Lokasi", "Kadaluarsa", "Aksi"]}
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
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass">
                  <DropdownMenuItem onClick={() => handleEdit(m)} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(m.id)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass rounded-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Obat" : "Tambah Obat Baru"}</DialogTitle>
            <DialogDescription>
              {editId
                ? "Perbarui informasi obat di bawah ini."
                : "Lengkapi data obat untuk menambahkannya ke inventori."}
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
