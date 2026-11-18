import type {
  AuthResult,
  ForgotPasswordResult,
  LoginCredentials,
  RegisterPayload,
  RegisterResult,
  ResetPasswordPayload,
  ResetPasswordResult,
} from "@/src/types/auth.types";

const DEFAULT_AUTH_ERROR_MESSAGE =
  "تعذر تسجيل الدخول، تحقق من بياناتك وحاول مرة أخرى";

const DEFAULT_REGISTER_ERROR_MESSAGE =
  "تعذر إنشاء الحساب، تحقق من البيانات المدخلة وحاول مرة أخرى";

const DEFAULT_FORGOT_PASSWORD_ERROR_MESSAGE =
  "تعذر إرسال طلب استعادة كلمة المرور، يرجى المحاولة مرة أخرى لاحقًا.";

const DEFAULT_RESET_PASSWORD_ERROR_MESSAGE =
  "تعذر إعادة تعيين كلمة المرور، يرجى المحاولة مرة أخرى.";

export class AuthServiceError extends Error {
  public readonly status?: number;

  constructor(message: string = DEFAULT_AUTH_ERROR_MESSAGE, status?: number) {
    super(message);
    this.name = "AuthServiceError";
    this.status = status;
  }
}

function getAuthEndpoint(
  path:
    | "/login"
    | "/register"
    | "/logout"
    | "/forgot-password"
    | "/reset-password",
): string {
  return `/api${path}`;
}

export async function loginWithCredentials(
  credentials: LoginCredentials,
): Promise<AuthResult> {
  const endpoint = getAuthEndpoint("/login");

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: credentials.email.trim(),
        password: credentials.password,
      }),
    });
  } catch {
    throw new AuthServiceError("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
  }

  let data: {
    success?: boolean;
    message?: string;
    user?: AuthResult["user"];
  };

  try {
    data = await response.json();
  } catch {
    throw new AuthServiceError(DEFAULT_AUTH_ERROR_MESSAGE, response.status);
  }

  if (response.status === 429) {
    throw new AuthServiceError(
      "تم تجاوز الحد المسموح لمحاولات تسجيل الدخول (10 محاولات خلال 15 دقيقة). يرجى إعادة تشغيل خادم الـ Backend أو الانتظار قليلاً ثم المحاولة.",
      429,
    );
  }

  if (!response.ok || !data.success) {
    throw new AuthServiceError(
      data.message || DEFAULT_AUTH_ERROR_MESSAGE,
      response.status,
    );
  }

  if (!data.user) {
    throw new AuthServiceError(DEFAULT_AUTH_ERROR_MESSAGE, response.status);
  }

  return {
    ok: true,
    status: response.status,
    message: data.message || "تم تسجيل الدخول بنجاح",
    user: data.user,
  };
}

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResult> {
  const endpoint = getAuthEndpoint("/register");

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });
  } catch {
    throw new AuthServiceError("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
  }

  let data: {
    success?: boolean;
    message?: string;
    user?: RegisterResult["user"];
  } = {};

  try {
    data = await response.json();
  } catch {
    if (response.status >= 500) {
      throw new AuthServiceError(
        "حدث خطأ بالسيرفر، حاول مرة أخرى لاحقاً.",
        response.status,
      );
    }
    throw new AuthServiceError(DEFAULT_REGISTER_ERROR_MESSAGE, response.status);
  }

  if (response.status === 409) {
    throw new AuthServiceError(
      "البريد الإلكتروني مسجل بالفعل. يمكنك تسجيل الدخول بدلاً من إنشاء حساب جديد.",
      409,
    );
  }

  if (response.status === 429) {
    throw new AuthServiceError(
      "تم إجراء طلبات كثيرة في وقت قصير، يرجى الانتظار قليلاً والمحاولة لاحقاً.",
      429,
    );
  }

  if (response.status === 400) {
    throw new AuthServiceError(
      data.message ||
        "بيانات التسجيل غير مكتملة أو غير صحيحة، يرجى مراجعة الحقول.",
      400,
    );
  }

  if (response.status >= 500) {
    throw new AuthServiceError(
      "حدث خطأ بالسيرفر، حاول مرة أخرى لاحقاً.",
      response.status,
    );
  }

  if (!response.ok || !data.success || !data.user) {
    throw new AuthServiceError(
      data.message || DEFAULT_REGISTER_ERROR_MESSAGE,
      response.status,
    );
  }

  return {
    ok: true,
    status: response.status,
    message: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.",
    user: data.user,
  };
}

