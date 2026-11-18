"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useAuth,
  type AuthUser,
} from "@/src/components/providers/auth-provider";
import type { RoleConfiguration } from "@/src/components/dashboard/dashboard-config";
import { DashboardHeader } from "@/src/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/src/components/dashboard/dashboard-sidebar";
import { UserProfileWorkspace } from "@/src/components/dashboard/user-profile-workspace";

interface DashboardLayoutProps {
  user: AuthUser;
  roleConfig: RoleConfiguration;
  activeSectionId: string;
  onSelectSection: (sectionId: string) => void;
  children: ReactNode;
}

export function DashboardLayout({
  user,
  roleConfig,
  activeSectionId,
  onSelectSection,
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { logout, clearUser } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState<boolean>(false);

  const activeNavItem =
    roleConfig.navItems.find((item) => item.id === activeSectionId) ??
    roleConfig.navItems[0];

  const handleSidebarSelectSection = (sectionId: string) => {
    setIsProfileViewOpen(false);
    onSelectSection(sectionId);
  };

  const handleOpenProfile = () => {
    if (roleConfig.role === "general") {
      setIsProfileViewOpen(false);
      onSelectSection("profile");
      return;
    }
    setIsProfileViewOpen(true);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      const message = await logout();
      toast.success(message);
      router.replace("/login");
    } catch {
      clearUser();
      toast.error("تم إنهاء الجلسة المحلية");
      router.replace("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isProfileHighlighted =
    isProfileViewOpen ||
    (roleConfig.role === "general" && activeSectionId === "profile");

  return (
    <div className="min-h-screen w-full bg-background text-foreground flex">
      {/* Role-Specific Sidebar */}
      <DashboardSidebar
        roleConfig={roleConfig}
        activeSectionId={isProfileViewOpen ? "" : activeNavItem.id}
        onSelectSection={handleSidebarSelectSection}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          user={user}
          roleConfig={roleConfig}
          activeNavItem={activeNavItem}
          isProfileActive={isProfileHighlighted}
          onOpenProfile={handleOpenProfile}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {isProfileViewOpen ? (
              <UserProfileWorkspace
                user={user}
                roleConfig={roleConfig}
                onBackToDashboard={() => setIsProfileViewOpen(false)}
              />
            ) : (
              children
            )}
          </div>
        </main>

        <footer className="border-t border-border bg-surface/50 px-4 py-4 sm:px-6 lg:px-8 text-center sm:text-right">
          <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted">
            <span>ELSORY STORE (السوري ستور) — نظام الإدارة الداخلي</span>
            <span>الصلاحية النشطة: {roleConfig.badgeAr}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
