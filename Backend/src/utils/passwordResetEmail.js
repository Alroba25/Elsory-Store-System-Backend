const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const ENV_FILE_PATH = path.resolve(__dirname, "../../.env");

const hasRequiredSmtpEnv = () =>
  Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.PASSWORD_RESET_URL?.trim(),
  );

const isPasswordResetEmailConfigured = () => {
  if (!hasRequiredSmtpEnv()) {
    dotenv.config({ path: ENV_FILE_PATH, override: true });
  }
  return hasRequiredSmtpEnv();
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function resolveLogoFilePath() {
  const candidatePaths = [
    path.resolve(
      __dirname,
      "../../../Frontend/public/images/elsory-logo.png",
    ),
    path.resolve(process.cwd(), "../Frontend/public/images/elsory-logo.png"),
    path.resolve(process.cwd(), "public/images/elsory-logo.png"),
  ];

  for (const filePath of candidatePaths) {
    try {
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    } catch {
      // Continue trying next candidate path
    }
  }

  return null;
}

function resolveLogoConfiguration(resetUrl) {
  const configuredLogoUrl = process.env.PASSWORD_RESET_LOGO_URL?.trim();
  if (
    configuredLogoUrl &&
    configuredLogoUrl.startsWith("https://") &&
    !configuredLogoUrl.includes("localhost")
  ) {
    return {
      logoSrc: configuredLogoUrl,
      attachments: [],
    };
  }

  // On Production (HTTPS domain, not localhost), use the live HTTPS logo URL directly
  if (
    resetUrl.protocol === "https:" &&
    resetUrl.hostname !== "localhost" &&
    resetUrl.hostname !== "127.0.0.1"
  ) {
    return {
      logoSrc: `${resetUrl.origin}/images/elsory-logo.png`,
      attachments: [],
    };
  }

  // On Local Development (localhost), use CID inline attachment so localhost is never inside <img src>
  const logoFilePath = resolveLogoFilePath();
  if (logoFilePath) {
    const cidValue = "elsory-logo@elsory.store";
    return {
      logoSrc: `cid:${cidValue}`,
      attachments: [
        {
          filename: "elsory-logo.png",
          content: fs.readFileSync(logoFilePath),
          contentType: "image/png",
          cid: cidValue,
          contentDisposition: "inline",
        },
      ],
    };
  }

  return {
    logoSrc: null,
    attachments: [],
  };
}

function buildPasswordResetEmailHtml({ userName, resetLink, logoSrc }) {
  const trimmedName = typeof userName === "string" ? userName.trim() : "";
  const greetingText = trimmedName
    ? `مرحبًا ${escapeHtml(trimmedName)}،`
    : "مرحبًا،";
  const safeResetLink = escapeHtml(resetLink);

  const logoBlockHtml = logoSrc
    ? `<div style="display:inline-block;background-color:#F5F5F5;padding:12px 16px;border-radius:14px;margin-bottom:12px;">
         <img src="${escapeHtml(logoSrc)}" alt="ELSORY STORE" width="96" style="display:block;width:96px;max-width:96px;height:auto;border:0;outline:none;text-decoration:none;" />
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>إعادة تعيين كلمة المرور | ELSORY STORE</title>
</head>
<body dir="rtl" style="margin:0;padding:0;background-color:#F4F4F6;font-family:'Segoe UI',Tahoma,Arial,sans-serif;color:#111111;direction:rtl;text-align:right;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="background-color:#F4F4F6;padding:32px 16px;direction:rtl;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="rtl" style="max-width:560px;background-color:#FFFFFF;border:1px solid #E4E4E7;border-radius:18px;overflow:hidden;box-shadow:0 8px 28px rgba(17,17,17,0.06);direction:rtl;text-align:right;">
          <!-- Dark Brand Header -->
          <tr>
            <td align="center" style="background-color:#111111;padding:28px 24px;border-bottom:3px solid #2563EB;text-align:center;">
              ${logoBlockHtml}
              <div style="font-size:18px;font-weight:700;color:#F5F5F5;letter-spacing:0.6px;">
                ELSORY STORE
              </div>
              <div style="font-size:12px;color:#A6A6A6;margin-top:4px;">
                نظام الإدارة الداخلي للمحل
              </div>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding:32px 28px 24px 28px;direction:rtl;text-align:right;">
              <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.35;font-weight:700;color:#111111;text-align:right;">
                إعادة تعيين كلمة المرور
              </h1>

              <p style="margin:0 0 12px 0;font-size:15px;line-height:1.7;font-weight:600;color:#111111;text-align:right;">
                ${greetingText}
              </p>

              <p style="margin:0 0 24px 0;font-size:14px;line-height:1.8;color:#3F3F46;text-align:right;">
                تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك في نظام ELSORY STORE. اضغط على الزر التالي لإنشاء كلمة مرور جديدة.
              </p>

              <!-- Primary Action Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px 0;">
                <tr>
                  <td align="center">
                    <a href="${safeResetLink}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#111111;color:#FFFFFF;font-size:14px;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:12px;border:1px solid #242424;">
                      إعادة تعيين كلمة المرور
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiration Notice Box -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;background-color:#EFF6FF;border:1px solid #BFDBFE;border-radius:12px;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;line-height:1.6;font-weight:600;color:#1D4ED8;text-align:right;direction:rtl;">
                    هذا الرابط صالح لمدة 10 دقائق فقط من وقت طلب الاستعادة.
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <p style="margin:0 0 20px 0;font-size:13px;line-height:1.75;color:#52525B;background-color:#FAFAFA;border:1px solid #E4E4E7;border-radius:12px;padding:14px 16px;text-align:right;">
                إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة. لن يتم تغيير كلمة المرور الخاصة بك بدون إتمام عملية إعادة التعيين.
              </p>

              <!-- Direct Fallback Link -->
              <p style="margin:0;font-size:12px;line-height:1.6;color:#71717A;text-align:right;">
                في حال تعذر الضغط على الزر، يمكنك نسخ الرابط التالي ولصقه في المتصفح:
              </p>
              <p dir="ltr" style="margin:6px 0 0 0;font-size:11px;line-height:1.5;color:#2563EB;word-break:break-all;text-align:left;font-family:Consolas,Monaco,monospace;">
                <a href="${safeResetLink}" target="_blank" rel="noopener noreferrer" style="color:#2563EB;text-decoration:underline;">${safeResetLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#FAFAFA;border-top:1px solid #E4E4E7;padding:18px 28px;text-align:center;direction:rtl;">
              <p style="margin:0;font-size:12px;font-weight:600;color:#52525B;">
                ELSORY STORE – نظام الإدارة الداخلي للمحل
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildPasswordResetEmailText({ userName, resetLink }) {
  const trimmedName = typeof userName === "string" ? userName.trim() : "";
  const greetingLine = trimmedName ? `مرحبًا ${trimmedName}،` : "مرحبًا،";

  return [
    "ELSORY STORE – نظام الإدارة الداخلي للمحل",
    "==========================================",
    "",
    "إعادة تعيين كلمة المرور",
    "",
    greetingLine,
    "",
    "تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بحسابك في نظام ELSORY STORE. اضغط على الرابط التالي لإنشاء كلمة مرور جديدة:",
    resetLink,
    "",
    "هذا الرابط صالح لمدة 10 دقائق فقط من وقت طلب الاستعادة.",
    "",
    "إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذه الرسالة. لن يتم تغيير كلمة المرور الخاصة بك بدون إتمام عملية إعادة التعيين.",
    "",
    "------------------------------------------",
    "ELSORY STORE – نظام الإدارة الداخلي للمحل",
  ].join("\n");
}

function createSmtpTransporter() {
  const host = process.env.SMTP_HOST.trim();
  const port = Number(process.env.SMTP_PORT.trim());
  const secureEnv = process.env.SMTP_SECURE?.trim()?.toLowerCase();
  const secure =
    secureEnv === "true"
      ? true
      : secureEnv === "false"
        ? false
        : port === 465;

  const user = process.env.SMTP_USER.trim();
  const pass = process.env.SMTP_PASS.replace(/\s+/g, "");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

const sendPasswordResetEmail = async ({ email, name, token }) => {
  if (!isPasswordResetEmailConfigured()) {
    throw new Error("PASSWORD_RESET_EMAIL_NOT_CONFIGURED");
  }

  if (typeof email !== "string" || !email.trim()) {
    throw new Error("PASSWORD_RESET_RECIPIENT_REQUIRED");
  }

  if (typeof token !== "string" || !token.trim()) {
    throw new Error("PASSWORD_RESET_TOKEN_REQUIRED");
  }

  const resetUrl = new URL(process.env.PASSWORD_RESET_URL.trim());
  resetUrl.searchParams.set("token", token.trim());
  const resetLink = resetUrl.toString();

  const { logoSrc, attachments } = resolveLogoConfiguration(resetUrl);
  const smtpUser = process.env.SMTP_USER.trim();
  const transporter = createSmtpTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"ELSORY STORE" <${smtpUser}>`,
      to: email.trim(),
      subject: "إعادة تعيين كلمة المرور | ELSORY STORE",
      text: buildPasswordResetEmailText({
        userName: name,
        resetLink,
      }),
      html: buildPasswordResetEmailHtml({
        userName: name,
        resetLink,
        logoSrc,
      }),
      attachments,
    });

    if (
      !info ||
      !Array.isArray(info.accepted) ||
      info.accepted.length === 0
    ) {
      throw new Error("PASSWORD_RESET_EMAIL_REJECTED_BY_SMTP");
    }

    return info;
  } catch (error) {
    const code = error?.code || "UNKNOWN";
    const responseCode = error?.responseCode || "";

    if (code === "EAUTH" || responseCode === 535) {
      throw new Error(
        "SMTP_AUTHENTICATION_FAILED: Verify SMTP_USER and Google App Password in SMTP_PASS",
      );
    }

    if (
      code === "ESOCKET" ||
      code === "ECONNECTION" ||
      code === "ETIMEDOUT" ||
      code === "EDNS"
    ) {
      throw new Error(`SMTP_CONNECTION_FAILED_${code}`);
    }

    throw new Error(
      `PASSWORD_RESET_EMAIL_DELIVERY_FAILED_${code}${responseCode ? `_${responseCode}` : ""}`,
    );
  }
};

module.exports = {
  isPasswordResetEmailConfigured,
  sendPasswordResetEmail,
};
