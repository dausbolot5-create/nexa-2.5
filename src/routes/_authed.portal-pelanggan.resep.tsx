import { createFileRoute } from "@tanstack/react-router";
import { FileText, Upload, Calendar, Stethoscope, Download } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authed/portal-pelanggan/resep")({
  head: () => ({ meta: [{ title: "Resep Digital — Apotek Nexa" }] }),
  component: PrescriptionsPage,
});

const prescriptions = [
  {
    id: "RX-2026-0034",
    doctor: "dr. Budi Santoso, Sp.PD",
    date: "05 Jul 2026",
    items: 4,
    status: "Aktif",
    expiry: "05 Okt 2026",
  },
  {
    id: "RX-2026-0021",
    doctor: "dr. Anita Wijaya, Sp.A",
    date: "12 Jun 2026",
    items: 2,
    status: "Aktif",
    expiry: "12 Sep 2026",
  },
  {
    id: "RX-2026-0018",
    doctor: "dr. Rina Halim",
    date: "01 Jun 2026",
    items: 3,
    status: "Digunakan",
    expiry: "01 Sep 2026",
  },
  {
    id: "RX-2026-0009",
    doctor: "dr. Budi Santoso, Sp.PD",
    date: "10 Apr 2026",
    items: 5,
    status: "Kadaluarsa",
    expiry: "10 Jul 2026",
  },
];

const tone = (s: string) =>
  s === "Aktif"
    ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
    : s === "Digunakan"
      ? "bg-muted text-muted-foreground border-border"
      : "bg-red-500/10 text-red-600 border-red-500/30";

function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Resep Digital</h1>
          <p className="text-sm text-muted-foreground mt-1">Simpan dan kelola resep dokter Anda</p>
        </div>
        <Button className="shadow-[var(--shadow-soft)]">
          <Upload className="mr-2 h-4 w-4" /> Unggah Resep Baru
        </Button>
      </div>

      <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-br from-accent/40 to-transparent">
        <CardContent className="p-6 md:p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold">Unggah foto resep dokter</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
            Apoteker kami akan memverifikasi resep Anda dalam waktu kurang dari 15 menit.
          </p>
          <Button variant="outline" className="mt-4">
            Pilih File
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {prescriptions.map((p) => (
          <Card key={p.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-accent/50 text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{p.id}</h3>
                    <p className="text-xs text-muted-foreground">{p.date}</p>
                  </div>
                </div>
                <Badge variant="outline" className={tone(p.status)}>
                  {p.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Stethoscope className="h-4 w-4 text-muted-foreground mr-2" />
                  <span>{p.doctor}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-muted-foreground">
                    Berlaku s/d: <span className="font-medium text-foreground">{p.expiry}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <span className="text-sm text-muted-foreground">{p.items} jenis obat</span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="Unduh Salinan">
                    <Download className="h-4 w-4" />
                  </Button>
                  {p.status === "Aktif" && (
                    <Button size="sm" className="h-8">
                      Tebus Obat
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
