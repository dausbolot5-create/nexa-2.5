import { useState } from "react";
import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck, LogIn } from "lucide-react";
import nexaLogo from "@/assets/nexa-logo.png";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { roleLabel } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

const demoAccounts = [
  { role: "admin" as const, username: "admin", password: "admin123" },
  { role: "apoteker" as const, username: "apoteker", password: "apoteker123" },
  { role: "kasir" as const, username: "kasir", password: "kasir123" },
  { role: "pelanggan" as const, username: "pelanggan", password: "pelanggan123" },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const res = login(username, password);
      setLoading(false);
      if (res.ok) {
        toast.success("Berhasil masuk", { description: "Selamat datang di Apotek Nexa" });
        // Jika pelanggan arahkan ke portal-pelanggan, selain itu ke dashboard
        if (res.user?.role === "pelanggan") {
          navigate({ to: "/portal-pelanggan" });
        } else {
          navigate({ to: "/dashboard" });
        }
      } else {
        toast.error("Gagal masuk", { description: res.error });
      }
    }, 500);
  };

  const quick = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl bg-primary/10 shadow-lg ring-1 ring-primary/20">
            <img
              src={nexaLogo}
              alt="Logo Apotek Nexa"
              className="h-9 w-9 object-contain"
              width={36}
              height={36}
            />
          </span>
          <div>
            <p className="text-lg font-extrabold text-foreground">Apotek Nexa</p>
            <p className="text-sm font-medium text-primary">Sistem Informasi Apotek</p>
          </div>
        </div>

        <div className="max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground">
            Kelola apotek Anda dengan cara yang lebih cerdas.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Kasir cepat, manajemen stok akurat, resep terpadu, dan laporan real-time — semuanya
            dalam satu dasbor yang elegan.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              ["1.2K+", "Transaksi/bln"],
              ["320", "Jenis Obat"],
              ["99,9%", "Akurasi Stok"],
            ].map(([v, l]) => (
              <div key={l} className="glass rounded-2xl p-4">
                <p className="text-xl font-bold text-foreground">{v}</p>
                <p className="mt-1 text-xs text-muted-foreground">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success" /> Akses berbasis peran & data terenkripsi
        </p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="glass w-full max-w-md animate-rise rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-2xl bg-primary/10 ring-1 ring-primary/20">
              <img
                src={nexaLogo}
                alt="Logo Apotek Nexa"
                className="h-8 w-8 object-contain"
                width={32}
                height={32}
              />
            </span>
            <div>
              <p className="font-extrabold text-foreground">Apotek Nexa</p>
              <p className="text-xs text-primary">Sistem Informasi Apotek</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">Masuk ke akun</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gunakan kredensial Anda untuk mengakses sistem.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="h-11 rounded-xl"
                autoComplete="username"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="h-11 rounded-xl pr-11"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={show ? "Sembunyikan" : "Tampilkan"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl text-base font-semibold"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Memproses…" : "Masuk"}
            </Button>
          </form>

          <div className="mt-6">
            <p className="mb-2 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Akun demo — klik untuk isi
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoAccounts.map((a) => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => quick(a.username, a.password)}
                  className="rounded-xl border border-border bg-secondary/60 px-2 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
                >
                  {roleLabel[a.role]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
