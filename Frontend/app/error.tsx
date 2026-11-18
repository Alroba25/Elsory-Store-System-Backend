"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RotateCcw } from "lucide-react";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";

interface ErrorPageProps {
  error: unknown;
  retry?: () => void;
  reset?: () => void;
}

export default function ErrorPage({ error, retry, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ELSORY STORE Runtime Error]:", error);
  }, [error]);

  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : "حدث خطأ غير متوقع أثناء معالجة الصفحة.";

  const errorDigest =
    error instanceof Error &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string"
      ? (error as { digest: string }).digest
      : undefined;

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
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2 shadow-2xs ring-1 ring-black/5 dark:ring-white/15">
            <Image
              src="/images/elsory-logo.png"
              alt="شعار ELSORY STORE"
              width={513}
              height={468}
              className="h-9 w-auto object-contain select-none"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-foreground">
              ELSORY STORE
            </span>
            <span className="text-[11px] text-muted">
              نظام إدارة المتجر والعمليات
            </span>
          </div>
        </Link>

        <ThemeToggle />
      </header>

      {/* Error Card */}
      <main className="mx-auto my-auto w-full max-w-lg py-12">
        <div
          role="alert"
          className="rounded-3xl border border-danger/30 bg-surface p-8 sm:p-10 text-center shadow-lg space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              عذراً، حدث خطأ غير متوقع
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              واجه النظام مشكلة عارضة أثناء عرض هذا القسم. يمكنك إعادة المحاولة
              الآن أو العودة إلى الصفحة الرئيسية.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-3.5 text-xs text-muted break-words">
            <p className="font-medium text-foreground">{errorMessage}</p>
            {errorDigest ? (
              <p dir="ltr" className="mt-1 font-mono text-[11px] text-muted">
                Ref: {errorDigest}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleRecover}
              className="inline-flex h-11 w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs sm:text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>إعادة المحاولة</span>
            </button>

            <Link
              href="/"
              className="inline-flex h-11 w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>العودة للرئيسية</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-muted">
        © ELSORY STORE — السوري ستور.
      </footer>
    </div>
  );
}
