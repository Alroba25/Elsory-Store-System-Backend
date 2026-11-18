"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Loader2, LogOut, ShieldCheck, X } from "lucide-react";
import type { RoleConfiguration } from "@/src/components/dashboard/dashboard-config";

interface DashboardSidebarProps {
  roleConfig: RoleConfiguration;
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onLogout: () => Promise<void>;
  isLoggingOut: boolean;
}

export function DashboardSidebar({
  roleConfig,
  activeSectionId,
  onSelectSection,
  isMobileOpen,
  onCloseMobile,
  onLogout,
  isLoggingOut,
}: DashboardSidebarProps) {
  const handleItemClick = (id: string) => {
    onSelectSection(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen ? (
        <div
          aria-hidden="true"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      ) : null}

      {/* Sidebar Container (Fixed right in RTL on mobile, sticky 100vh column on desktop) */}
      <aside
        aria-label={`القائمة الجانبية - ${roleConfig.titleAr}`}
        className={`fixed inset-y-0 right-0 z-50 flex w-72 shrink-0 flex-col justify-between border-l border-[#242424] bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Brand & Role Identity Header */}
        <div className="p-5 border-b border-[#242424]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center rounded-xl bg-[#F5F5F5] p-2 shadow-sm ring-1 ring-white/15">
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
                <span className="text-sm font-bold tracking-wide text-[#F5F5F5]">
                  ELSORY STORE
                </span>
                <span className="text-[11px] text-[#A6A6A6]">
                  النظام الداخلي للمتجر
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="إغلاق القائمة الجانبية"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#242424] bg-[#1A1A1D] text-[#A6A6A6] transition-colors hover:text-[#F5F5F5] lg:hidden"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Role Scope Pill */}
          <div className="mt-4 rounded-xl border border-[#242424] bg-[#161618] p-3">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className="h-4 w-4 shrink-0 text-[#2563EB]"
                aria-hidden="true"
              />
              <span className="text-xs font-bold text-[#F5F5F5]">
                {roleConfig.badgeAr}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-[#A6A6A6]">
              {roleConfig.departmentAr}
            </p>
          </div>
        </div>

        {/* Role-Scoped Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-2.5 pb-2 text-[11px] font-semibold tracking-wider text-[#A6A6A6]">
            الأقسام المتاحة للصلاحية
          </div>

          <nav aria-label="أقسام لوحة التحكم" className="space-y-1">
            {roleConfig.navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSectionId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-right text-xs sm:text-sm font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-sm"
                      : "text-[#A6A6A6] hover:bg-[#1C1C1F] hover:text-[#F5F5F5]"
                  }`}
                >
                  <span className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? "text-white"
                          : "text-[#A6A6A6] group-hover:text-[#F5F5F5]"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </span>

                  {item.badge ? (
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-[#242424] text-[#F5F5F5]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Link & Logout Action */}
        <div className="border-t border-[#242424] p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between rounded-xl border border-[#242424] bg-[#161618] px-3.5 py-2.5 text-xs font-medium text-[#A6A6A6] transition-colors hover:border-[#A6A6A6]/40 hover:text-[#F5F5F5]"
          >
            <span>واجهة المتجر الرئيسية</span>
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          <button
            type="button"
            onClick={onLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#242424] bg-[#1C1C1F] px-3.5 py-2.5 text-xs font-semibold text-[#F5F5F5] transition-colors hover:border-danger/50 hover:bg-danger/15 hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                <span>جاري تسجيل الخروج...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                <span>تسجيل الخروج</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
