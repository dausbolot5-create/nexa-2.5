import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Users, Trophy, Activity, Star, Award } from "lucide-react";
import {
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
  AreaChart,
  Area,
} from "recharts";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/PageHeader";
import { ScrollReveal } from "@/components/animations";
import { Button, buttonVariants } from "@/components/ui/button";
import { formatRupiah } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { db } from "@/db";
import { customers as customersTable } from "@/db/schema";
import { createServerFn } from "@tanstack/react-start";

const getCustomers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(customersTable);
});

export const Route = createFileRoute("/_authed/analitik-pelanggan")({
  loader: async () => await getCustomers(),
  component: AnalitikPelangganPage,
  errorComponent: ({ error }) => <div>Error in AnalitikPelanggan: {error.message}</div>,
});

const pieColors = ["var(--chart-1)", "var(--chart-2)"];

// Data mock untuk tren membership
const memberTrend = [
  { month: "Jan", newMembers: 12 },
  { month: "Feb", newMembers: 18 },
  { month: "Mar", newMembers: 15 },
  { month: "Apr", newMembers: 22 },
  { month: "May", newMembers: 28 },
  { month: "Jun", newMembers: 25 },
  { month: "Jul", newMembers: 32 },
];

function AnalitikPelangganPage() {
  const customers = Route.useLoaderData();
  const totalCustomers = customers.length;
  const activeMembers = customers.filter((c) => c.member).length;
  const generalCustomers = totalCustomers - activeMembers;
  const totalPointsGiven = customers.reduce((acc, curr) => acc + curr.points, 0);
  const totalSpentByCustomers = customers.reduce((acc, curr) => acc + curr.totalSpent, 0);

  const topSpenders = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const membershipDistribution = [
    { name: "Member", value: activeMembers },
    { name: "Umum", value: generalCustomers },
  ];

  return (
    <>
      <ScrollReveal>
        <PageHeader
          title="Analitik Pelanggan"
          description="Statistik, tren keanggotaan, dan daftar top spender."
          actions={
            <Link to="/pelanggan" className={buttonVariants({ className: "rounded-xl" })}>
              <Users className="h-4 w-4" /> Kelola Pelanggan
            </Link>
          }
        />
      </ScrollReveal>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <ScrollReveal delay={100}>
          <StatCard
            title="Total Pelanggan"
            value={totalCustomers.toString()}
            icon={Users}
            description="Semua pelanggan terdaftar"
            trend={12.5}
          />
        </ScrollReveal>
        <ScrollReveal delay={200}>
          <StatCard
            title="Pelanggan Member"
            value={activeMembers.toString()}
            icon={Award}
            description="Pelanggan dengan kartu member"
            trend={8.2}
          />
        </ScrollReveal>
        <ScrollReveal delay={300}>
          <StatCard
            title="Total Poin Beredar"
            value={totalPointsGiven.toString()}
            icon={Star}
            description="Poin yang belum ditukarkan"
            trend={4.1}
          />
        </ScrollReveal>
        <ScrollReveal delay={400}>
          <StatCard
            title="Total Belanja Pelanggan"
            value={formatRupiah(totalSpentByCustomers)}
            icon={Activity}
            description="Dari semua pelanggan"
            trend={15.4}
          />
        </ScrollReveal>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Trend Member Baru */}
        <ScrollReveal delay={500} className="lg:col-span-2">
          <div className="glass flex h-full flex-col overflow-hidden rounded-2xl border-none">
            <div className="p-6 pb-2">
              <h3 className="text-lg font-bold tracking-tight">Tren Pendaftaran Member</h3>
              <p className="text-sm text-muted-foreground">Grafik penambahan member per bulan</p>
            </div>
            <div className="flex-1 p-6 pt-0">
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={memberTrend}
                    margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="var(--border)"
                      opacity={0.5}
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "12px",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      itemStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="newMembers"
                      name="Member Baru"
                      stroke="var(--chart-1)"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorMembers)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Membership Distribution */}
        <ScrollReveal delay={600}>
          <div className="glass flex h-[400px] flex-col overflow-hidden rounded-2xl border-none">
            <div className="p-6 pb-2">
              <h3 className="text-lg font-bold tracking-tight">Status Keanggotaan</h3>
              <p className="text-sm text-muted-foreground">Perbandingan Member vs Umum</p>
            </div>
            <div className="flex-1 p-6 pt-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={membershipDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                      animationDuration={1500}
                    >
                      {membershipDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        borderRadius: "8px",
                        border: "1px solid hsl(var(--border))",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex justify-center gap-6">
                {membershipDistribution.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: pieColors[i] }}
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Top Spenders List */}
      <ScrollReveal delay={700} className="mt-6">
        <div className="glass rounded-2xl border-none p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Top 5 Spender</h3>
              <p className="text-sm text-muted-foreground">
                Pelanggan dengan total transaksi terbesar
              </p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Trophy className="h-5 w-5" />
            </div>
          </div>
          <div className="space-y-4">
            {topSpenders.map((c, index) => (
              <div
                key={c.id}
                className="group flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-accent"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {c.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background font-bold text-[10px] shadow-sm border">
                      #{index + 1}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {c.name}
                    </p>
                    <p className="text-xs text-muted-foreground flex gap-2 items-center">
                      <span>{c.phone}</span>
                      <span>•</span>
                      <span className="text-primary font-medium">{c.points} Poin</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{formatRupiah(c.totalSpent)}</p>
                  <StatusBadge
                    label={c.member ? "Member" : "Umum"}
                    tone={c.member ? "info" : "neutral"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
