
import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectdb.js";
import cors from "cors";
import cookieParser from "cookie-parser";

import Authrouter from "./routes/auth.route.js";
import userrouter from "./routes/user.route.js";
import resumerouter from "./routes/resume.route.js";
import paymentRouter from "./routes/payment.route.js";

dotenv.config();

const app = express();

// Allowed frontend origins
const allowedOrigins = (
  process.env.CLIENT_URL ||
  (process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:5173")
)
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.replace(/\/$/, "");

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Origin is not allowed by CORS."));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", Authrouter);
app.use("/api/user", userrouter);
app.use("/api/resume", resumerouter);
app.use("/api/payment", paymentRouter);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VELTO server is running successfully.",
  });
});

// Server
const PORT = process.env.PORT || 8055;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`VELTO server running on port ${PORT}`);
      console.log("Allowed frontend origins:", allowedOrigins);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
