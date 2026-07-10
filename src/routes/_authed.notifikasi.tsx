import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  Bell,
  Package,
  CalendarClock,
  ShoppingCart,
  Settings2,
  Check,
  ArrowLeft,
  ChevronDown,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { notifications as seed, type AppNotification } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/notifikasi")({
  component: NotifikasiPage,
});

const iconByType = {
  stok: Package,
  kadaluarsa: CalendarClock,
  penjualan: ShoppingCart,
  sistem: Settings2,
} as const;

const toneByType = {
  stok: "bg-warning/20 text-warning",
  kadaluarsa: "bg-info/15 text-info",
  penjualan: "bg-success/15 text-success",
  sistem: "bg-primary/12 text-primary",
} as const;

function NotifikasiPage() {
  const router = useRouter();
  const [items, setItems] = useState<AppNotification[]>(seed);
  const [openId, setOpenId] = useState<string | null>(null);
  const unread = items.filter((n) => !n.read).length;

  const markAll = () => setItems((i) => i.map((n) => ({ ...n, read: true })));

  const handleClick = (id: string) => {
    // Klik untuk membuka; klik lagi pada notifikasi yang sama akan menutupnya.
    setOpenId((cur) => (cur === id ? null : id));
    setItems((i) => i.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const goBack = () => {
    if (window.history.length > 1) router.history.back();
    else router.navigate({ to: "/dashboard" });
  };

  return (
    <>
      <div className="mb-4">
        <Button
          variant="ghost"
          className="rounded-xl px-2 text-muted-foreground hover:text-foreground"
          onClick={goBack}
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
      </div>

      <PageHeader
        title="Notifikasi"
        description={
          unread > 0 ? `${unread} notifikasi belum dibaca` : "Semua notifikasi sudah dibaca"
        }
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={markAll}
            disabled={unread === 0}
          >
            <Check className="h-4 w-4" /> Tandai semua dibaca
          </Button>
        }
      />

      <div className="glass overflow-hidden rounded-2xl">
        {items.map((n, idx) => {
          const Icon = iconByType[n.type];
          const isOpen = openId === n.id;
          return (
            <div key={n.id} className={cn(idx !== items.length - 1 && "border-b border-border")}>
              <button
                onClick={() => handleClick(n.id)}
                aria-expanded={isOpen}
                className={cn(
                  "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-accent/50",
                  !n.read && "bg-primary/5",
                  isOpen && "bg-accent/40",
                )}
              >
                <span
                  className={cn(
                    "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                    toneByType[n.type],
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold text-foreground">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                  </div>
                  <p className={cn("mt-0.5 text-sm text-muted-foreground", !isOpen && "truncate")}>
                    {n.desc}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground/70">{n.time}</p>
                </div>
                <ChevronDown
                  className={cn(
                    "mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    isOpen && "rotate-180",
                  )}
                />
              </button>
              {isOpen && (
                <div className="animate-rise border-t border-border/60 bg-background/30 px-4 py-4 pl-[4.25rem]">
                  <p className="text-sm text-foreground">{n.desc}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Kategori:{" "}
                    <span className="font-medium capitalize text-foreground">{n.type}</span> ·{" "}
                    {n.time}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 rounded-lg px-2 text-xs text-muted-foreground"
                    onClick={() => setOpenId(null)}
                  >
                    Tutup
                  </Button>
                </div>
              )}
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="grid place-items-center py-16 text-muted-foreground">
            <Bell className="mb-2 h-8 w-8 opacity-40" /> Tidak ada notifikasi
          </div>
        )}
      </div>
    </>
  );
}
