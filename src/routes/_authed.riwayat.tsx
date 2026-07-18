import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { History } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/mockData";
import { db } from "@/db";
import {
  sales as salesTable,
  purchases as purchasesTable,
  prescriptions as prescriptionsTable,
} from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";
import { desc } from "drizzle-orm";

import { sales as mockSales, purchases as mockPurchases } from "@/lib/mockData";

const getRiwayat = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const [sales, purchases] = await Promise.all([
      db.select().from(salesTable).orderBy(desc(salesTable.createdAt)),
      db.select().from(purchasesTable).orderBy(desc(purchasesTable.createdAt)),
    ]);
    return { sales, purchases };
  } catch (error) {
    console.error("Riwayat DB Loader Error, falling back to mockData:", error);
    return { sales: mockSales, purchases: mockPurchases };
  }
});

export const Route = createFileRoute("/_authed/riwayat")({
  loader: async () => await getRiwayat(),
  component: RiwayatPage,
});

const saleTone = { Tunai: "success", QRIS: "info", Kartu: "primary" } as const;
const purchaseTone = {
  diterima: "success",
  dipesan: "info",
  sebagian: "warning",
  diproses: "warning",
} as const;

function RiwayatPage() {
  const { sales, purchases } = Route.useLoaderData();

  const [qSale, setQSale] = useState("");
  const [qPurchase, setQPurchase] = useState("");

  const filteredSales = useMemo(
    () => sales.filter((s) => (s.code + s.method).toLowerCase().includes(qSale.toLowerCase())),
    [sales, qSale],
  );
  const filteredPurchases = useMemo(
    () =>
      purchases.filter((p) =>
        ((p.code || "") + (p.status || "")).toLowerCase().includes(qPurchase.toLowerCase()),
      ),
    [purchases, qPurchase],
  );

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <>
      <PageHeader
        title="Riwayat"
        description="Riwayat seluruh transaksi penjualan dan pembelian."
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <History className="h-4 w-4" />
            <span>{sales.length + purchases.length} total record</span>
          </div>
        }
      />

      <Tabs defaultValue="penjualan" className="w-full">
        <TabsList className="glass-soft rounded-xl">
          <TabsTrigger value="penjualan" className="rounded-lg">
            Penjualan ({sales.length})
          </TabsTrigger>
          <TabsTrigger value="pembelian" className="rounded-lg">
            Pembelian ({purchases.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="penjualan">
          <TablePanel
            search={qSale}
            onSearch={setQSale}
            searchPlaceholder="Cari kode invoice…"
            count={filteredSales.length}
            headers={["Kode", "Tanggal", "Jumlah Item", "Total", "Metode"]}
            empty={filteredSales.length === 0}
          >
            {filteredSales.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {s.code}
                </TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(s.date)}</TableCell>
                <TableCell className="text-muted-foreground">{s.itemsCount} item</TableCell>
                <TableCell className="font-semibold">{formatRupiah(s.total)}</TableCell>
                <TableCell>
                  <StatusBadge
                    label={s.method}
                    tone={saleTone[s.method as keyof typeof saleTone] ?? "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TablePanel>
        </TabsContent>

        <TabsContent value="pembelian">
          <TablePanel
            search={qPurchase}
            onSearch={setQPurchase}
            searchPlaceholder="Cari kode PO…"
            count={filteredPurchases.length}
            headers={["Kode PO", "Tanggal", "Jumlah Item", "Total", "Status"]}
            empty={filteredPurchases.length === 0}
          >
            {filteredPurchases.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-sm font-medium text-foreground">
                  {p.code}
                </TableCell>
                <TableCell className="text-muted-foreground">{fmtDate(p.date)}</TableCell>
                <TableCell className="text-muted-foreground">{p.itemsCount} item</TableCell>
                <TableCell className="font-semibold">{formatRupiah(p.total)}</TableCell>
                <TableCell>
                  <StatusBadge
                    label={p.status}
                    tone={purchaseTone[p.status as keyof typeof purchaseTone] ?? "default"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TablePanel>
        </TabsContent>
      </Tabs>
    </>
  );
}
