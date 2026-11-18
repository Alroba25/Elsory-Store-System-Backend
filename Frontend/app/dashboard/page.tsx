import type { Metadata } from "next";
import { DashboardContent } from "@/src/components/dashboard/dashboard-content";

export const instant = false;

export const metadata: Metadata = {
  title: "لوحة التحكم",
  description: "لوحة التحكم الداخلية لنظام ELSORY STORE (السوري ستور)",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
