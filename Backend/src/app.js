const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const healthRoutes = require("./routes/index.routes");

const app = express();

if (process.env.TRUST_PROXY) {
  const proxyHops = Number(process.env.TRUST_PROXY);
  if (!Number.isInteger(proxyHops) || proxyHops < 1) {
    throw new Error("TRUST_PROXY must be a positive number of trusted proxy hops.");
  }
  app.set("trust proxy", proxyHops);
} else if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet());

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      if (!requestOrigin) {
        return callback(null, true);
      }
      const normalizedOrigin = requestOrigin.replace(/\/$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use((req, res, next) => {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    req.body = {};
  }
  next();
});
app.use(cookieParser());

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Elsory Store API is running 🚀",
  });
});

app.use("/", healthRoutes);

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON request body",
    });
  }

  console.error("Unhandled API Error:", error.message);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

module.exports = app;
