import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Minus, Trash2, ShoppingCart, Receipt, Wallet } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatRupiah, medicines } from "@/lib/mockData";
import { medImage } from "@/lib/medImages";

export const Route = createFileRoute("/_authed/kasir")({
  component: Kasir,
});

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  unit: string;
  stock: number;
}

function Kasir() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState("Tunai");
  const [paid, setPaid] = useState("");

  const inStock = useMemo(
    () =>
      medicines
        .filter((m) => m.stock > 0)
        .filter((m) => (m.name || "").toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const add = (m: (typeof medicines)[number]) => {
    setCart((c) => {
      const ex = c.find((i) => i.id === m.id);
      if (ex) {
        if (ex.qty >= m.stock) {
          toast.warning("Stok tidak mencukupi");
          return c;
        }
        return c.map((i) => (i.id === m.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...c,
        { id: m.id, name: m.name, price: m.price, qty: 1, unit: m.unit, stock: m.stock },
      ];
    });
  };

  const changeQty = (id: string, d: number) =>
    setCart((c) =>
      c
        .map((i) => (i.id === id ? { ...i, qty: Math.min(i.stock, Math.max(0, i.qty + d)) } : i))
        .filter((i) => i.qty > 0),
    );

  const remove = (id: string) => setCart((c) => c.filter((i) => i.id !== id));

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.11);
  const total = subtotal + tax;
  const paidNum = Number(paid) || 0;
  const change = paidNum - total;

  const checkout = () => {
    if (cart.length === 0) return toast.error("Keranjang masih kosong");
    if (method === "Tunai" && paidNum < total)
      return toast.error("Pembayaran kurang", {
        description: "Nominal bayar lebih kecil dari total.",
      });
    toast.success("Transaksi berhasil", {
      description: `Total ${formatRupiah(total)} dibayar via ${method}.`,
    });
    setCart([]);
    setPaid("");
  };

  return (
    <>
      <PageHeader
        title="Kasir / POS"
        description="Buat transaksi penjualan dengan cepat dan akurat."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Product list */}
        <div className="glass rounded-2xl p-4 lg:col-span-3">
          <div className="relative mb-4">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari nama obat…"
              className="h-11 rounded-xl bg-secondary/60 pl-9"
            />
          </div>
          <ScrollArea className="h-[calc(100vh-20rem)] pr-3">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {inStock.map((m) => (
                <button
                  key={m.id}
                  onClick={() => add(m)}
                  className="group flex flex-col rounded-xl border border-border bg-card/60 p-3 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="mb-2 aspect-square w-full overflow-hidden rounded-lg bg-secondary ring-1 ring-border">
                    <img
                      src={medImage(m.category)}
                      alt={m.name}
                      loading="lazy"
                      width={160}
                      height={160}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <Badge variant="outline" className="mb-2 w-fit rounded-full text-[10px]">
                    {m.category}
                  </Badge>
                  <p className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-foreground">
                    {m.name}
                  </p>
                  <p className="mt-2 text-sm font-bold text-primary">{formatRupiah(m.price)}</p>
                  <p className="text-xs text-muted-foreground">
                    Stok: {m.stock} {m.unit}
                  </p>
                </button>
              ))}
              {inStock.length === 0 && (
                <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
                  Obat tidak ditemukan.
                </p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Cart */}
        <div className="glass flex flex-col rounded-2xl p-4 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-foreground">Keranjang</h3>
            <Badge className="ml-auto rounded-full">{cart.length} item</Badge>
          </div>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-2 pr-3">
              {cart.length === 0 && (
                <div className="grid place-items-center py-14 text-center text-sm text-muted-foreground">
                  <ShoppingCart className="mb-2 h-8 w-8 opacity-40" />
                  Belum ada item. Klik obat untuk menambahkan.
                </div>
              )}
              {cart.map((i) => (
                <div key={i.id} className="rounded-xl border border-border bg-card/60 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 text-sm font-semibold text-foreground">{i.name}</p>
                    <button
                      onClick={() => remove(i.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => changeQty(i.id, -1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm font-semibold">{i.qty}</span>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 rounded-lg"
                        onClick={() => changeQty(i.id, 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatRupiah(i.price * i.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-3 space-y-2 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>PPN 11%</span>
              <span className="font-medium text-foreground">{formatRupiah(tax)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>Total</span>
              <span>{formatRupiah(total)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="rounded-xl">
                  <Wallet className="h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunai">Tunai</SelectItem>
                  <SelectItem value="QRIS">QRIS</SelectItem>
                  <SelectItem value="Kartu">Kartu</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={paid}
                onChange={(e) => setPaid(e.target.value.replace(/\D/g, ""))}
                placeholder="Nominal bayar"
                inputMode="numeric"
                className="rounded-xl"
                disabled={method !== "Tunai"}
              />
            </div>
            {method === "Tunai" && paidNum > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kembalian</span>
                <span
                  className={
                    change >= 0 ? "font-semibold text-success" : "font-semibold text-destructive"
                  }
                >
                  {formatRupiah(Math.max(0, change))}
                </span>
              </div>
            )}

            <Button onClick={checkout} className="h-11 w-full rounded-xl text-base font-semibold">
              <Receipt className="h-4 w-4" /> Bayar Sekarang
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
