"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Send,
  User,
  UserPlus,
} from "lucide-react";
import {
  AuthServiceError,
  forgotPassword,
  loginWithCredentials,
  registerUser,
} from "@/src/services/auth.service";
import type {
  AuthMode,
  ForgotPasswordFormErrors,
  LoginFormErrors,
  LoginFormValues,
  RegisterFormErrors,
  RegisterFormValues,
} from "@/src/types/auth.types";
import { toast } from "sonner";
import { useAuth } from "@/src/components/providers/auth-provider";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const trimmedEmail = values.email.trim();

  if (!trimmedEmail) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  }

  return errors;
}

function validateRegisterForm(values: RegisterFormValues): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim().toLowerCase();

  if (!trimmedName) {
    errors.name = "الاسم الكامل مطلوب";
  } else if (trimmedName.length < 3 || trimmedName.length > 50) {
    errors.name = "الاسم يجب أن يكون بين 3 و 50 حرفاً";
  }

  if (!trimmedEmail) {
    errors.email = "البريد الإلكتروني مطلوب";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }

  if (!values.password) {
    errors.password = "كلمة المرور مطلوبة";
  } else if (values.password.length < 8) {
    errors.password = "كلمة المرور يجب ألا تقل عن 8 أحرف";
  } else if (new TextEncoder().encode(values.password).length > 72) {
    errors.password = "كلمة المرور تتجاوز الحد الأقصى المسموح (72 بايت)";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "كلمتا المرور غير متطابقتين";
  }

  return errors;
}

interface LoginFormProps {
  mode?: AuthMode;
  onModeChange?: (nextMode: AuthMode) => void;
  initialNotice?: string | null;
}

