"use client";

import { Loader2, LogOut, Menu, User } from "lucide-react";
import { ThemeToggle } from "@/src/components/auth/theme-toggle";
import type { AuthUser } from "@/src/components/providers/auth-provider";
import type {
  RoleConfiguration,
  RoleNavItem,
} from "@/src/components/dashboard/dashboard-config";

interface DashboardHeaderProps {
  user: AuthUser;
  roleConfig: RoleConfiguration;
  activeNavItem: RoleNavItem;
  isProfileActive?: boolean;
  onOpenProfile: () => void;
  onOpenMobileSidebar: () => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function DashboardHeader({
  user,
  roleConfig,
  activeNavItem,
  isProfileActive = false,
  onOpenProfile,
  onOpenMobileSidebar,
  onLogout,
  isLoggingOut,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Right/Start: Mobile Menu Trigger + Active Section Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            aria-label="فتح القائمة الجانبية"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base sm:text-lg font-bold text-foreground">
                {isProfileActive ? "الملف الشخصي" : activeNavItem.label}
              </h1>
              <span className="hidden md:inline-flex items-center rounded-lg border border-border bg-surface-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted">
                {roleConfig.badgeAr}
              </span>
            </div>
          </div>
        </div>

        {/* Left/End: Theme Toggle + Clickable Authenticated User Profile Button + Quick Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <ThemeToggle />

          {/* Interactive User Profile Badge -> Navigates to Profile (/profile) */}
          <button
            type="button"
            onClick={onOpenProfile}
            title="الملف الشخصي"
            aria-label="الملف الشخصي"
            aria-current={isProfileActive ? "page" : undefined}
            className={`group flex items-center gap-2.5 rounded-xl border px-2.5 sm:px-3.5 py-1.5 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
              isProfileActive
                ? "border-[#2563EB] bg-[#2563EB]/10 shadow-2xs"
                : "border-border bg-background hover:border-[#2563EB]/60 hover:bg-surface-secondary"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                isProfileActive
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#242424] text-[#F5F5F5] dark:bg-[#F5F5F5] dark:text-[#111111] group-hover:bg-[#2563EB] group-hover:text-white dark:group-hover:bg-[#2563EB] dark:group-hover:text-white"
              }`}
            >
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="hidden sm:block text-right leading-tight">
              <div className="text-xs font-bold text-foreground max-w-35 truncate">
                {user.name}
              </div>
              <div
                dir="ltr"
                className="text-[11px] text-muted max-w-35 truncate"
              >
                {user.email}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            title="تسجيل الخروج"
            aria-label="تسجيل الخروج"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-muted transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogOut className="h-4 w-4" aria-hidden="true" />
            )}
            <span className="hidden xl:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}
