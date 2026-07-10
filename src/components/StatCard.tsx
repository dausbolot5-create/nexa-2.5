import React, { type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export interface StatCardProps {
  title?: string;
  label?: string;
  value: number | string | ReactNode;
  icon: ReactNode | LucideIcon;
  trend?: number | { value: string; positive: boolean };
  isPositive?: boolean;
  format?: "currency" | "number" | "none";
  className?: string;
  description?: string;
  delta?: string;
  tone?: "primary" | "success" | "warning" | "info" | "destructive";
}

const toneMap: Record<string, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning",
  info: "bg-info/15 text-info",
  destructive: "bg-destructive/12 text-destructive",
};

export function StatCard({
  title,
  label,
  value,
  icon,
  trend,
  isPositive = true,
  format = "none",
  className,
  description,
  delta,
  tone = "primary",
}: StatCardProps) {
  const displayLabel = title || label;

  let formattedValue = value;
  if (typeof value === "number") {
    formattedValue =
      format === "currency"
        ? formatCurrency(value)
        : format === "number"
          ? new Intl.NumberFormat("id-ID").format(value)
          : value;
  }

  // Trend display
  let displayTrend: ReactNode = null;
  if (trend !== undefined) {
    if (typeof trend === "object") {
      displayTrend = (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend.positive ? "text-success" : "text-destructive",
          )}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      );
    } else {
      displayTrend = (
        <p
          className={cn(
            "mt-1 text-xs font-medium",
            trend === 0
              ? "text-muted-foreground"
              : isPositive
                ? "text-success"
                : "text-destructive",
          )}
        >
          {trend === 0 ? "—" : isPositive ? "▲" : "▼"} {Math.abs(trend)}%
        </p>
      );
    }
  }

  // Determine icon rendering
  const IconComp = icon as React.ElementType;
  const iconNode =
    typeof icon === "object" && React.isValidElement(icon) ? (
      icon
    ) : IconComp ? (
      <IconComp className="h-5 w-5" />
    ) : null;

  return (
    <div className={cn("glass rounded-2xl p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-muted-foreground">{displayLabel}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{formattedValue}</p>
          {displayTrend}
          {delta && <p className="mt-1 text-xs font-medium text-muted-foreground">{delta}</p>}
          {description && !delta && (
            <p className="mt-1 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <span
          className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", toneMap[tone])}
        >
          {iconNode}
        </span>
      </div>
    </div>
  );
}
