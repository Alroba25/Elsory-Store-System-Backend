"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginBrandPanel } from "@/src/components/auth/login-brand-panel";
import { LoginForm } from "@/src/components/auth/login-form";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";
import type { AuthMode } from "@/src/types/auth.types";

interface AuthShellProps {
  initialMode?: AuthMode;
  initialNotice?: string | null;
}

export function AuthShell({
  initialMode = "login",
  initialNotice = null,
}: AuthShellProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isRegister = mode === "register";

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background text-foreground flex flex-col md:flex-row">
      {/* Brand / Visual Section (Right side in Login/Forgot, glides to Left in Register on Tablet/Desktop) */}
      <LoginBrandPanel mode={mode} />

      {/* Form Section (Left side in Login/Forgot, glides to Right in Register on Tablet/Desktop) */}
      <main
        className={`relative z-10 flex flex-1 md:w-1/2 shrink-0 flex-col justify-between px-4 py-6 sm:px-8 sm:py-8 lg:px-12 xl:px-16 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isRegister ? "md:translate-x-full" : "md:translate-x-0"
        }`}
      >
        {/* Top Utility & Mobile Brand Bar */}
        <header className="flex items-center justify-between gap-4">
          {/* Mobile-only Logo Presentation */}
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
                {isRegister
                  ? "ابدأ رحلتك مع ELSORY STORE"
                  : "كل تفاصيل محلك تحت سيطرتك"}
              </span>
            </div>
          </div>

          {/* Desktop/Tablet spacer to push ThemeToggle to the edge */}
          <div className="hidden md:block" aria-hidden="true" />

          <ThemeToggle />
        </header>

        {/* Centered Form Container */}
        <section
          aria-label={
            mode === "register"
              ? "إنشاء حساب جديد في النظام"
              : mode === "forgot-password"
                ? "استعادة كلمة المرور"
                : "تسجيل الدخول إلى النظام"
          }
          className="my-auto py-8 sm:py-10 w-full"
        >
          <LoginForm
            mode={mode}
            onModeChange={setMode}
            initialNotice={initialNotice}
          />
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
