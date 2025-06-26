import { CorsOptions } from "cors";
import { config } from "./environment";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://savannah.digital",
  "https://app.savannah.digital",
  "https://admin.savannah.digital",
];

// Add environment-specific origins
if (config.app.env === "development") {
  allowedOrigins.push(
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  );
}

export const corsConfig = {
  api: {
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-API-Key",
      "X-Client-Version",
      "X-Request-ID",
    ],
    exposedHeaders: [
      "X-Total-Count",
      "X-Rate-Limit-Remaining",
      "X-Rate-Limit-Reset",
    ],
    maxAge: 86400, // 24 hours
  } as CorsOptions,

  socket: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"],
  },
};
