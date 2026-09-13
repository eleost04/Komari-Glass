"use client";

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Database,
  Server,
  WalletCards,
} from "lucide-react";
import { useApp } from "@/contexts/AppProvider";
import { formatCurrencyValue } from "@/lib/billing";
import { cn } from "@/lib/cn";
import {
  formatBytes,
  formatBytesPerSecond,
  formatBytesSplit,
} from "@/lib/format";

function StatItem({
  icon,
  label,
  value,
  unit,
  children,
  valueClassName,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  children: React.ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="overview-stat min-w-0 px-4 py-3 sm:px-5 sm:py-3.5">
      <div className="mb-2 flex items-center justify-between gap-2 text-muted-foreground">
        <span className="text-xs font-medium">{label}</span>
        <span className="stat-icon" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span
          className={`truncate text-[22px] font-semibold leading-none tabular-nums tracking-normal sm:text-[28px] ${valueClassName || ""}`}
          title={value}
        >
          {value}
        </span>
        {unit ? (
          <span className="shrink-0 text-xs font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </div>
      <div className="mt-1.5 flex min-h-[34px] sm:min-h-4 flex-col sm:flex-row sm:items-center sm:gap-x-2.5 gap-y-0.5 text-[11px] text-muted-foreground sm:text-xs">
        {children}
      </div>
    </div>
  );
}

export function StatsBar() {
  const { overview, settings } = useApp();
  if (!settings.showStatsBar) return null;

  const traffic = formatBytesSplit(overview.trafficTotal);
  const items: React.ReactNode[] = [];

  if (settings.showOnline) {
    items.push(
      <StatItem
        key="online"
        icon={<Server className="size-4" />}
        label="在线节点"
        value={String(overview.online)}
        unit={`/ ${overview.total} 台`}
        valueClassName="text-success"
      >
        <span className="truncate">
          {overview.offline > 0
            ? `${overview.offline} 台离线`
            : "全部运行正常"}
        </span>
      </StatItem>
    );
  }

  if (settings.showAssets) {
    items.push(
      <StatItem
        key="assets"
        icon={<WalletCards className="size-4" />}
        label="在线资产"
        value={formatCurrencyValue(overview.totalValue, overview.currency)}
      >
        <span className="truncate">
          剩余 {formatCurrencyValue(overview.remainingValue, overview.currency)}
        </span>
        <span className="shrink-0 whitespace-nowrap">{overview.paidCount} 台计费</span>
      </StatItem>
    );
  }

  if (settings.showTraffic) {
    items.push(
      <StatItem
        key="traffic"
        icon={<Database className="size-4" />}
        label="累计流量"
        value={traffic.value}
        unit={traffic.unit}
      >
        <span className="inline-flex shrink-0 items-center gap-1 text-success whitespace-nowrap">
          <span>上传</span>
          {formatBytes(overview.trafficUp)}
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-info whitespace-nowrap">
          <span>下载</span>
          <span>{formatBytes(overview.trafficDown)}</span>
        </span>
      </StatItem>
    );
  }

  if (settings.showSpeed) {
    const totalSpeed = formatBytesSplit(overview.speedUp + overview.speedDown);
    items.push(
      <StatItem
        key="speed"
        icon={<Activity className="size-4" />}
        label="实时网速"
        value={totalSpeed.value}
        unit={`${totalSpeed.unit}/s`}
      >
        <span className="inline-flex shrink-0 items-center gap-1 text-success whitespace-nowrap">
          <ArrowUp className="size-3 shrink-0" />
          <span>
            {formatBytesPerSecond(overview.speedUp)}
          </span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-1 text-info whitespace-nowrap">
          <ArrowDown className="size-3 shrink-0" />
          <span>
            {formatBytesPerSecond(overview.speedDown)}
          </span>
        </span>
      </StatItem>
    );
  }

  if (items.length === 0) return null;

  return (
    <section
      className={cn(
        "overview-strip glass-panel grid overflow-hidden rounded-lg",
        items.length === 1 && "grid-cols-1",
        items.length === 2 && "grid-cols-2",
        items.length === 3 && "grid-cols-2 lg:grid-cols-3",
        items.length >= 4 && "grid-cols-2 lg:grid-cols-4"
      )}
      aria-label="服务器总览"
    >
      {items}
    </section>
  );
}
