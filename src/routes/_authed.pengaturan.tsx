import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Store, Bell, Palette, ShieldCheck, Save } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/auth";
import { roleLabel } from "@/lib/mockData";

export const Route = createFileRoute("/_authed/pengaturan")({
  component: PengaturanPage,
});

function SectionCard({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Store;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass animate-rise rounded-2xl p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  defaultChecked = true,
}: {
  label: string;
  desc: string;
  defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch checked={on} onCheckedChange={setOn} />
    </div>
  );
}

function PengaturanPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Pengaturan" description="Kelola preferensi apotek dan akun Anda." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SectionCard icon={Store} title="Profil Apotek" desc="Informasi identitas apotek">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nama Apotek</Label>
              <Input defaultValue="Apotek Nexa" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Alamat</Label>
              <Input defaultValue="Jl. Merdeka No. 45, Jakarta" className="rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Telepon</Label>
                <Input defaultValue="021-555-0123" className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>No. Izin</Label>
                <Input defaultValue="APT-2025-0451" className="rounded-xl" />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={ShieldCheck} title="Akun Saya" desc="Detail akun yang sedang masuk">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nama</Label>
              <Input defaultValue={user?.name} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input defaultValue={user?.email} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Peran</Label>
              <Input value={user ? roleLabel[user.role] : ""} disabled className="rounded-xl" />
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Bell} title="Notifikasi" desc="Atur peringatan sistem">
          <ToggleRow
            label="Peringatan stok menipis"
            desc="Notifikasi saat stok di bawah batas minimum"
          />
          <Separator />
          <ToggleRow label="Peringatan kadaluarsa" desc="Ingatkan obat mendekati kadaluarsa" />
          <Separator />
          <ToggleRow
            label="Ringkasan penjualan harian"
            desc="Kirim rangkuman setiap tutup toko"
            defaultChecked={false}
          />
        </SectionCard>

        <SectionCard icon={Palette} title="Preferensi" desc="Pengalaman aplikasi">
          <ToggleRow label="Struk otomatis" desc="Cetak struk setelah transaksi" />
          <Separator />
          <ToggleRow
            label="Suara notifikasi"
            desc="Bunyikan saat ada peringatan"
            defaultChecked={false}
          />
          <Separator />
          <ToggleRow label="Konfirmasi hapus data" desc="Minta konfirmasi sebelum menghapus" />
        </SectionCard>
      </div>

      <div className="flex justify-end">
        <Button className="rounded-xl" onClick={() => toast.success("Pengaturan disimpan")}>
          <Save className="h-4 w-4" /> Simpan Perubahan
        </Button>
      </div>
    </>
  );
}
