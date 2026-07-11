import { createFileRoute } from "@tanstack/react-router";
import { Heart, Activity, Droplet, Weight, AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authed/portal-pelanggan/kesehatan")({
  head: () => ({ meta: [{ title: "Riwayat Kesehatan — Apotek Nexa" }] }),
  component: HealthPage,
});

const vitals = [
  {
    label: "Tekanan Darah",
    value: "128 / 82",
    unit: "mmHg",
    icon: Heart,
    tone: "warning",
  },
  {
    label: "Gula Darah",
    value: "112",
    unit: "mg/dL",
    icon: Droplet,
    tone: "success",
  },
  {
    label: "Berat Badan",
    value: "62",
    unit: "kg",
    icon: Weight,
    tone: "success",
  },
  {
    label: "Detak Jantung",
    value: "76",
    unit: "bpm",
    icon: Activity,
    tone: "success",
  },
];

const conditions = ["Hipertensi", "Diabetes tipe 2", "Alergi Sulfa"];

const history = [
  {
    date: "05 Jul 2026",
    type: "Kontrol Rutin",
    doctor: "dr. Budi Santoso, Sp.PD",
    note: "Tekanan darah stabil, lanjutkan Amlodipine",
  },
  {
    date: "12 Jun 2026",
    type: "Konsultasi",
    doctor: "dr. Anita Wijaya, Sp.A",
    note: "Resep multivitamin anak",
  },
  {
    date: "01 Jun 2026",
    type: "Cek Lab",
    doctor: "Lab Klinik Prima",
    note: "HbA1c: 6.8% (baik terkontrol)",
  },
];

const toneClass = (t: string) =>
  t === "warning" ? "text-amber-600 bg-amber-500/15" : "text-emerald-600 bg-emerald-500/15";

function HealthPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Riwayat Kesehatan</h1>
        <p className="text-sm text-muted-foreground mt-1">Ringkasan kondisi dan pemeriksaan Anda</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {vitals.map((v) => (
          <Card key={v.label} className="shadow-sm">
            <CardContent className="p-4">
              <div
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${toneClass(v.tone)}`}
              >
                <v.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xs text-muted-foreground font-medium">{v.label}</p>
              <p className="mt-1">
                <span className="text-2xl font-bold">{v.value}</span>
                <span className="text-sm text-muted-foreground ml-1">{v.unit}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              Kondisi & Alergi
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {conditions.map((c) => (
              <Badge
                key={c}
                variant="outline"
                className="bg-accent text-accent-foreground border-primary/20"
              >
                {c}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Riwayat Kunjungan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {history.map((h, i) => (
              <div key={i} className="flex gap-4 relative">
                <div className="flex flex-col items-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-primary/20" />
                  {i < history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{h.type}</p>
                    <Badge variant="secondary" className="text-xs">
                      {h.date}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{h.doctor}</p>
                  <p className="text-sm mt-2">{h.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
