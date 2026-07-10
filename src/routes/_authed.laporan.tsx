import { createFileRoute } from "@tanstack/react-router";
import { Download, TrendingUp, ShoppingBag, Percent, Wallet } from "lucide-react";
import { toast } from "sonner";
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
import { monthlyRevenue, salesTrend, formatRupiah } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/laporan")({
  component: LaporanPage,
});

const chartTooltip = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--popover)",
} as const;

function LaporanPage() {
  const revenue = monthlyRevenue.reduce((s, m) => s + m.pendapatan, 0);
  const spend = monthlyRevenue.reduce((s, m) => s + m.pembelian, 0);
  const profit = revenue - spend;

  return (
    <>
      <PageHeader
        title="Laporan"
        description="Analisis performa penjualan dan keuangan apotek."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Laporan diekspor (demo)")}
          >
            <Download className="h-4 w-4" /> Ekspor
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pendapatan (6 bln)"
          value={formatRupiah(revenue)}
          icon={TrendingUp}
          tone="success"
        />
        <StatCard
          label="Pembelian (6 bln)"
          value={formatRupiah(spend)}
          icon={ShoppingBag}
          tone="info"
        />
        <StatCard label="Laba Kotor" value={formatRupiah(profit)} icon={Wallet} tone="primary" />
        <StatCard
          label="Margin"
          value={`${Math.round((profit / revenue) * 100)}%`}
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
