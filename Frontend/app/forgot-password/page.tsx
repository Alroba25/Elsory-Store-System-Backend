import type { Metadata } from "next";
import { AuthShell } from "@/src/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "نسيت كلمة المرور",
  description: "استعادة كلمة المرور الخاصة بحسابك في نظام ELSORY STORE.",
};

export default function ForgotPasswordPage() {
  return <AuthShell initialMode="forgot-password" />;
}
