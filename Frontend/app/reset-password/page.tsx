import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { LoginBrandPanel } from "@/src/components/auth/login-brand-panel";
import { ResetPasswordForm } from "@/src/components/auth/reset-password-form";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";

export const metadata: Metadata = {
  title: "إعادة تعيين كلمة المرور",
  description: "تعيين كلمة مرور جديدة لحسابك في نظام ELSORY STORE.",
};

function ResetPasswordFallback() {
  return (
    <div className="w-full max-w-110 mx-auto">
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center">
        <Loader2
          className="h-6 w-6 animate-spin text-[#2563EB]"
          aria-hidden="true"
        />
        <p className="text-xs font-medium text-muted">
          جاري التحقق من رابط الاستعادة...
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col md:flex-row">
      {/* Brand / Visual Section (Right side in RTL on Tablet/Desktop) */}
      <LoginBrandPanel mode="login" />

      {/* Reset Form Section */}
      <main className="relative z-10 flex flex-1 md:w-1/2 shrink-0 flex-col justify-between px-4 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16">
        {/* Top Utility & Mobile Brand Bar */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:hidden">
            <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2.5 shadow-sm ring-1 ring-black/5 dark:ring-white/15">
              <Image
                src="/images/elsory-logo.png"
                alt="شعار ELSORY STORE"
                width={513}
                height={468}
                loading="eager"
                className="h-11 w-auto object-contain select-none"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wide text-foreground">
                ELSORY STORE
              </span>
              <span className="text-[11px] text-muted">
                كل تفاصيل محلك تحت سيطرتك
              </span>
            </div>
          </div>

          <div className="hidden md:block" aria-hidden="true" />

          <ThemeToggle />
        </header>

        {/* Centered Form Container */}
        <section
          aria-label="إعادة تعيين كلمة المرور"
          className="my-auto py-8 sm:py-10 w-full"
        >
          <Suspense fallback={<ResetPasswordFallback />}>
            <ResetPasswordForm />
          </Suspense>
        </section>

        {/* Footer */}
        <footer className="pt-4 text-center">
          <p className="text-xs font-medium text-muted">
            ELSORY STORE © جميع الحقوق محفوظة
          </p>
        </footer>
      </main>
    </div>
  );
}
