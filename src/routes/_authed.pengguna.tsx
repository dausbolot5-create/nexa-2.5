import { useMemo, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { UserPlus, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { roleLabel, type Role } from "@/lib/mockData";
import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createServerFn } from "@tanstack/react-start";

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  return await db.select().from(usersTable);
});

const addUser = createServerFn({ method: "POST" })
  .validator(
    (d: {
      name: string;
      username: string;
      email: string;
      password: string;
      role: string;
      phone: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const id = `U-${Date.now()}`;
    await db.insert(usersTable).values({
      id,
      name: data.name,
      username: data.username,
      email: data.email,
      passwordHash: data.password, // ponytail: plain text for demo, hash with bcrypt for prod
      role: data.role,
      phone: data.phone,
      active: true,
    });
    return id;
  });

const toggleUser = createServerFn({ method: "POST" })
  .validator((d: { id: string; active: boolean }) => d)
  .handler(async ({ data }) => {
    await db.update(usersTable).set({ active: data.active }).where(eq(usersTable.id, data.id));
  });

export const Route = createFileRoute("/_authed/pengguna")({
  loader: async () => await getUsers(),
  component: PenggunaPage,
});

const roleTone = {
  admin: "destructive",
  apoteker: "info",
  kasir: "success",
  pelanggan: "default",
} as const;

const emptyForm = { name: "", username: "", email: "", password: "", role: "kasir", phone: "" };

function PenggunaPage() {
  const { user } = useAuth();
  const dbUsers = Route.useLoaderData();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(
    () =>
      dbUsers.filter((u) =>
        (u.name + u.username + u.email).toLowerCase().includes(q.toLowerCase()),
      ),
    [dbUsers, q],
  );

  if (user?.role !== "admin") {
    return (
      <div className="glass mx-auto mt-10 max-w-md rounded-2xl p-8 text-center">
        <ShieldAlert className="mx-auto h-10 w-10 text-warning" />
        <h2 className="mt-3 text-lg font-bold text-foreground">Akses Terbatas</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hanya Administrator yang dapat mengelola pengguna.
        </p>
      </div>
    );
  }

  const toggle = async (id: string, current: boolean) => {
    await toggleUser({ data: { id, active: !current } });
    toast.success("Status pengguna diperbarui");
    router.invalidate();
  };

  const handleSave = async () => {
    if (!form.name || !form.username || !form.email || !form.password) {
      return toast.error("Nama, username, email, dan password wajib diisi");
    }
    setSaving(true);
    try {
      await addUser({ data: form });
      toast.success(`Pengguna "${form.name}" berhasil ditambahkan`);
      setForm(emptyForm);
      setOpen(false);
      router.invalidate();
    } catch {
      toast.error("Gagal menambah pengguna");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Pengguna"
        description="Kelola akun staf dan hak akses berbasis peran."
        actions={
          <Button onClick={() => setOpen(true)} className="rounded-xl">
            <UserPlus className="h-4 w-4" /> Tambah Pengguna
          </Button>
        }
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari pengguna…"
        count={filtered.length}
        headers={["Nama", "Username", "Email", "Peran", "Telepon", "Aktif"]}
        empty={filtered.length === 0}
      >
        {filtered.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {u.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{u.name}</span>
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm text-muted-foreground">{u.username}</TableCell>
            <TableCell className="text-muted-foreground">{u.email}</TableCell>
            <TableCell>
              <StatusBadge
                label={roleLabel[u.role as Role] ?? u.role}
                tone={roleTone[u.role as keyof typeof roleTone] ?? "default"}
              />
            </TableCell>
            <TableCell className="text-muted-foreground">{u.phone}</TableCell>
            <TableCell>
              <Switch checked={u.active} onCheckedChange={() => toggle(u.id, u.active)} />
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {(
              [
                ["name", "Nama Lengkap", "text"],
                ["username", "Username", "text"],
                ["email", "Email", "email"],
                ["password", "Password", "password"],
                ["phone", "Telepon", "tel"],
              ] as const
            ).map(([key, label, type]) => (
              <div key={key} className="grid gap-1.5">
                <Label htmlFor={key}>{label}</Label>
                <Input
                  id={key}
                  type={type}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="rounded-xl"
                />
              </div>
            ))}
            <div className="grid gap-1.5">
              <Label>Peran</Label>
              <Select value={form.role} onValueChange={(v) => setForm((f) => ({ ...f, role: v }))}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="apoteker">Apoteker</SelectItem>
                  <SelectItem value="kasir">Kasir</SelectItem>
                  <SelectItem value="pelanggan">Pelanggan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button className="rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
