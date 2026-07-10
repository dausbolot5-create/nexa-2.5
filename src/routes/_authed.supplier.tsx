import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Truck, Phone, Mail, MapPin } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { TableCell, TableRow } from "@/components/ui/table";
import { suppliers } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/supplier")({
  component: SupplierPage,
});

function SupplierPage() {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      suppliers.filter((s) =>
        (s.name + s.city + s.contact).toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );

  return (
    <>
      <PageHeader title="Pemasok" description="Daftar pemasok obat dan informasi kontaknya." />

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
    </>
  );
}
