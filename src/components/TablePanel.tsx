import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TablePanel({
  search,
  onSearch,
  searchPlaceholder = "Cari…",
  toolbar,
  headers,
  children,
  empty,
  count,
}: {
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  headers: string[];
  children: ReactNode;
  empty?: boolean;
  count?: number;
}) {
  return (
    <div className="glass animate-rise overflow-hidden rounded-2xl">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center">
        {onSearch && (
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 rounded-xl bg-secondary/60 pl-9"
            />
          </div>
        )}
        {typeof count === "number" && (
          <span className="hidden text-sm text-muted-foreground sm:inline">{count} data</span>
        )}
        <div className="flex items-center gap-2 sm:ml-auto">{toolbar}</div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {headers.map((h) => (
                <TableHead key={h} className="whitespace-nowrap font-semibold text-foreground/70">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>{children}</TableBody>
        </Table>
        {empty && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Tidak ada data ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
