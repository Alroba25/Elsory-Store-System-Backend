"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: unknown;
  retry?: () => void;
  reset?: () => void;
}

export default function GlobalError({ error, retry, reset }: GlobalErrorProps) {
  const errorMessage =
    error instanceof Error && error.message
      ? error.message
      : "حدث خطأ غير متوقع في النظام.";

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
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-[#111111] text-[#F5F5F5] flex items-center justify-center p-6 font-sans antialiased">
        <title>خطأ في النظام | ELSORY STORE</title>
        <div
          role="alert"
          className="w-full max-w-md rounded-3xl border border-[#242424] bg-[#18181B] p-8 text-center shadow-2xl space-y-5"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertTriangle className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">
              عذراً، تعذر تحميل النظام
            </h1>
            <p className="text-xs leading-relaxed text-[#A6A6A6]">
              {errorMessage}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRecover}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 text-xs font-bold text-white transition-opacity hover:opacity-90"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span>إعادة تشغيل الصفحة</span>
          </button>
        </div>
      </body>
    </html>
  );
}
