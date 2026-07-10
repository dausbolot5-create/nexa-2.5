import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ShoppingBag, FileText, Pill, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/mockData";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/_authed/portal-pelanggan")({
  component: PortalPelangganDashboard,
});

const recentOrders = [
  {
    id: "APT-2410-0128",
    date: "10 Jul 2026",
    items: "Paracetamol 500mg, Vitamin C",
    total: 85000,
    status: "Dikirim",
  },
  {
    id: "APT-2410-0119",
    date: "07 Jul 2026",
    items: "Amlodipine 5mg (30 tab)",
    total: 120000,
    status: "Selesai",
  },
  {
    id: "APT-2410-0102",
    date: "01 Jul 2026",
    items: "Insulin pen, Alkohol swab",
    total: 340000,
    status: "Selesai",
  },
];

const reminders = [
  { name: "Amlodipine 5mg", time: "08:00 pagi", remaining: "9 tablet tersisa", progress: 70 },
  { name: "Metformin 500mg", time: "13:00 siang", remaining: "5 tablet tersisa", progress: 40 },
  { name: "Vitamin D3", time: "19:00 malam", remaining: "27 tablet tersisa", progress: 90 },
];

function PortalPelangganDashboard() {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-glow p-6 md:p-8 text-primary-foreground shadow-[var(--shadow-elevated)] relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-8 bottom-0 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative z-10">
          <p className="text-sm opacity-90 font-medium">Selamat datang di Apotek Nexa,</p>
          <h1 className="mt-1 text-2xl md:text-3xl font-bold tracking-tight">Siti Rahmawati 👋</h1>
          <p className="mt-2 text-sm opacity-90 max-w-md leading-relaxed">
            Pesan obat, unggah resep, dan atur pengingat minum obat harian Anda dengan mudah di satu
            tempat.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 shadow-sm border-0 font-semibold h-9 px-4"
            >
              <Plus className="mr-2 h-4 w-4" /> Pesan Obat
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground h-9 px-4"
            >
              <FileText className="mr-2 h-4 w-4" /> Unggah Resep
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass rounded-xl p-5 border-none flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Pesanan Aktif</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-foreground">3</h4>
            <p className="text-xs text-primary font-medium mt-1">+1 minggu ini</p>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border-none flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
              <FileText className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Resep Tersimpan</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-foreground">8</h4>
            <p className="text-xs text-amber-500 font-medium mt-1">2 perlu diperbarui</p>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border-none flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <Pill className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Obat Rutin</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-foreground">5</h4>
            <p className="text-xs text-emerald-500 font-medium mt-1">Stok cukup</p>
          </div>
        </div>

        <div className="glass rounded-xl p-5 border-none flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <TrendingUp className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Belanja</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold text-foreground">Rp 1,2jt</h4>
            <p className="text-xs text-muted-foreground mt-1">Bulan ini</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="glass flex flex-col overflow-hidden rounded-2xl border-none">
          <div className="flex items-center justify-between p-5 pb-3 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Pesanan Terakhir</h3>
              <p className="text-xs text-muted-foreground">Status pesanan obat Anda</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary font-medium hover:text-primary/80"
            >
              Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-col p-2">
            {recentOrders.map((order, i) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl p-3 hover:bg-accent/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.items}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{formatRupiah(order.total)}</p>
                  <div className="mt-1">
                    <StatusBadge
                      label={order.status}
                      tone={
                        order.status === "Selesai"
                          ? "success"
                          : order.status === "Dikirim"
                            ? "info"
                            : "warning"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders */}
        <div className="glass flex flex-col overflow-hidden rounded-2xl border-none">
          <div className="flex items-center justify-between p-5 pb-3 border-b border-border">
            <div>
              <h3 className="font-semibold text-foreground">Pengingat Minum Obat</h3>
              <p className="text-xs text-muted-foreground">Jadwal konsumsi hari ini</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-primary font-medium hover:text-primary/80"
            >
              Atur Jadwal <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          <div className="flex flex-col gap-1 p-3">
            {reminders.map((reminder, i) => (
              <div
                key={i}
                className="flex flex-col justify-center rounded-xl p-3 hover:bg-accent/50 transition-colors border border-transparent hover:border-border/50"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{reminder.name}</p>
                      <p className="text-xs text-muted-foreground font-medium">{reminder.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                    {reminder.remaining}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${reminder.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
