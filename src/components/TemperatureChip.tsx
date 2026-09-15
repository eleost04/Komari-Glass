"use client";

import { Thermometer } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * 温度色阶：
 * - < 60°C  正常（中性）
 * - 60~75°C 偏热（警告）
 * - >= 75°C 过热（危险）
 */
export function temperatureTone(t: number): string {
  if (t >= 75) return "text-destructive";
  if (t >= 60) return "text-warning";
  return "text-muted-foreground";
}

export function formatTemperature(t: number): string {
  return `${Math.round(t)}°C`;
}

export function TemperatureChip({
  value,
  className,
  withIcon = true,
}: {
  value?: number;
  className?: string;
  withIcon?: boolean;
}) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return null;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-medium tabular-nums",
        temperatureTone(value),
        className
      )}
      title={`温度 ${formatTemperature(value)}`}
    >
      {withIcon ? <Thermometer className="size-3 shrink-0" /> : null}
      {formatTemperature(value)}
    </span>
  );
}
