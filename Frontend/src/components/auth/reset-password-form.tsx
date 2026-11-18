"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { AuthServiceError, resetPassword } from "@/src/services/auth.service";
import type {
  ResetPasswordFormErrors,
  ResetPasswordFormValues,
} from "@/src/types/auth.types";
import { useAuth } from "@/src/components/providers/auth-provider";

function validateResetPasswordForm(
  values: ResetPasswordFormValues,
): ResetPasswordFormErrors {
  const errors: ResetPasswordFormErrors = {};

  if (!values.newPassword) {
    errors.newPassword = "كلمة المرور الجديدة مطلوبة";
  } else if (values.newPassword.length < 8) {
    errors.newPassword = "كلمة المرور يجب ألا تقل عن 8 أحرف";
  } else if (new TextEncoder().encode(values.newPassword).length > 72) {
    errors.newPassword = "كلمة المرور تتجاوز الحد الأقصى المسموح (72 بايت)";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "تأكيد كلمة المرور الجديدة مطلوب";
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = "كلمتا المرور غير متطابقتين";
  }

  return errors;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearUser } = useAuth();

  // Read token directly from URL query param in memory only (never stored or logged)
  const token = searchParams.get("token")?.trim() ?? "";

  const [values, setValues] = useState<ResetPasswordFormValues>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isResetCompleted, setIsResetCompleted] = useState<boolean>(false);
  const [isTokenExpiredOrInvalid, setIsTokenExpiredOrInvalid] =
    useState<boolean>(false);

  // Case 1: Missing token in query string
  if (!token) {
    return (
      <div className="w-full max-w-110 mx-auto">
        <div
          role="alert"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.45)] space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-danger/25 bg-danger/10 text-danger">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              رابط الاستعادة غير صالح
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. يمكنك طلب
              رابط جديد.
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <Link
              href="/forgot-password"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white"
            >
              <span>طلب رابط استعادة جديد</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>العودة إلى تسجيل الدخول</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Password reset succeeded
  if (isResetCompleted) {
    return (
      <div className="w-full max-w-110 mx-auto">
        <div
          role="status"
          aria-live="polite"
          className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.45)] space-y-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-success/30 bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              تم تغيير كلمة المرور
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة
              المرور الجديدة.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>تسجيل الدخول الآن</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFieldChange =
    (field: keyof ResetPasswordFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setValues((prev) => ({ ...prev, [field]: nextValue }));

      if (errors[field] || errors.form) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
          form: undefined,
        }));
      }
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateResetPasswordForm(values);
    if (validationErrors.newPassword || validationErrors.confirmPassword) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsTokenExpiredOrInvalid(false);
    setIsSubmitting(true);

    try {
      const result = await resetPassword({
        token,
        newPassword: values.newPassword,
      });

      // Ensure no stale client session state remains
      clearUser();

      toast.success(result.message);
      setIsResetCompleted(true);

      window.setTimeout(() => {
        router.replace("/login");
      }, 2200);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AuthServiceError
          ? error.message
          : "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. يمكنك طلب رابط جديد.";

      if (error instanceof AuthServiceError && error.status === 400) {
        setIsTokenExpiredOrInvalid(true);
      }

      setErrors({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-110 mx-auto">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.45)] transition-colors duration-200">
        {/* Form Header */}
        <div className="mb-6 space-y-2 text-right">
          <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-foreground">
            إعادة تعيين كلمة المرور
          </h2>
          <p className="text-sm sm:text-[15px] leading-relaxed text-muted">
            أدخل كلمة المرور الجديدة الخاصة بحسابك في نظام ELSORY STORE.
          </p>
        </div>

        {errors.form ? (
          <div
            role="alert"
            aria-live="assertive"
            className="mb-6 space-y-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-right text-sm text-danger"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                aria-hidden="true"
              />
              <span className="font-medium leading-relaxed">{errors.form}</span>
            </div>

            {isTokenExpiredOrInvalid ? (
              <div className="pt-1">
                <Link
                  href="/forgot-password"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] underline hover:opacity-90"
                >
                  <span>طلب رابط استعادة جديد</span>
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-5"
          aria-label="نموذج إعادة تعيين كلمة المرور"
        >
          {/* 1. New Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="reset-new-password"
              className="block text-sm font-medium text-foreground"
            >
              كلمة المرور الجديدة
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                aria-hidden="true"
              >
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="reset-new-password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
                value={values.newPassword}
                onChange={handleFieldChange("newPassword")}
                placeholder="8 أحرف على الأقل"
                aria-invalid={Boolean(errors.newPassword)}
                aria-describedby={
                  errors.newPassword ? "reset-new-password-error" : undefined
                }
                className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-12 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.newPassword
                    ? "border-danger focus:border-danger focus:ring-danger/20"
                    : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={
                  showNewPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                }
                aria-pressed={showNewPassword}
                className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.newPassword ? (
              <p
                id="reset-new-password-error"
                role="alert"
                className="text-xs font-medium text-danger pt-0.5"
              >
                {errors.newPassword}
              </p>
            ) : null}
          </div>

          {/* 2. Confirm New Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="reset-confirm-password"
              className="block text-sm font-medium text-foreground"
            >
              تأكيد كلمة المرور الجديدة
            </label>
            <div className="relative">
              <span
                className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                aria-hidden="true"
              >
                <Lock className="h-4.5 w-4.5" />
              </span>
              <input
                id="reset-confirm-password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                disabled={isSubmitting}
                value={values.confirmPassword}
                onChange={handleFieldChange("confirmPassword")}
                placeholder="أعد إدخال كلمة المرور الجديدة"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "reset-confirm-password-error"
                    : undefined
                }
                className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-12 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                  errors.confirmPassword
                    ? "border-danger focus:border-danger focus:ring-danger/20"
                    : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={isSubmitting}
                aria-label={
                  showConfirmPassword
                    ? "إخفاء تأكيد كلمة المرور"
                    : "إظهار تأكيد كلمة المرور"
                }
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                ) : (
                  <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.confirmPassword ? (
              <p
                id="reset-confirm-password-error"
                role="alert"
                className="text-xs font-medium text-danger pt-0.5"
              >
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="group relative flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-65"
            >
              {isSubmitting ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin text-[#2563EB]"
                    aria-hidden="true"
                  />
                  <span>جاري تأكيد كلمة المرور الجديدة...</span>
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" aria-hidden="true" />
                  <span>تأكيد كلمة المرور الجديدة</span>
                </>
              )}
            </button>

            <Link
              href="/login"
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span>العودة إلى تسجيل الدخول</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
