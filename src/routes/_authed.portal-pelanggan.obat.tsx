import { createFileRoute } from "@tanstack/react-router";
import { Pill, Clock, Plus, Bell } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authed/portal-pelanggan/obat")({
  head: () => ({ meta: [{ title: "Obat Rutin — Apotek Nexa" }] }),
  component: MedicinesPage,
});

const meds = [
  {
    name: "Amlodipine 5mg",
    purpose: "Hipertensi",
    schedule: "1× sehari · 08:00",
    remaining: 9,
    total: 30,
    refill: true,
    reminder: true,
  },
  {
    name: "Metformin 500mg",
    purpose: "Diabetes tipe 2",
    schedule: "2× sehari · 08:00, 20:00",
    remaining: 12,
    total: 60,
    refill: true,
    reminder: true,
  },
  {
    name: "Vitamin D3 1000 IU",
    purpose: "Suplemen",
    schedule: "1× sehari · 19:00",
    remaining: 27,
    total: 30,
    refill: false,
    reminder: true,
  },
  {
    name: "Omeprazole 20mg",
    purpose: "GERD",
    schedule: "1× sehari · 07:00",
    remaining: 4,
    total: 14,
    refill: true,
    reminder: false,
  },
  {
    name: "Simvastatin 10mg",
    purpose: "Kolesterol",
    schedule: "1× sehari · 21:00",
    remaining: 22,
    total: 30,
    refill: false,
    reminder: true,
  },
];

function MedicinesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Obat Rutin Saya</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pantau stok dan jadwal minum obat harian
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Obat
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {meds.map((m) => {
          const pct = Math.round((m.remaining / m.total) * 100);
          const low = pct < 30;
          return (
            <Card key={m.name} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                    <Pill className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">{m.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.purpose}</p>
                  </div>
                  {low && (
                    <Badge
                      variant="outline"
                      className="bg-amber-500/15 text-amber-600 border-amber-500/40"
                    >
                      Stok Rendah
                    </Badge>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Sisa stok</span>
                    <span className="font-semibold">
                      {m.remaining} / {m.total} tablet
                    </span>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> {m.schedule}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border/60">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    Pengingat
                    <Switch defaultChecked={m.reminder} className="ml-1" />
                  </label>
                  <Button size="sm" variant={low ? "default" : "outline"}>
                    Pesan Ulang
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
