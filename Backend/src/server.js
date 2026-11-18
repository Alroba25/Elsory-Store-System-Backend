require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI must be configured before the server can start.");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET must be configured before the server can start.");
  process.exit(1);
}
try {
  new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.STORE_TIME_ZONE || "Africa/Cairo",
  });
} catch {
  console.error("STORE_TIME_ZONE must be a valid IANA time zone.");
  process.exit(1);
}

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    console.log("RESEND CONFIG:", {
      hasApiKey: Boolean(process.env.RESEND_API_KEY),
      from: process.env.RESEND_FROM,
      hasResetUrl: Boolean(process.env.PASSWORD_RESET_URL),
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