export function LoginForm({
  mode,
  onModeChange,
  initialNotice = null,
}: LoginFormProps) {
  const router = useRouter();
  const { refreshUser, isAuthenticated, isLoading } = useAuth();

  const [internalMode, setInternalMode] = useState<AuthMode>("login");
  const activeMode = mode ?? internalMode;

  const handleSelectMode = (nextMode: AuthMode) => {
    if (nextMode === activeMode) return;
    setInternalMode(nextMode);
    onModeChange?.(nextMode);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // 1. Login State
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registrationSuccessNotice, setRegistrationSuccessNotice] = useState<
    string | null
  >(initialNotice);

  // 2. Register State
  const [registerValues, setRegisterValues] = useState<RegisterFormValues>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<RegisterFormErrors>({});
  const [showRegisterPassword, setShowRegisterPassword] =
    useState<boolean>(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] =
    useState<boolean>(false);
  const [isRegisterSubmitting, setIsRegisterSubmitting] =
    useState<boolean>(false);

  // 3. Forgot Password State
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [forgotErrors, setForgotErrors] = useState<ForgotPasswordFormErrors>(
    {},
  );
  const [isForgotSubmitting, setIsForgotSubmitting] = useState<boolean>(false);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<
    string | null
  >(null);

  // Login Handlers
  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextEmail = event.target.value;
    setValues((prev) => ({ ...prev, email: nextEmail }));

    if (errors.email || errors.form) {
      setErrors((prev) => ({
        ...prev,
        email: undefined,
        form: undefined,
      }));
    }
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPassword = event.target.value;
    setValues((prev) => ({ ...prev, password: nextPassword }));

    if (errors.password || errors.form) {
      setErrors((prev) => ({
        ...prev,
        password: undefined,
        form: undefined,
      }));
    }
  };

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setValues((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const validationErrors = validateLoginForm(values);

    if (validationErrors.email || validationErrors.password) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setRegistrationSuccessNotice(null);
    setIsSubmitting(true);

    try {
      const result = await loginWithCredentials({
        email: values.email,
        password: values.password,
      });
      const authenticatedUser = await refreshUser();
      if (!authenticatedUser) {
        const sessionErrorMessage =
          "تم تسجيل الدخول ولكن تعذر التحقق من الجلسة. تأكد من تفعيل ملفات تعريف الارتباط (Cookies) وحاول مرة أخرى.";
        setErrors({ form: sessionErrorMessage });
        toast.error(sessionErrorMessage);
        return;
      }
      toast.success(result.message);

      router.replace("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AuthServiceError
          ? error.message
          : "تعذر تسجيل الدخول، حاول مرة أخرى";

      setErrors({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Register Handlers
  const handleRegisterFieldChange =
    (field: keyof RegisterFormValues) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      setRegisterValues((prev) => ({ ...prev, [field]: nextValue }));

      if (registerErrors[field] || registerErrors.form) {
        setRegisterErrors((prev) => ({
          ...prev,
          [field]: undefined,
          form: undefined,
        }));
      }
    };

  const handleRegisterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegisterSubmitting) return;

    const validationErrors = validateRegisterForm(registerValues);
    if (
      validationErrors.name ||
      validationErrors.email ||
      validationErrors.password ||
      validationErrors.confirmPassword
    ) {
      setRegisterErrors(validationErrors);
      return;
    }

    setRegisterErrors({});
    setIsRegisterSubmitting(true);

    const cleanName = registerValues.name.trim();
    const cleanEmail = registerValues.email.trim().toLowerCase();

    try {
      const result = await registerUser({
        name: cleanName,
        email: cleanEmail,
        password: registerValues.password,
      });

      toast.success(result.message);

      // Populate Login Email input & show confirmation message
      setValues((prev) => ({
        ...prev,
        email: cleanEmail,
        password: "",
      }));
      setErrors({});
      setRegistrationSuccessNotice(
        "تم إنشاء حسابك بنجاح! يمكنك تسجيل الدخول الآن باستخدام بريدك الإلكتروني وكلمة المرور.",
      );

      // Reset Register form
      setRegisterValues({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Smoothly transition back to Login view
      handleSelectMode("login");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AuthServiceError
          ? error.message
          : "حدث خطأ بالسيرفر، حاول مرة أخرى لاحقاً.";

      if (error instanceof AuthServiceError && error.status === 409) {
        setRegisterErrors({
          email: "هذا البريد الإلكتروني مسجل بالفعل",
          form: errorMessage,
        });
      } else {
        setRegisterErrors({ form: errorMessage });
      }
      toast.error(errorMessage);
    } finally {
      setIsRegisterSubmitting(false);
    }
  };

  // Forgot Password Handlers
  const handleOpenForgotPassword = () => {
    if (values.email.trim() && !forgotEmail.trim()) {
      setForgotEmail(values.email.trim());
    }
    setForgotErrors({});
    setForgotSuccessMessage(null);
    handleSelectMode("forgot-password");
  };

  const handleForgotEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(event.target.value);
    if (forgotErrors.email || forgotErrors.form) {
      setForgotErrors({});
    }
  };

  const handleForgotSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isForgotSubmitting) return;

    const trimmedEmail = forgotEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setForgotErrors({ email: "البريد الإلكتروني مطلوب" });
      return;
    }
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setForgotErrors({ email: "يرجى إدخال بريد إلكتروني صحيح" });
      return;
    }

    setForgotErrors({});
    setIsForgotSubmitting(true);

    try {
      const result = await forgotPassword(trimmedEmail);
      setForgotSuccessMessage(result.message);
      toast.success(result.message);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof AuthServiceError
          ? error.message
          : "حدث خطأ بالسيرفر أثناء معالجة الطلب، حاول مرة أخرى لاحقًا.";

      setForgotErrors({ form: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsForgotSubmitting(false);
    }
  };

  const isBusy = isSubmitting || isRegisterSubmitting || isForgotSubmitting;

  return (
    <div className="w-full max-w-110 mx-auto">
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_16px_40px_rgb(0,0,0,0.45)] transition-colors duration-200">
        {/* Segmented Mode Switcher Tabs (Shown in Login & Register modes) */}
        {activeMode !== "forgot-password" ? (
          <div
            role="tablist"
            aria-label="اختيار تسجيل الدخول أو إنشاء حساب"
            className="mb-7 grid grid-cols-2 gap-1.5 rounded-xl border border-border bg-background p-1.5"
          >
            <button
              type="button"
              role="tab"
              id="auth-tab-login"
              aria-selected={activeMode === "login"}
              aria-controls="auth-panel-login"
              disabled={isBusy}
              onClick={() => handleSelectMode("login")}
              className={`relative flex h-10 items-center justify-center rounded-lg px-4 text-xs sm:text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed ${
                activeMode === "login"
                  ? "bg-[#242424] text-[#FFFFFF] dark:bg-[#F5F5F5] dark:text-[#111111] font-bold shadow-xs"
                  : "text-muted hover:text-foreground font-medium"
              }`}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              role="tab"
              id="auth-tab-register"
              aria-selected={activeMode === "register"}
              aria-controls="auth-panel-register"
              disabled={isBusy}
              onClick={() => handleSelectMode("register")}
              className={`relative flex h-10 items-center justify-center rounded-lg px-4 text-xs sm:text-sm transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed ${
                activeMode === "register"
                  ? "bg-[#242424] text-[#FFFFFF] dark:bg-[#F5F5F5] dark:text-[#111111] font-bold shadow-xs"
                  : "text-muted hover:text-foreground font-medium"
              }`}
            >
              إنشاء حساب
            </button>
          </div>
        ) : null}

        {/* VIEW 1: LOGIN */}
        {activeMode === "login" ? (
          <div
            id="auth-panel-login"
            role="tabpanel"
            aria-labelledby="auth-tab-login"
            className="transition-opacity duration-300 motion-reduce:transition-none"
          >
            {/* Login Form Header */}
            <div className="mb-6 space-y-2 text-right">
              <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-foreground">
                مرحباً بعودتك
              </h2>
              <p className="text-sm sm:text-[15px] leading-relaxed text-muted">
                سجّل الدخول للمتابعة إلى نظام ELSORY STORE.
              </p>
            </div>

            {registrationSuccessNotice ? (
              <div
                role="status"
                aria-live="polite"
                className="mb-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-3.5 text-right text-sm text-success"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-success"
                  aria-hidden="true"
                />
                <span className="font-medium leading-relaxed">
                  {registrationSuccessNotice}
                </span>
              </div>
            ) : null}

            {errors.form ? (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-right text-sm text-danger"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                  aria-hidden="true"
                />
                <span className="font-medium leading-relaxed">
                  {errors.form}
                </span>
              </div>
            ) : null}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-5"
              aria-label="نموذج تسجيل الدخول"
            >
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium text-foreground"
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={values.email}
                    onChange={handleEmailChange}
                    placeholder="example@elsory.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={
                      errors.email ? "login-email-error" : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-4 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.email
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                </div>
                {errors.email ? (
                  <p
                    id="login-email-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium text-foreground"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    value={values.password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? "login-password-error" : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-12 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      errors.password
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={isSubmitting}
                    aria-label={
                      showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p
                    id="login-password-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {errors.password}
                  </p>
                ) : null}
              </div>

              {/* Remember Me & Forgot Password Row */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <label
                  htmlFor="login-remember"
                  className="inline-flex cursor-pointer items-center gap-2.5 select-none text-sm text-foreground"
                >
                  <input
                    id="login-remember"
                    name="rememberMe"
                    type="checkbox"
                    disabled={isSubmitting}
                    checked={values.rememberMe}
                    onChange={handleRememberMeChange}
                    className="cursor-pointer h-4 w-4 rounded border-border accent-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed"
                  />
                  <span className="text-xs sm:text-sm font-medium text-muted hover:text-foreground transition-colors">
                    تذكرني
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleOpenForgotPassword}
                  disabled={isSubmitting}
                  className="text-xs sm:text-sm font-medium text-[#2563EB] transition-colors hover:text-[#1d4ed8] dark:text-[#3b82f6] dark:hover:text-[#60a5fa] focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
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
                      <span>جاري تسجيل الدخول...</span>
                    </>
                  ) : (
                    <>
                      <span>تسجيل الدخول</span>
                      <ArrowLeft
                        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* VIEW 2: REGISTER */}
        {activeMode === "register" ? (
          <div
            id="auth-panel-register"
            role="tabpanel"
            aria-labelledby="auth-tab-register"
            className="transition-opacity duration-300 motion-reduce:transition-none"
          >
            {/* Register Form Header */}
            <div className="mb-6 space-y-2 text-right">
              <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-foreground">
                إنشاء حساب جديد
              </h2>
              <p className="text-sm sm:text-[15px] leading-relaxed text-muted">
                أنشئ حسابك للوصول إلى نظام إدارة المتجر.
              </p>
            </div>

            {registerErrors.form ? (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-right text-sm text-danger"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                  aria-hidden="true"
                />
                <span className="font-medium leading-relaxed">
                  {registerErrors.form}
                </span>
              </div>
            ) : null}

            <form
              onSubmit={handleRegisterSubmit}
              noValidate
              className="space-y-4"
              aria-label="نموذج إنشاء حساب جديد"
            >
              {/* 1. Full Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-name"
                  className="block text-sm font-medium text-foreground"
                >
                  الاسم الكامل
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <User className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="register-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={isRegisterSubmitting}
                    value={registerValues.name}
                    onChange={handleRegisterFieldChange("name")}
                    placeholder="أدخل الاسم الكامل (3 - 50 حرفاً)"
                    aria-invalid={Boolean(registerErrors.name)}
                    aria-describedby={
                      registerErrors.name ? "register-name-error" : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-4 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      registerErrors.name
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                </div>
                {registerErrors.name ? (
                  <p
                    id="register-name-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {registerErrors.name}
                  </p>
                ) : null}
              </div>

              {/* 2. Email Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="block text-sm font-medium text-foreground"
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <Mail className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="register-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    disabled={isRegisterSubmitting}
                    value={registerValues.email}
                    onChange={handleRegisterFieldChange("email")}
                    placeholder="example@elsory.com"
                    aria-invalid={Boolean(registerErrors.email)}
                    aria-describedby={
                      registerErrors.email ? "register-email-error" : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-4 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      registerErrors.email
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                </div>
                {registerErrors.email ? (
                  <p
                    id="register-email-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {registerErrors.email}
                  </p>
                ) : null}
              </div>

              {/* 3. Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="block text-sm font-medium text-foreground"
                >
                  كلمة المرور
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="register-password"
                    name="password"
                    type={showRegisterPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isRegisterSubmitting}
                    value={registerValues.password}
                    onChange={handleRegisterFieldChange("password")}
                    placeholder="8 أحرف على الأقل"
                    aria-invalid={Boolean(registerErrors.password)}
                    aria-describedby={
                      registerErrors.password
                        ? "register-password-error"
                        : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-12 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      registerErrors.password
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword((prev) => !prev)}
                    disabled={isRegisterSubmitting}
                    aria-label={
                      showRegisterPassword
                        ? "إخفاء كلمة المرور"
                        : "إظهار كلمة المرور"
                    }
                    aria-pressed={showRegisterPassword}
                    className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {registerErrors.password ? (
                  <p
                    id="register-password-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {registerErrors.password}
                  </p>
                ) : null}
              </div>

              {/* 4. Confirm Password Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-sm font-medium text-foreground"
                >
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                    aria-hidden="true"
                  >
                    <Lock className="h-4.5 w-4.5" />
                  </span>
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showRegisterConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isRegisterSubmitting}
                    value={registerValues.confirmPassword}
                    onChange={handleRegisterFieldChange("confirmPassword")}
                    placeholder="أعد إدخال كلمة المرور"
                    aria-invalid={Boolean(registerErrors.confirmPassword)}
                    aria-describedby={
                      registerErrors.confirmPassword
                        ? "register-confirm-password-error"
                        : undefined
                    }
                    className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-12 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                      registerErrors.confirmPassword
                        ? "border-danger focus:border-danger focus:ring-danger/20"
                        : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowRegisterConfirmPassword((prev) => !prev)
                    }
                    disabled={isRegisterSubmitting}
                    aria-label={
                      showRegisterConfirmPassword
                        ? "إخفاء تأكيد كلمة المرور"
                        : "إظهار تأكيد كلمة المرور"
                    }
                    aria-pressed={showRegisterConfirmPassword}
                    className="absolute inset-y-0 left-0 flex w-11 items-center justify-center rounded-l-xl text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2563EB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {showRegisterConfirmPassword ? (
                      <EyeOff className="h-4.5 w-4.5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {registerErrors.confirmPassword ? (
                  <p
                    id="register-confirm-password-error"
                    role="alert"
                    className="text-xs font-medium text-danger pt-0.5"
                  >
                    {registerErrors.confirmPassword}
                  </p>
                ) : null}
              </div>

              {/* Register Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRegisterSubmitting}
                  aria-busy={isRegisterSubmitting}
                  className="group relative flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-65"
                >
                  {isRegisterSubmitting ? (
                    <>
                      <Loader2
                        className="h-4 w-4 animate-spin text-[#2563EB]"
                        aria-hidden="true"
                      />
                      <span>جاري إنشاء الحساب...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" aria-hidden="true" />
                      <span>إنشاء حساب</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* VIEW 3: FORGOT PASSWORD */}
        {activeMode === "forgot-password" ? (
          <div
            id="auth-panel-forgot-password"
            className="transition-opacity duration-300 motion-reduce:transition-none"
          >
            {forgotSuccessMessage ? (
              /* Forgot Password Success State */
              <div className="py-2 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#2563EB]/25 bg-[#2563EB]/10 text-[#2563EB]">
                  <Mail className="h-8 w-8" aria-hidden="true" />
                </div>

                <div className="space-y-2.5">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    تحقق من بريدك الإلكتروني
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">
                    {forgotSuccessMessage}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSuccessMessage(null);
                      handleSelectMode("login");
                    }}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    <span>العودة إلى تسجيل الدخول</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Forgot Password Form State */
              <>
                <div className="mb-6 space-y-2 text-right">
                  <h2 className="text-2xl sm:text-[1.75rem] font-bold tracking-tight text-foreground">
                    نسيت كلمة المرور؟
                  </h2>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-muted">
                    لا تقلق، أدخل بريدك الإلكتروني المسجل لدينا وسنرسل لك رابطًا
                    لإعادة تعيين كلمة المرور.
                  </p>
                </div>

                {forgotErrors.form ? (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3.5 text-right text-sm text-danger"
                  >
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0 text-danger"
                      aria-hidden="true"
                    />
                    <span className="font-medium leading-relaxed">
                      {forgotErrors.form}
                    </span>
                  </div>
                ) : null}

                <form
                  onSubmit={handleForgotSubmit}
                  noValidate
                  className="space-y-5"
                  aria-label="نموذج استعادة كلمة المرور"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="forgot-email"
                      className="block text-sm font-medium text-foreground"
                    >
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <span
                        className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted"
                        aria-hidden="true"
                      >
                        <Mail className="h-4.5 w-4.5" />
                      </span>
                      <input
                        id="forgot-email"
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        disabled={isForgotSubmitting}
                        value={forgotEmail}
                        onChange={handleForgotEmailChange}
                        placeholder="example@elsory.com"
                        aria-invalid={Boolean(forgotErrors.email)}
                        aria-describedby={
                          forgotErrors.email ? "forgot-email-error" : undefined
                        }
                        className={`block h-12 w-full rounded-xl border bg-background pr-11 pl-4 text-right text-sm text-foreground placeholder:text-muted/70 transition-all duration-150 focus:bg-surface focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
                          forgotErrors.email
                            ? "border-danger focus:border-danger focus:ring-danger/20"
                            : "border-border hover:border-[#A6A6A6]/70 focus:border-[#2563EB] focus:ring-[#2563EB]/20"
                        }`}
                      />
                    </div>
                    {forgotErrors.email ? (
                      <p
                        id="forgot-email-error"
                        role="alert"
                        className="text-xs font-medium text-danger pt-0.5"
                      >
                        {forgotErrors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={isForgotSubmitting}
                      aria-busy={isForgotSubmitting}
                      className="group relative flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#242424] dark:bg-[#F5F5F5] px-5 text-sm font-semibold text-[#FFFFFF] dark:text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#111111] dark:hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] active:scale-[0.995] disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      {isForgotSubmitting ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin text-[#2563EB]"
                            aria-hidden="true"
                          />
                          <span>جاري إرسال رابط الاستعادة...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" aria-hidden="true" />
                          <span>إرسال رابط الاستعادة</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isForgotSubmitting}
                      onClick={() => handleSelectMode("login")}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 text-xs sm:text-sm font-semibold text-foreground transition-colors hover:bg-surface-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB] disabled:opacity-50"
                    >
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      <span>العودة إلى تسجيل الدخول</span>
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
