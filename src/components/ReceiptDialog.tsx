import { useRef } from "react";
import { formatRupiah } from "@/lib/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export interface ReceiptData {
  code: string;
  date: string;
  cashier: string;
  items: { name: string; qty: number; price: number; unit: string }[];
  subtotal: number;
  tax: number;
  total: number;
  paid: number;
  change: number;
  method: string;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data: ReceiptData | null;
}

export function ReceiptDialog({ open, onOpenChange, data }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const handlePrint = () => {
    const el = ref.current;
    if (!el) return;
    const w = window.open("", "_blank", "width=400,height=600");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Struk ${data.code}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Courier New',monospace;font-size:12px;padding:16px;max-width:320px;margin:0 auto}
  .center{text-align:center}
  .bold{font-weight:bold}
  .line{border-top:1px dashed #000;margin:8px 0}
  .row{display:flex;justify-content:space-between}
  .mt{margin-top:4px}
  h2{font-size:16px;margin-bottom:2px}
  @media print{button{display:none}}
</style></head><body>`);
    w.document.write(el.innerHTML);
    w.document.write("</body></html>");
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Struk Pembayaran</DialogTitle>
        </DialogHeader>

        <div ref={ref} className="font-mono text-xs leading-relaxed">
          <div className="text-center">
            <h2 className="text-base font-bold">Apotek Nexa</h2>
            <p className="text-muted-foreground">Jl. Sehat Selalu No. 1</p>
            <p className="text-muted-foreground">Telp: 021-1234567</p>
          </div>
          <div className="my-2 border-t border-dashed border-foreground/30" />
          <div className="flex justify-between">
            <span>No:</span>
            <span className="font-semibold">{data.code}</span>
          </div>
          <div className="flex justify-between">
            <span>Tanggal:</span>
            <span>{data.date}</span>
          </div>
          <div className="flex justify-between">
            <span>Kasir:</span>
            <span>{data.cashier}</span>
          </div>
          <div className="my-2 border-t border-dashed border-foreground/30" />
          {data.items.map((item, i) => (
            <div key={i} className="mt-1">
              <p className="font-semibold">{item.name}</p>
              <div className="flex justify-between pl-2">
                <span>
                  {item.qty} {item.unit} x {formatRupiah(item.price)}
                </span>
                <span>{formatRupiah(item.qty * item.price)}</span>
              </div>
            </div>
          ))}
          <div className="my-2 border-t border-dashed border-foreground/30" />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatRupiah(data.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>PPN 11%</span>
            <span>{formatRupiah(data.tax)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm">
            <span>TOTAL</span>
            <span>{formatRupiah(data.total)}</span>
          </div>
          <div className="my-2 border-t border-dashed border-foreground/30" />
          <div className="flex justify-between">
            <span>Bayar ({data.method})</span>
            <span>{formatRupiah(data.paid)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Kembali</span>
            <span>{formatRupiah(data.change)}</span>
          </div>
          <div className="my-2 border-t border-dashed border-foreground/30" />
          <p className="text-center text-muted-foreground">Terima kasih atas kunjungan Anda!</p>
          <p className="text-center text-muted-foreground">Semoga lekas sembuh 🙏</p>
        </div>

        <DialogFooter>
          <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button className="rounded-xl" onClick={handlePrint}>
            <Printer className="h-4 w-4" /> Cetak Struk
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
