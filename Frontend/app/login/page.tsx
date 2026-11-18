import type { Metadata } from "next";
import { AuthShell } from "@/src/components/auth/auth-shell";

export const metadata: Metadata = {
  title: "تسجيل الدخول وإنشاء حساب",
  description:
    "سجّل الدخول أو أنشئ حسابك للمتابعة إلى نظام ELSORY STORE.",
};

export default function LoginPage() {
  return <AuthShell />;
}
