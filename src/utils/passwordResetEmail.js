const isPasswordResetEmailConfigured = () =>
  Boolean(
    process.env.RESEND_API_KEY &&
      process.env.RESEND_FROM &&
      process.env.PASSWORD_RESET_URL,
  );

const sendPasswordResetEmail = async ({ email, token }) => {
  if (!isPasswordResetEmailConfigured()) {
    throw new Error("PASSWORD_RESET_EMAIL_NOT_CONFIGURED");
  }

  const resetUrl = new URL(process.env.PASSWORD_RESET_URL);
  resetUrl.searchParams.set("token", token);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10_000),
    body: JSON.stringify({
      from: process.env.RESEND_FROM,
      to: [email],
      subject: "Reset your Elsory Store password",
      text:
        "Use this link to reset your Elsory Store password. The link expires in 10 minutes: " +
        resetUrl.toString(),
      html:
        '<p>Use the link below to reset your Elsory Store password.</p><p><a href="' +
        resetUrl.toString() +
        '">Reset password</a></p><p>This link expires in 10 minutes.</p>',
    }),
  });

  if (!response.ok) {
    throw new Error("PASSWORD_RESET_EMAIL_DELIVERY_FAILED_" + response.status);
  }
};

module.exports = {
  isPasswordResetEmailConfigured,
  sendPasswordResetEmail,
};
