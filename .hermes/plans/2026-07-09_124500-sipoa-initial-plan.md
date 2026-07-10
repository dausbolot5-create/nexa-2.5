# SIPOA Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Understand the current state of the application and map out the remaining features according to the PRD. Given the user hasn't specified a task, we will start by planning the completion of the core modules based on the memory context.

**Architecture:** TanStack Start, React 19, Tailwind CSS v4, shadcn/ui components.

**Tech Stack:** TypeScript, React, TanStack Start (SSR/Router), Tailwind.

---

### Task 1: Analyze `mock-data.ts` and ensure mock admin user exists

**Objective:** Ensure the authentication flow has a valid mock user for login as per the memory pitfall warning.

**Files:**

- Modify: `src/lib/mock-data.ts` (if missing)

**Step 1: Check existing mock users**
Read the `src/lib/mock-data.ts` (or similar file) to verify it exports `mockUsers` with an admin user.

**Step 2: Add if missing**
If not present, add an admin user with `email: 'admin@sipoa.com'`.

### Task 2: Review and map routes against memory pitfall

**Objective:** Memory indicates: "SIPOA Next.js routing: Dashboard folders use English names (/medicines, /sales, /inventory/stock) directly under the `(dashboard)` route group. No `/dashboard/` prefix in URLs. UI links must map Indonesian labels to these English paths to avoid 404s." We are currently using TanStack Start routing with files like `_authed.obat.tsx`. We need to plan how to align this or clarify the architectural shift from Next.js App Router to TanStack Start.

**Action Item:** This needs clarification with the user. The memory states Next.js, but `package.json` and `src/routes/` show TanStack Start. We will assume TanStack Start is the new direction and we need to ensure the route naming convention is followed or updated.

Currently routes are Indonesian (e.g. `_authed.obat.tsx`). If the PRD/Memory requires English paths (e.g. `/medicines`), we need to plan route renaming.

### Task 3: Await specific user instruction

**Objective:** Since the user just invoked the `plan` skill without a specific prompt, we should ask them what specific feature or module from the 2450-line PRD they want to plan out next.

---

**Note to self/user:** The tech stack in memory says "Next.js" but the project is initialized with "TanStack Start". I will proceed with TanStack Start conventions as per the current codebase. Please clarify the next target feature.
