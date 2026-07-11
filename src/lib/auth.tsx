import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { users, type Role, type User } from "./mockData";

interface AuthState {
  user: User | null;
  login: (username: string, password: string) => { ok: boolean; error?: string; user?: User };
  logout: () => void;
  can: (roles: Role[]) => boolean;
}

const AuthContext = createContext<AuthState | null>(null);
const STORAGE_KEY = "apotek-sehat-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = (username: string, password: string) => {
    const input = username.trim();
    const found = users.find(
      (u) => (u.username === input || u.email === input) && u.password === password,
    );
    if (!found) return { ok: false, error: "Username, Email, atau kata sandi salah" };
    if (!found.active) return { ok: false, error: "Akun ini dinonaktifkan" };
    setUser(found);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
    return { ok: true, user: found };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const can = (roles: Role[]) => (user ? roles.includes(user.role) : false);

  return (
    <AuthContext.Provider value={{ user, login, logout, can }}>
      {hydrated ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