export async function forgotPassword(
  email: string,
): Promise<ForgotPasswordResult> {
  const endpoint = getAuthEndpoint("/forgot-password");

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
      }),
    });
  } catch {
    throw new AuthServiceError("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
  }

  let data: {
    success?: boolean;
    message?: string;
  } = {};

  try {
    data = await response.json();
  } catch {
    if (response.status === 503) {
      throw new AuthServiceError(
        "خدمة استعادة كلمة المرور غير متاحة مؤقتًا. يرجى المحاولة لاحقًا أو مراجعة إدارة المحل.",
        503,
      );
    }
    if (response.status >= 500) {
      throw new AuthServiceError(
        "حدث خطأ بالسيرفر أثناء معالجة الطلب، حاول مرة أخرى لاحقًا.",
        response.status,
      );
    }
    throw new AuthServiceError(
      DEFAULT_FORGOT_PASSWORD_ERROR_MESSAGE,
      response.status,
    );
  }

  if (response.status === 503) {
    throw new AuthServiceError(
      "خدمة استعادة كلمة المرور غير متاحة مؤقتًا. يرجى المحاولة لاحقًا أو مراجعة إدارة المحل.",
      503,
    );
  }

  if (response.status === 429) {
    throw new AuthServiceError(
      "لقد أجريت طلبات كثيرة في وقت قصير، يرجى الانتظار قليلاً قبل المحاولة مجددًا.",
      429,
    );
  }

  if (response.status === 400) {
    throw new AuthServiceError("يرجى إدخال بريد إلكتروني صحيح.", 400);
  }

  if (response.status >= 500) {
    throw new AuthServiceError(
      "حدث خطأ بالسيرفر أثناء معالجة الطلب، حاول مرة أخرى لاحقًا.",
      response.status,
    );
  }

  if (!response.ok || !data.success) {
    throw new AuthServiceError(
      DEFAULT_FORGOT_PASSWORD_ERROR_MESSAGE,
      response.status,
    );
  }

  return {
    ok: true,
    status: response.status,
    message:
      "إذا كان البريد الإلكتروني مسجلًا لدينا، فستصلك رسالة تحتوي على رابط إعادة تعيين كلمة المرور.",
  };
}

export async function resetPassword(
  payload: ResetPasswordPayload,
): Promise<ResetPasswordResult> {
  const endpoint = getAuthEndpoint("/reset-password");

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        token: payload.token,
        newPassword: payload.newPassword,
      }),
    });
  } catch {
    throw new AuthServiceError("تعذر الاتصال بالسيرفر، حاول مرة أخرى");
  }

  let data: {
    success?: boolean;
    message?: string;
  } = {};

  try {
    data = await response.json();
  } catch {
    if (response.status >= 500) {
      throw new AuthServiceError(
        "حدث خطأ بالسيرفر أثناء إعادة تعيين كلمة المرور، حاول مرة أخرى لاحقًا.",
        response.status,
      );
    }
    throw new AuthServiceError(
      DEFAULT_RESET_PASSWORD_ERROR_MESSAGE,
      response.status,
    );
  }

  if (response.status === 429) {
    throw new AuthServiceError(
      "لقد أجريت طلبات كثيرة في وقت قصير، يرجى الانتظار قليلاً قبل المحاولة مجددًا.",
      429,
    );
  }

  if (response.status === 400) {
    throw new AuthServiceError(
      "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. يمكنك طلب رابط جديد.",
      400,
    );
  }

  if (response.status >= 500) {
    throw new AuthServiceError(
      "حدث خطأ بالسيرفر أثناء إعادة تعيين كلمة المرور، حاول مرة أخرى لاحقًا.",
      response.status,
    );
  }

  if (!response.ok || !data.success) {
    throw new AuthServiceError(
      "رابط إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته. يمكنك طلب رابط جديد.",
      response.status,
    );
  }

  return {
    ok: true,
    status: response.status,
    message:
      "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.",
  };
}

export async function logoutFromServer(): Promise<string> {
  const endpoint = getAuthEndpoint("/logout");

  let response: Response;

  try {
    response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new AuthServiceError("تعذر الاتصال بالسيرفر");
  }

  let data: { success?: boolean; message?: string };

  try {
    data = await response.json();
  } catch {
    throw new AuthServiceError("حدث خطأ أثناء تسجيل الخروج", response.status);
  }

  if (!response.ok || !data.success) {
    throw new AuthServiceError(
      data.message || "تعذر تسجيل الخروج",
      response.status,
    );
  }

  return data.message || "تم تسجيل الخروج بنجاح";
}
