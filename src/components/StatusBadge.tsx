import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/20 text-warning border-warning/25",
  destructive: "bg-destructive/12 text-destructive border-destructive/20",
  info: "bg-info/15 text-info border-info/20",
  neutral: "bg-secondary text-secondary-foreground border-border",
};

export function StatusBadge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: keyof typeof toneMap;
}) {
  return (
    <Badge variant="outline" className={cn("rounded-full font-medium capitalize", toneMap[tone])}>
      {label}
    </Badge>
  );
}
