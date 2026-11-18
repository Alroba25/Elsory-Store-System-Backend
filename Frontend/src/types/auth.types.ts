export type AuthMode = "login" | "register" | "forgot-password";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginFormValues extends LoginCredentials {
  rememberMe: boolean;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterFormValues extends RegisterPayload {
  confirmPassword: string;
}

export interface RegisterFormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export interface ForgotPasswordFormErrors {
  email?: string;
  form?: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordFormErrors {
  newPassword?: string;
  confirmPassword?: string;
  form?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "owner" | "cashier" | "accessories_seller" | "phone_seller" | "general";
}

export interface AuthResult {
  ok: boolean;
  status: number;
  message: string;
  user: AuthUser;
}

export interface RegisterResult {
  ok: boolean;
  status: number;
  message: string;
  user: AuthUser;
}

export interface ForgotPasswordResult {
  ok: boolean;
  status: number;
  message: string;
}

export interface ResetPasswordResult {
  ok: boolean;
  status: number;
  message: string;
}
