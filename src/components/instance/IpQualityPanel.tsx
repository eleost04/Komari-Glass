"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Film,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wifi,
  XCircle,
} from "lucide-react";
import { Loading } from "@/components/Loading";
import type { DisplayNode } from "@/lib/types";

interface IpQualityData {
  country: string;
  country_code: string;
  is_datacenter: boolean;
  is_proxy: boolean;
  is_vpn: boolean;
  is_tor: boolean;
  is_crawler: boolean;
  is_abuser: boolean;
  is_bogon: boolean;
  threat_level: "low" | "medium" | "high";
  unlocks?: {
    chatgpt: string;
    claude: string;
    gemini: string;
    netflix: string;
    disney: string;
    youtube: string;
    tiktok: string;
  };
}

async function fetchBackendQuality(uuid: string): Promise<IpQualityData> {
  const res = await fetch(`/ip-meta/query?uuid=${encodeURIComponent(uuid)}`);
  if (!res.ok) {
    throw new Error(`探测接口返回异常 (${res.status})`);
  }
  const data = await res.json();
  if (data.ok === false) {
    throw new Error(data.message || "未能获取该节点的网络质量数据");
  }
  return data;
}

export function IpQualityPanel({ node }: { node: DisplayNode }) {
  const [data, setData] = useState<IpQualityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    if (!node.uuid) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBackendQuality(node.uuid);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络质量查询失败");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [node.uuid]);

  return (
    <div className="glass-panel space-y-4 rounded-lg p-4 sm:p-5">
      {/* 头部标题与重新检测 */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            IP 纯净度体检
          </h3>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={() => void loadData()}
          className="btn-secondary !py-1 !px-2.5 text-xs inline-flex items-center gap-1.5"
        >
          <RotateCw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
          重新体检
        </button>
      </div>

      {loading ? (
        <Loading text="正在安全评估该节点的 IP 质量与纯净度…" className="min-h-[18vh]" />
      ) : error ? (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-6 text-center text-sm text-destructive">
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => void loadData()}
            className="btn-secondary mt-3 !py-1 !px-3 text-xs"
          >
            重试
          </button>
        </div>
      ) : data ? (
        <div className="space-y-4">
          {/* 两大核心判定卡片：网络类型 vs 纯净度等级 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="glass-panel rounded-lg p-4 flex flex-col justify-between">
              <span className="text-xs text-muted-foreground">网络属性</span>
              <div className="my-2 flex items-center gap-2">
                {data.is_datacenter ? (
                  <span className="inline-flex items-center gap-1.5 text-base font-bold text-info">
                    <Wifi className="size-5" />
                    机房数据中心 (Hosting / DC)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-base font-bold text-success">
                    <CheckCircle2 className="size-5" />
                    原生家庭宽带 (Residential / ISP)
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {data.is_datacenter
                  ? "数据中心机房托管网段"
                  : "原生住宅/企业宽带高信誉网段"}
              </span>
            </div>

            <div className="glass-panel rounded-lg p-4 flex flex-col justify-between">
              <span className="text-xs text-muted-foreground">综合纯净度等级</span>
              <div className="my-2 flex items-center gap-2">
                {data.threat_level === "low" ? (
                  <span className="inline-flex items-center gap-1.5 text-base font-bold text-success">
                    <ShieldCheck className="size-5" />
                    纯净极佳 (Clean / Low Risk)
                  </span>
                ) : data.threat_level === "medium" ? (
                  <span className="inline-flex items-center gap-1.5 text-base font-bold text-warning">
                    <AlertTriangle className="size-5" />
                    中度风险 (Proxy/VPN)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-base font-bold text-destructive">
                    <ShieldAlert className="size-5" />
                    高危风险 (High Risk)
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                基于全球信誉库与恶意行为特征综合评估
              </span>
            </div>
          </div>

          {/* 详细风控检测矩阵（纯净度与安全体检指标） */}
          <div className="rounded-lg border border-border/60 bg-foreground/[0.02] p-4">
            <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-primary" />
              安全与风控检测指标
            </h4>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3 lg:grid-cols-6 text-xs">
              <SecurityItem label="代理检测 (Proxy)" flag={data.is_proxy} />
              <SecurityItem label="VPN 检测" flag={data.is_vpn} />
              <SecurityItem label="Tor 匿名节点" flag={data.is_tor} />
              <SecurityItem label="网络爬虫 (Crawler)" flag={data.is_crawler} />
              <SecurityItem label="滥用/恶意记录" flag={data.is_abuser} />
              <SecurityItem label="Bogon 伪造地址" flag={data.is_bogon} />
            </div>
          </div>

          {/* 跨国平台与 AI / 流媒体解锁能力画像（对标融合怪测评标准） */}
          {data.unlocks ? (
            <div className="rounded-lg border border-border/60 bg-foreground/[0.02] p-4">
              <h4 className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-primary" />
                AI 与流媒体原生解锁能力画像 (基于纯净度评估)
              </h4>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 sm:grid-cols-3 lg:grid-cols-4 text-xs">
                <UnlockItem label="ChatGPT / Sora" status={data.unlocks.chatgpt} />
                <UnlockItem label="Claude (Anthropic)" status={data.unlocks.claude} />
                <UnlockItem label="Google Gemini" status={data.unlocks.gemini} />
                <UnlockItem label="Netflix (网飞)" status={data.unlocks.netflix} />
                <UnlockItem label="Disney+ (迪士尼)" status={data.unlocks.disney} />
                <UnlockItem label="YouTube Premium" status={data.unlocks.youtube} />
                <UnlockItem label="TikTok (海外抖音)" status={data.unlocks.tiktok} />
              </div>
            </div>
          ) : null}


        </div>
      ) : null}
    </div>
  );
}

function SecurityItem({
  label,
  flag,
  riskText,
  cleanText,
}: {
  label: string;
  flag: boolean;
  riskText?: string;
  cleanText?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted-foreground">{label}</span>
      {flag ? (
        <span className="inline-flex items-center gap-1.5 font-semibold text-destructive">
          <XCircle className="size-4 shrink-0" />
          {riskText || "检测到风险"}
        </span>
      ) : (
        <span className="inline-flex items-center gap-1.5 font-semibold text-success">
          <CheckCircle2 className="size-4 shrink-0" />
          {cleanText || "纯净未检出"}
        </span>
      )}
    </div>
  );
}

function UnlockItem({ label, status }: { label: string; status: string }) {
  const isYes = status.startsWith("YES");
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`inline-flex items-center gap-1 font-semibold ${
          isYes ? "text-success" : "text-amber-500"
        }`}
      >
        {isYes ? <CheckCircle2 className="size-3.5 shrink-0" /> : <AlertTriangle className="size-3.5 shrink-0" />}
        <span className="truncate" title={status}>
          {status}
        </span>
      </span>
    </div>
  );
}
