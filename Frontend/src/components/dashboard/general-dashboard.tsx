"use client";

import { useState } from "react";
import type { AuthUser } from "@/src/components/providers/auth-provider";
import { ROLE_CONFIGURATIONS } from "@/src/components/dashboard/dashboard-config";
import { DashboardLayout } from "@/src/components/dashboard/dashboard-layout";
import {
  UserProfileWorkspace,
  type ProfileTabId,
} from "@/src/components/dashboard/user-profile-workspace";

interface GeneralDashboardProps {
  user: AuthUser;
}

export function GeneralDashboard({ user }: GeneralDashboardProps) {
  const roleConfig = ROLE_CONFIGURATIONS.general;
  const [activeSectionId, setActiveSectionId] =
    useState<ProfileTabId>("profile");

  return (
    <DashboardLayout
      user={user}
      roleConfig={roleConfig}
      activeSectionId={activeSectionId}
      onSelectSection={(nextId) => setActiveSectionId(nextId as ProfileTabId)}
    >
      <UserProfileWorkspace
        user={user}
        roleConfig={roleConfig}
        activeTab={activeSectionId}
        onTabChange={setActiveSectionId}
      />
    </DashboardLayout>
  );
}
