import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { PageHeader } from "@/components/PageHeader";
import { TablePanel } from "@/components/TablePanel";
import { StatusBadge } from "@/components/StatusBadge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { customers as initialCustomers, formatRupiah, Customer } from "@/lib/mockData";
import { toast } from "sonner";

export const Route = createFileRoute("/_authed/pelanggan")({
  component: PelangganPage,
});

const formSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter." }),
  phone: z.string().min(10, { message: "Nomor telepon tidak valid." }),
  email: z.string().email({ message: "Email tidak valid." }),
  member: z.string(),
});

function PelangganPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [q, setQ] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      member: "false",
    },
  });

  const filtered = useMemo(
    () =>
      customers.filter((c) => (c.name + c.phone + c.email).toLowerCase().includes(q.toLowerCase())),
    [q, customers],
  );

  const openDialog = (customer?: Customer) => {
    if (customer) {
      setEditingCustomer(customer);
      form.reset({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        member: customer.member ? "true" : "false",
      });
    } else {
      setEditingCustomer(null);
      form.reset({
        name: "",
        phone: "",
        email: "",
        member: "false",
      });
    }
    setIsDialogOpen(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id ? { ...c, ...values, member: values.member === "true" } : c,
        ),
      );
      toast.success("Pelanggan berhasil diperbarui");
    } else {
      const newCustomer: Customer = {
        id: `C${String(customers.length + 1).padStart(2, "0")}`,
        points: 0,
        totalSpent: 0,
        name: values.name,
        phone: values.phone,
        email: values.email,
        member: values.member === "true",
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      toast.success("Pelanggan baru berhasil ditambahkan");
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pelanggan ini?")) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      toast.success("Pelanggan berhasil dihapus");
    }
  };

  return (
    <>
      <PageHeader
        title="Pelanggan"
        description="Manajemen data pelanggan, keanggotaan, dan poin loyalitas."
      />

      <TablePanel
        search={q}
        onSearch={setQ}
        searchPlaceholder="Cari pelanggan…"
        count={filtered.length}
        headers={["Nama", "Telepon", "Email", "Status", "Poin", "Total Belanja", "Aksi"]}
        empty={filtered.length === 0}
        toolbar={
          <Button onClick={() => openDialog()} className="gap-2">
            <Plus className="h-4 w-4" />
            Tambah Pelanggan
          </Button>
        }
      >
        {filtered.map((c) => (
          <TableRow key={c.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                    {c.name
                      .split(" ")
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">{c.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{c.phone}</TableCell>
            <TableCell className="text-muted-foreground">{c.email}</TableCell>
            <TableCell>
              <StatusBadge
                label={c.member ? "Member" : "Umum"}
                tone={c.member ? "info" : "neutral"}
              />
            </TableCell>
            <TableCell className="font-semibold">{c.points}</TableCell>
            <TableCell className="font-semibold">{formatRupiah(c.totalSpent)}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={() => openDialog(c)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(c.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TablePanel>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
            </DialogTitle>
            <DialogDescription>
              {editingCustomer
                ? "Ubah data pelanggan di bawah ini."
                : "Masukkan detail pelanggan baru."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="Budi Santoso" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="08123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="budi@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="member"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Keanggotaan</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="false">Umum</SelectItem>
                        <SelectItem value="true">Member</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">Simpan</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
