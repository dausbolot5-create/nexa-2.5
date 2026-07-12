export function reportLovableError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const win = window as unknown as {
    __lovableEvents?: { captureException?: (error: unknown, ctx: Record<string, unknown>) => void };
  };
  win.__lovableEvents?.captureException?.(error, { route: window.location.pathname, ...context });
}
