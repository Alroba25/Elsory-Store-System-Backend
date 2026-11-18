"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";

interface DashboardErrorProps {
  error: unknown;
  retry?: () => void;
  reset?: () => void;
}

export default function DashboardError({
  error,
  retry,
  reset,
}: DashboardErrorProps) {
  useEffect(() => {
    console.error("[ELSORY Dashboard Error]:", error);
  }, [error]);

  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : "تعذر تحميل بيانات لوحة التحكم في الوقت الحالي.";

  const handleRecover = () => {
    if (typeof retry === "function") {
      retry();
    } else if (typeof reset === "function") {
      reset();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-6 text-foreground">
      <div
        role="alert"
        className="w-full max-w-md rounded-3xl border border-danger/30 bg-surface p-8 text-center shadow-lg space-y-5"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger">
          <AlertTriangle className="h-7 w-7" aria-hidden="true" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-foreground">
            خطأ في تشغيل لوحة التحكم
          </h2>
          <p className="text-xs leading-relaxed text-muted">{errorMessage}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleRecover}
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>إعادة المحاولة</span>
          </button>

          <Link
            href="/"
            className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-semibold text-foreground hover:bg-surface-secondary"
          >
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
            <span>الرئيسية</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
