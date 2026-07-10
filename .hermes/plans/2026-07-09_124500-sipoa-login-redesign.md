# SIPOA Login Page Design Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Redesign the login page (`src/routes/login.tsx`) to match a previously requested or preferred aesthetic, maintaining TanStack Start routing and the existing demo credentials approach.

**Architecture:** TanStack Start Route Component, React 19, Tailwind CSS v4.

**Tech Stack:** React, Tailwind CSS, shadcn/ui components (`Input`, `Button`, `Label`), Lucide icons, Sonner for toasts.

---

### Task 1: Redesign `login.tsx` Left Panel (Branding)

**Objective:** Update the visual style of the left-side branding panel to be more modern/sleek (or "like before" which typically means adjusting the gradients, layout, or typography). _Assumption:_ The current version uses a gradient `from-primary/90 via-primary/70 to-accent/60`. We will refine this to a cleaner, perhaps darker or more striking aesthetic, and ensure the `Apotek Nexa` branding stands out.

**Files:**

- Modify: `src/routes/login.tsx`

**Step 1: Write/Update the branding section**
Update the `div` with the left panel class `hidden lg:flex`. We will slightly adjust the styling for a premium feel (e.g., deeper gradients or a simpler solid color with an abstract pattern).

_Since the user said "design login page saja buat seperti seblumnya" (just design the login page make it like before), we will streamline the current design into a clean, modern split-screen layout._

**Step 2: Implement Code**

```tsx
// Inside src/routes/login.tsx
// Modify the left panel JSX:
<div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
  {/* Dark gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary/80 to-slate-900 opacity-90" />

  {/* Subtle pattern */}
  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />

  <div className="relative z-10 flex items-center gap-3">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-white shadow-lg backdrop-blur-md">
      <Pill className="h-6 w-6 text-white" />
    </span>
    <div>
      <p className="text-xl font-bold text-white tracking-tight">Apotek Nexa</p>
      <p className="text-sm font-medium text-slate-300">Sistem Informasi Manajemen</p>
    </div>
  </div>

  <div className="relative z-10 max-w-md">
    <h2 className="text-3xl font-bold leading-tight text-white mb-6">
      Solusi Cerdas untuk Apotek Modern.
    </h2>
    <p className="text-base text-slate-300 leading-relaxed mb-8">
      Manajemen stok akurat, transaksi kasir cepat, dan pelaporan komprehensif dalam satu platform
      terpadu.
    </p>

    <div className="grid grid-cols-2 gap-4">
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-2xl font-bold text-white mb-1">99.9%</p>
        <p className="text-sm text-slate-400">Akurasi Stok</p>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <p className="text-2xl font-bold text-white mb-1">24/7</p>
        <p className="text-sm text-slate-400">Akses Real-time</p>
      </div>
    </div>
  </div>

  <p className="relative z-10 flex items-center gap-2 text-sm text-slate-400 font-medium">
    <ShieldCheck className="h-4 w-4" /> Enkripsi End-to-End & Akses Berbasis Peran
  </p>
</div>
```

**Step 3: Verification**
Load `http://localhost:8080/login` in the browser and verify the left panel has a dark, sleek aesthetic.

---

### Task 2: Redesign `login.tsx` Right Panel (Form)

**Objective:** Clean up the login form container. Ensure it uses standard shadcn/ui styling for a crisp, professional look.

**Files:**

- Modify: `src/routes/login.tsx`

**Step 1: Update the form container and inputs**
Simplify the right panel container to remove overly complex glassmorphism if it looks messy, opting for a clean white (or theme-matched) card look.

**Step 2: Implement Code**

```tsx
// Inside src/routes/login.tsx
// Modify the right panel JSX:
<div className="flex items-center justify-center p-6 sm:p-12 bg-slate-50 dark:bg-slate-950">
  <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
    {/* Mobile branding */}
    <div className="mb-8 flex flex-col items-center justify-center lg:hidden">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground mb-4">
        <Pill className="h-6 w-6" />
      </span>
      <h2 className="text-2xl font-bold text-foreground">Apotek Nexa</h2>
      <p className="text-sm text-muted-foreground">Sistem Informasi Manajemen</p>
    </div>

    <div className="mb-8 text-center lg:text-left">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Selamat Datang</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Silakan masuk ke akun Anda untuk melanjutkan.
      </p>
    </div>

    {/* Form remains exactly the same logic-wise */}
    <form onSubmit={submit} className="space-y-5">
      {/* ... existing username and password fields ... */}

      <Button
        type="submit"
        disabled={loading}
        className="w-full h-11 text-base font-medium transition-all"
      >
        {loading ? (
          "Memverifikasi..."
        ) : (
          <>
            <LogIn className="mr-2 h-4 w-4" />
            Masuk Sekarang
          </>
        )}
      </Button>
    </form>

    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
      <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Akses Cepat (Demo)
      </p>
      <div className="grid grid-cols-3 gap-3">
        {demoAccounts.map((a) => (
          <button
            key={a.role}
            type="button"
            onClick={() => quick(a.username, a.password)}
            className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
          >
            {roleLabel[a.role]}
          </button>
        ))}
      </div>
    </div>
  </div>
</div>
```

**Step 3: Verification**
Load `http://localhost:8080/login` in the browser and verify the form looks clean, with clear demo buttons and proper spacing.

---

### Task 3: Combine and Polish

**Objective:** Ensure the entire `login.tsx` file is syntactically correct and visually cohesive.

**Files:**

- Modify: `src/routes/login.tsx`

**Step 1: Final review of the file structure**
Ensure all imports (`lucide-react`, `Button`, `Input`, `Label`) are present.
Ensure the `demoAccounts` array and `submit` function are intact.

**Step 2: Commit**

```bash
git add src/routes/login.tsx
git commit -m "style: redesign login page aesthetics to modern sleek layout"
```
