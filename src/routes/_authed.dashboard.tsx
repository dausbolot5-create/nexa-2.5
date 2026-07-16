import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  TrendingUp,
  ShoppingCart,
  Boxes,
  TriangleAlert,
  ArrowUpRight,
  Pill,
  FileText,
  Plus,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { ScrollReveal } from "@/components/animations";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatRupiah, medicines, sales, salesTrend, categorySales } from "@/lib/mockData";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authed/dashboard")({
  component: Dashboard,
});

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const quickActions = [
  { label: "Data Obat", href: "/obat" as const, icon: ClipboardList },
  { label: "Pelanggan", href: "/pelanggan" as const, icon: FileText },
  { label: "Pembelian", href: "/pembelian" as const, icon: Plus },
  { label: "Peringatan Stok", href: "/stok-alert" as const, icon: ShieldAlert },
];

function Dashboard() {
  const { user } = useAuth();
  const lowStock = medicines.filter((m) => m.stock <= m.minStock);
  const totalStock = medicines.reduce((s, m) => s + m.stock, 0);
  const todaySales = sales.slice(0, 6).reduce((s, t) => s + t.total, 0);

  return (
    <>
      {/* Page Header */}
      <ScrollReveal>
        <PageHeader
          title={`Halo, ${user?.name?.split(" ")[0] || "User"}`}
          description="Ringkasan aktivitas apotek Anda hari ini."
          actions={
            <>
              <Link to="/kasir" className={buttonVariants({ className: "rounded-xl" })}>
                <Plus className="h-4 w-4" /> Transaksi Baru
              </Link>
              <Link
                to="/laporan"
                className={buttonVariants({ variant: "outline", className: "rounded-xl" })}
              >
                <FileText className="h-4 w-4" /> Laporan
              </Link>
            </>
          }
        />
      </ScrollReveal>

      {/* KPI Cards — staggered scroll reveal */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Penjualan Hari Ini",
            value: formatRupiah(todaySales),
            icon: TrendingUp,
            trend: { value: "+12.5%", positive: true } as const,
            tone: "success" as const,
          },
          {
            label: "Transaksi",
            value: `${sales.length}`,
            icon: ShoppingCart,
            delta: `${sales.length} transaksi terakhir`,
            tone: "primary" as const,
          },
          {
            label: "Total Stok Obat",
            value: totalStock.toLocaleString("id-ID"),
            icon: Boxes,
            delta: `${medicines.length} jenis obat`,
            tone: "info" as const,
          },
          {
            label: "Peringatan Stok",
            value: `${lowStock.length}`,
            icon: TriangleAlert,
            delta: "Perlu segera diisi ulang",
            tone: "warning" as const,
          },
        ].map((card, i) => (
          <ScrollReveal key={card.label} delay={i * 80} direction="up">
            <StatCard {...card} className="card-hover" />
          </ScrollReveal>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ScrollReveal direction="left" className="lg:col-span-2">
          <div className="glass rounded-2xl p-5 card-hover">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Tren Penjualan</h3>
                <p className="text-xs text-muted-foreground">7 hari terakhir</p>
              </div>
              <StatusBadge label="Minggu ini" tone="info" />
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={salesTrend} margin={{ left: -12, right: 8, top: 4 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Tooltip
                  formatter={(v: number) => formatRupiah(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                    backdropFilter: "blur(8px)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="penjualan"
                  stroke="var(--chart-1)"
                  strokeWidth={2.5}
                  fill="url(#salesGrad)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="glass rounded-2xl p-5 card-hover">
            <h3 className="mb-1 text-base font-bold text-foreground">Kategori Terlaris</h3>
            <p className="mb-2 text-xs text-muted-foreground">Berdasarkan unit terjual</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categorySales}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  isAnimationActive={false}
                >
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--popover)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 space-y-1.5">
              {categorySales.map((c, i) => (
                <div key={c.name} className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i] }} />
                  <span className="min-w-0 flex-1 truncate text-foreground/80">{c.name}</span>
                  <span className="font-medium text-foreground">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Row 2: Transactions + Quick Access */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ScrollReveal direction="left" className="lg:col-span-2">
          <div className="glass rounded-2xl p-5 card-hover">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Transaksi Terbaru</h3>
              <Link
                to="/kasir"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Buka kasir <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-1">
              {sales.slice(0, 6).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-accent/60"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/12 text-primary">
                    <ShoppingCart className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{t.code}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {t.customer} · {t.items} item · {t.method}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-foreground">
                    {formatRupiah(t.total)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <div className="glass rounded-2xl p-5">
            <h3 className="mb-4 text-base font-bold text-foreground">Akses Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((item, i) => (
                <ScrollReveal key={item.label} delay={i * 60} direction="up">
                  <Link
                    to={item.href}
                    className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border border-border bg-secondary/40 text-xs font-medium text-foreground card-hover"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    {item.label}
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Low Stock */}
        <ScrollReveal delay={0} direction="up">
          <div className="glass rounded-2xl p-5 card-hover">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Stok Menipis</h3>
              <Link
                to="/stok-alert"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Semua <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-1">
              {lowStock.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/60 transition-colors"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-destructive/12 text-destructive">
                    <Pill className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stok: <span className="font-bold text-destructive">{m.stock}</span> (Min:{" "}
                      {m.minStock})
                    </p>
                  </div>
                  <StatusBadge
                    label={`${m.stock} ${m.unit}`}
                    tone={m.stock === 0 ? "destructive" : "warning"}
                  />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Expiring Soon */}
        <ScrollReveal delay={100} direction="up">
          <div className="glass rounded-2xl p-5 card-hover">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-foreground">Mendekati Kedaluwarsa</h3>
              <Link
                to="/inventori"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Semua <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-1">
              {medicines
                .filter((m) => {
                  const d = new Date(m.expiry);
                  const now = new Date();
                  const diff = (d.getTime() - now.getTime()) / 86400000;
                  return diff < 120 && diff > 0;
                })
                .slice(0, 5)
                .map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-accent/60 transition-colors"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-warning/20 text-warning">
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{m.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {m.category} · Stok: {m.stock}
                      </p>
                    </div>
                    <StatusBadge label={m.expiry} tone="warning" />
                  </div>
                ))}
              {medicines.filter((m) => {
                const d = new Date(m.expiry);
                const now = new Date();
                const diff = (d.getTime() - now.getTime()) / 86400000;
                return diff < 120 && diff > 0;
              }).length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Tidak ada obat mendekati kedaluwarsa.
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </>
  );
}
