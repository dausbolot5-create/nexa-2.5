import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_authed/portal-pelanggan/profil")({
  head: () => ({ meta: [{ title: "Profil Saya — Apotek Nexa" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const initials =
    user?.name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((p) => p[0])
      ?.join("")
      ?.toUpperCase() || "U";

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Profil Saya</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola informasi akun dan preferensi Anda
        </p>
      </div>

      <Card className="shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/80" />
        <CardContent className="p-6 -mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                >
                  <Shield className="h-3 w-3 mr-1" /> Terverifikasi
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Anggota sejak Maret 2024</p>
            </div>
            <Button variant="outline">Edit Foto</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input id="nama" defaultValue={user?.name || ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tgl">Tanggal Lahir</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="tgl" defaultValue="14 Agustus 1990" className="pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" defaultValue={user?.email || ""} className="pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="hp">Nomor HP</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="hp" defaultValue="+62 812 3456 7890" className="pl-9" />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="alamat">Alamat Pengiriman</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="alamat"
                defaultValue="Jl. Melati No. 24, Kel. Kebon Jeruk, Jakarta Barat 11530"
                className="pl-9"
              />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Button variant="ghost">Batal</Button>
            <Button>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Informasi BPJS / Asuransi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Nomor BPJS</Label>
            <Input defaultValue="0001 2345 6789" />
          </div>
          <div className="space-y-1.5">
            <Label>Kelas</Label>
            <Input defaultValue="Kelas 1" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
