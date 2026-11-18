import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Compass, LayoutDashboard } from "lucide-react";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";

export const metadata: Metadata = {
  title: "404 - الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها غير متوفرة في ELSORY STORE.",
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen w-full bg-background text-foreground flex flex-col justify-between p-6 sm:p-10">
      {/* Top Bar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2 shadow-2xs ring-1 ring-black/5 dark:ring-white/15">
            <Image
              src="/images/elsory-logo.png"
              alt="شعار ELSORY STORE"
              width={513}
              height={468}
              loading="eager"
              className="h-9 w-auto object-contain select-none"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-foreground">
              ELSORY STORE
            </span>
            <span className="text-[11px] text-muted">
              السوري ستور للإلكترونيات والهواتف
            </span>
          </div>
        </Link>

        <ThemeToggle />
      </header>

      {/* Main 404 Card */}
      <main className="mx-auto my-auto w-full max-w-lg py-12">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-8 sm:p-10 text-center shadow-lg space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/10 text-[#2563EB]">
            <Compass className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <span
              dir="ltr"
              className="inline-block rounded-full border border-border bg-background px-3.5 py-1 font-mono text-xs font-bold tracking-widest text-[#2563EB]"
            >
              ERROR 404
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              الصفحة المطلوبة غير موجودة
            </h1>
            <p className="text-xs sm:text-sm leading-relaxed text-muted">
              عذراً، الرابط الذي حاولت الوصول إليه غير صحيح أو تم نقله. يمكنك
              العودة إلى واجهة المتجر الرئيسية أو الانتقال إلى لوحة التحكم.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex h-11 w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl bg-[#242424] text-white dark:bg-[#F5F5F5] dark:text-[#111111] px-5 text-xs sm:text-sm font-bold transition-opacity hover:opacity-90"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>العودة للرئيسية</span>
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex h-11 w-full sm:w-auto flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              <span>لوحة التحكم</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl text-center text-xs text-muted">
        © ELSORY STORE — السوري ستور. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
