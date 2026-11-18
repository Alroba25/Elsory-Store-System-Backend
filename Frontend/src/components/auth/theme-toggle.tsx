"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const isDark = isMounted ? resolvedTheme === "dark" : true;

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={
        isMounted
          ? isDark
            ? "التبديل إلى الوضع الفاتح"
            : "التبديل إلى الوضع الداكن"
          : "تبديل المظهر"
      }
      title={
        isMounted
          ? isDark
            ? "الوضع الفاتح"
            : "الوضع الداكن"
          : "تبديل المظهر"
      }
      className="group relative inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-xs font-medium text-foreground shadow-2xs transition-all duration-200 hover:border-[#A6A6A6]/60 hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
    >
      {isMounted ? (
        <>
          {isDark ? (
            <Sun
              className="h-4 w-4 text-[#F5F5F5] transition-transform duration-200 group-hover:rotate-12"
              aria-hidden="true"
            />
          ) : (
            <Moon
              className="h-4 w-4 text-[#242424] transition-transform duration-200 group-hover:-rotate-12"
              aria-hidden="true"
            />
          )}
          <span className="hidden sm:inline text-muted group-hover:text-foreground transition-colors">
            {isDark ? "الوضع الفاتح" : "الوضع الداكن"}
          </span>
        </>
      ) : (
        <span className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
