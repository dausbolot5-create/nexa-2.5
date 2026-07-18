import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, ShoppingBag, Percent, Wallet } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { formatRupiah } from "@/lib/mockData";
import { db } from "@/db";
import { sales as salesTable, purchases as purchasesTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";

const getLaporanData = createServerFn({ method: "GET" }).handler(async () => {
  const [sales, purchases] = await Promise.all([
    db.select().from(salesTable),
    db.select().from(purchasesTable),
  ]);
  return { sales, purchases };
});

export const Route = createFileRoute("/_authed/laporan")({
  loader: async () => await getLaporanData(),
  component: LaporanPage,
});

const chartTooltip = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
} as const;

function LaporanPage() {
  const { sales, purchases } = Route.useLoaderData();

  const revenue = sales.reduce((s, t) => s + t.total, 0);
  const spend = purchases.reduce((s, p) => s + p.total, 0);
  const profit = revenue - spend;

  // Group sales by month for chart
  const monthlyMap: Record<string, { pendapatan: number; pembelian: number }> = {};
  for (const s of sales) {
    const m = new Date(s.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    if (!monthlyMap[m]) monthlyMap[m] = { pendapatan: 0, pembelian: 0 };
    monthlyMap[m].pendapatan += s.total;
  }
  for (const p of purchases) {
    const m = new Date(p.date).toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    if (!monthlyMap[m]) monthlyMap[m] = { pendapatan: 0, pembelian: 0 };
    monthlyMap[m].pembelian += p.total;
  }
  const monthlyRevenue = Object.entries(monthlyMap).map(([month, v]) => ({ month, ...v }));

  // Group sales by day-of-week for daily chart
  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const dailyMap: Record<string, number> = {};
  for (const s of sales) {
    const day = dayNames[new Date(s.date).getDay()];
    dailyMap[day] = (dailyMap[day] || 0) + s.total;
  }
  const salesTrend = dayNames.map((day) => ({ day, penjualan: dailyMap[day] || 0 }));

  const exportCSV = () => {
    const header = "Kode,Tanggal,Jumlah Item,Total,Metode\n";
    const rows = sales
      .map((s) => `${s.code},${s.date},${s.itemsCount},${s.total},${s.method}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-penjualan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Laporan"
        description="Analisis performa penjualan dan keuangan apotek."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Ekspor CSV
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Pendapatan"
          value={formatRupiah(revenue)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Total Pembelian"
          value={formatRupiah(spend)}
          icon={ShoppingBag}
          tone="info"
        />
        <StatCard label="Laba Kotor" value={formatRupiah(profit)} icon={Wallet} tone="primary" />
        <StatCard
          label="Margin"
          value={revenue > 0 ? `${Math.round((profit / revenue) * 100)}%` : "0%"}
          icon={Percent}
          tone="warning"
        />
      </div>

      <Tabs defaultValue="bulanan" className="w-full">
        <TabsList className="glass-soft rounded-xl">
          <TabsTrigger value="bulanan" className="rounded-lg">
            Bulanan
          </TabsTrigger>
          <TabsTrigger value="harian" className="rounded-lg">
            Harian
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bulanan">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-4 text-base font-bold text-foreground">Pendapatan vs Pembelian</h3>
            {monthlyRevenue.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Belum ada data transaksi.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyRevenue} margin={{ left: -8, right: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    fontSize={12}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    stroke="var(--muted-foreground)"
                    tickFormatter={(v) => `${v / 1000000}jt`}
                  />
                  <Tooltip formatter={(v: number) => formatRupiah(v)} contentStyle={chartTooltip} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    dataKey="pendapatan"
                    name="Pendapatan"
                    fill="var(--chart-1)"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="pembelian"
                    name="Pembelian"
                    fill="var(--chart-3)"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </TabsContent>

        <TabsContent value="harian">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-4 text-base font-bold text-foreground">Penjualan Harian</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={salesTrend} margin={{ left: -8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  fontSize={12}
                  stroke="var(--muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--muted-foreground)"
                  tickFormatter={(v) => `${v / 1000000}jt`}
                />
                <Tooltip formatter={(v: number) => formatRupiah(v)} contentStyle={chartTooltip} />
                <Line
                  type="monotone"
                  dataKey="penjualan"
                  name="Penjualan"
                  stroke="var(--chart-2)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
