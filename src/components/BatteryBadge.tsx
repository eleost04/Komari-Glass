"use client";

import { Battery, BatteryCharging, BatteryLow } from "lucide-react";
import { cn } from "@/lib/cn";
import type { BatteryStatus } from "@/lib/types";

export function BatteryBadge({
  battery,
  className,
}: {
  battery?: BatteryStatus;
  className?: string;
}) {
  if (!battery || typeof battery.level !== "number" || battery.level < 0) {
    return null;
  }

  const { level, charging } = battery;
  const isLow = level < 20 && !charging;

  const tooltip = charging
    ? `电池电量: ${level}% (正在充电)`
    : `电池电量: ${level}% (未在充电)`;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium tabular-nums select-none transition-colors",
        charging
          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
          : isLow
            ? "bg-rose-500/10 text-rose-500 border border-rose-500/20 animate-pulse"
            : "bg-foreground/5 text-foreground/80 border border-border/50",
        className
      )}
      title={tooltip}
      aria-label={tooltip}
    >
      {charging ? (
        <BatteryCharging className="size-3.5 shrink-0 text-emerald-500" />
      ) : isLow ? (
        <BatteryLow className="size-3.5 shrink-0 text-rose-500" />
      ) : (
        <Battery className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span>{level}%</span>
    </div>
  );
}
