import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, Search, ChevronRight, Pill } from "lucide-react";
import { useAuth } from "@/lib/auth";
import nexaLogo from "@/assets/nexa-logo.png";
import { navItems } from "@/lib/nav";
import { notifications, roleLabel } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollReveal, PageTransition } from "@/components/animations";

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, can } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = navItems.filter((i) => (user ? can(i.roles) : false));
  const groups = Array.from(new Set(visible.map((i) => i.group)));

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-md">
          <img
            src={nexaLogo}
            alt="Logo Apotek Nexa"
            className="h-8 w-8 object-contain"
            width={32}
            height={32}
          />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-extrabold leading-tight text-foreground">
            Apotek Nexa
          </p>
          <p className="text-xs font-medium text-primary">Sistem Informasi Apotek</p>
        </div>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-6">
        {groups.map((group, sIndex) => (
          <ScrollReveal key={group} delay={sIndex * 60} direction="right">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group}
            </p>
            <div className="space-y-0.5">
              {visible
                .filter((i) => i.group === group)
                .map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
            </div>
          </ScrollReveal>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-border text-[10px] text-muted-foreground text-center">
        <p>© 2026 Apotek Nexa</p>
        <p className="mt-0.5">v2.0.0</p>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const unread = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  const initials =
    user?.name
      ?.split(" ")
      ?.slice(0, 2)
      ?.map((p) => p[0])
      ?.join("")
      ?.toUpperCase() || "U";

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "glass sticky top-0 hidden h-screen shrink-0 overflow-hidden rounded-none border-y-0 border-l-0 transition-all duration-300 ease-in-out lg:block",
          sidebarOpen ? "w-64 opacity-100" : "w-0 border-none opacity-0",
        )}
      >
        <div className="w-64 h-full">
          <NavContent />
        </div>
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 border-none bg-transparent p-0">
          <div className="glass h-full rounded-none border-y-0 border-l-0">
            <NavContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-soft sticky top-0 z-30 flex h-16 items-center gap-3 rounded-none border-x-0 border-t-0 px-4 sm:px-6">
          <button
            className="grid h-10 w-10 place-items-center rounded-xl text-foreground/70 hover:bg-accent lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Buka menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <button
            className="hidden lg:grid h-10 w-10 place-items-center rounded-xl text-foreground/70 hover:bg-accent"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Buka tutup menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex-1"></div>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/notifikasi"
              className="relative grid h-10 w-10 place-items-center rounded-xl text-foreground/70 transition-colors hover:bg-accent"
              aria-label="Notifikasi"
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {unread}
                </span>
              )}
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl p-1 pr-2 outline-none transition-colors hover:bg-accent">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-sm font-semibold text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden min-w-0 text-left sm:block">
                  <p className="max-w-[120px] truncate text-sm font-semibold leading-tight text-foreground">
                    {user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user && roleLabel[user.role]}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/pengaturan" className="w-full flex items-center">
                    Pengaturan <ChevronRight className="ml-auto h-4 w-4" />
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/notifikasi" className="w-full flex items-center">
                    Notifikasi
                    {unread > 0 && (
                      <Badge className="ml-auto bg-destructive text-destructive-foreground">
                        {unread}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
          <PageTransition>
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
