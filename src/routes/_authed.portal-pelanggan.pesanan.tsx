import { createFileRoute } from "@tanstack/react-router";
import { Search, Filter, Package, Truck, CheckCircle2, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authed/portal-pelanggan/pesanan")({
  head: () => ({ meta: [{ title: "Pesanan Saya — Apotek Nexa" }] }),
  component: OrdersPage,
});

const orders = [
  {
    id: "NX-2410-0128",
    date: "10 Jul 2026",
    items: ["Paracetamol 500mg × 20", "Vitamin C 500mg × 30"],
    total: "Rp 85.000",
    status: "Dikirim",
    icon: Truck,
  },
  {
    id: "NX-2410-0119",
    date: "07 Jul 2026",
    items: ["Amlodipine 5mg × 30"],
    total: "Rp 120.000",
    status: "Selesai",
    icon: CheckCircle2,
  },
  {
    id: "NX-2410-0102",
    date: "01 Jul 2026",
    items: ["Insulin pen × 2", "Alkohol swab × 100"],
    total: "Rp 340.000",
    status: "Selesai",
    icon: CheckCircle2,
  },
  {
    id: "NX-2410-0087",
    date: "24 Jun 2026",
    items: ["Salep Betamethasone × 1"],
    total: "Rp 45.000",
    status: "Diproses",
    icon: Clock,
  },
  {
    id: "NX-2410-0064",
    date: "15 Jun 2026",
    items: ["Metformin 500mg × 60", "Glimepiride 2mg × 30"],
    total: "Rp 210.000",
    status: "Selesai",
    icon: CheckCircle2,
  },
];

const badgeTone = (s: string) =>
  s === "Selesai"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
    : s === "Dikirim"
      ? "bg-primary/15 text-primary border-primary/30"
      : "bg-amber-500/15 text-amber-600 border-amber-500/40";

function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pesanan Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">Pantau semua pesanan obat Anda</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari nomor pesanan atau obat..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      <Tabs defaultValue="semua">
        <TabsList className="mb-4">
          <TabsTrigger value="semua">Semua</TabsTrigger>
          <TabsTrigger value="diproses">Diproses</TabsTrigger>
          <TabsTrigger value="dikirim">Dikirim</TabsTrigger>
          <TabsTrigger value="selesai">Selesai</TabsTrigger>
        </TabsList>

        <div className="space-y-4">
          {orders.map((o) => {
            const Icon = o.icon;
            return (
              <Card key={o.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0 text-muted-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{o.id}</span>
                        <span className="text-xs text-muted-foreground">• {o.date}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">{o.items.join(", ")}</div>
                      <Badge variant="outline" className={badgeTone(o.status)}>
                        {o.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0 gap-3 md:gap-1">
                    <span className="text-sm text-muted-foreground">Total Belanja</span>
                    <span className="font-bold">{o.total}</span>
                    <Button variant="ghost" size="sm" className="hidden md:inline-flex mt-2">
                      Lihat Detail
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Tabs>
    </div>
  );
}
