"use client";

import { Calendar } from "lucide-react";

export type DayFilterMode = "today" | "yesterday" | "custom" | "all";

export function toLocalYmd(dateValue?: string | Date): string {
  const date = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getYesterdayLocalYmd(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toLocalYmd(d);
}

export function resolveTargetYmd(
  mode: DayFilterMode,
  customYmd: string,
): string | null {
  if (mode === "all") return null;
  if (mode === "today") return toLocalYmd(new Date());
  if (mode === "yesterday") return getYesterdayLocalYmd();
  return customYmd || toLocalYmd(new Date());
}

export function filterBySelectedDay<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
  mode: DayFilterMode,
  customYmd: string,
): T[] {
  const targetYmd = resolveTargetYmd(mode, customYmd);
  if (!targetYmd) return items;
  return items.filter((item) => {
    const raw = getDate(item);
    if (!raw) return false;
    return toLocalYmd(raw) === targetYmd;
  });
}

interface DayFilterBarProps {
  mode: DayFilterMode;
  customDate: string;
  onModeChange: (mode: DayFilterMode) => void;
  onCustomDateChange: (date: string) => void;
  totalCount: number;
  filteredCount: number;
  itemLabel?: string;
}

export function DayFilterBar({
  mode,
  customDate,
  onModeChange,
  onCustomDateChange,
  totalCount,
  filteredCount,
  itemLabel = "سجل",
}: DayFilterBarProps) {
  const activeYmd = resolveTargetYmd(mode, customDate);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-3.5 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-bold text-foreground">
          <Calendar className="h-3.5 w-3.5 text-[#2563EB]" aria-hidden="true" />
          <span>عرض حسب اليوم:</span>
        </span>

        {(
          [
            { id: "today", label: "اليوم" },
            { id: "yesterday", label: "أمس" },
            { id: "custom", label: "تاريخ محدد" },
            { id: "all", label: "كل الأيام" },
          ] as const
        ).map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => onModeChange(btn.id)}
            className={`rounded-xl px-3 py-1.5 font-semibold transition-colors ${
              mode === btn.id
                ? "bg-[#2563EB] text-white"
                : "border border-border bg-surface text-muted hover:text-foreground"
            }`}
          >
            {btn.label}
          </button>
        ))}

        {mode === "custom" ? (
          <input
            type="date"
            value={customDate}
            onChange={(e) => onCustomDateChange(e.target.value)}
            aria-label="اختر تاريخ اليوم"
            className="h-8 rounded-xl border border-border bg-surface px-2.5 text-xs font-medium text-foreground focus:border-[#2563EB] focus:outline-none"
          />
        ) : null}
      </div>

      <div className="text-[11px] font-medium text-muted">
        {activeYmd ? (
          <span>
            تاريخ:{" "}
            <strong dir="ltr" className="font-mono text-foreground">
              {activeYmd}
            </strong>{" "}
            — المعروض:{" "}
            <strong className="text-[#2563EB]">{filteredCount}</strong>{" "}
            {itemLabel} (من إجمالي {totalCount})
          </span>
        ) : (
          <span>
            عرض جميع الأيام ({filteredCount} {itemLabel})
          </span>
        )}
      </div>
    </div>
  );
}
