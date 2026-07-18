import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Truck, Phone, Mail, MapPin } from "lucide-react";
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
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatRupiah } from "@/lib/mockData";
import { db } from "@/db";
import { suppliers as suppliersTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";

const getSuppliers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(suppliersTable);
});

const addSupplier = createServerFn({ method: "POST" })
  .validator(
    (d: {
      name: string;
      contact: string;
      phone: string;
      email: string;
      address: string;
      city: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const id = `S-${Date.now()}`;
    await db.insert(suppliersTable).values({ id, ...data });
    return id;
  });

export const Route = createFileRoute("/_authed/supplier")({
  loader: async () => await getSuppliers(),
  component: SupplierPage,
});

function SupplierPage() {
  const suppliers = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      suppliers.filter((s) =>
        (s.name + s.city + s.contact).toLowerCase().includes(q.toLowerCase()),
      ),
    [suppliers, q],
  );

  const handleSave = async () => {
    if (!form.name || !form.contact || !form.phone) {
      return toast.error("Nama, kontak, dan telepon wajib diisi");
    }
    setSaving(true);
    try {
      await addSupplier({ data: form });
      toast.success(`Pemasok "${form.name}" berhasil ditambahkan`);
      setForm({ name: "", contact: "", phone: "", email: "", address: "", city: "" });
      setOpen(false);
      router.invalidate();
    } catch {
      toast.error("Gagal menambah pemasok");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Pemasok"
        description="Daftar pemasok obat dan informasi kontaknya."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-xl">
            <Truck className="h-4 w-4" /> Tambah Pemasok
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {suppliers.slice(0, 3).map((s) => (
          <div key={s.id} className="glass animate-rise rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/12 text-primary">
                <Truck className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-bold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.contact}</p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {s.phone}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail className="h-4 w-4" /> {s.email}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {s.city}
              </p>
            </div>
          </div>
        ))}
      </div>

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari pemasok…"
        count={filtered.length}
        headers={["Kode", "Nama Pemasok", "Kontak", "Telepon", "Email", "Kota"]}
        empty={filtered.length === 0}
      >
        {filtered.map((s) => (
          <TableRow key={s.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{s.id}</TableCell>
            <TableCell className="font-medium text-foreground">{s.name}</TableCell>
            <TableCell className="text-muted-foreground">{s.contact}</TableCell>
            <TableCell className="text-muted-foreground">{s.phone}</TableCell>
            <TableCell className="text-muted-foreground">{s.email}</TableCell>
            <TableCell className="text-muted-foreground">{s.city}</TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pemasok Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {(
              [
                ["name", "Nama Perusahaan"],
                ["contact", "Nama Kontak"],
                ["phone", "Telepon"],
                ["email", "Email"],
                ["address", "Alamat"],
                ["city", "Kota"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="grid gap-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
