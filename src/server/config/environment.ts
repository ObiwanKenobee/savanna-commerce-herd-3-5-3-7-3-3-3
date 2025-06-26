import dotenv from "dotenv";
import path from "path";

// Load environment variables from multiple sources
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

interface Config {
  app: {
    env: string;
    name: string;
    version: string;
    debug: boolean;
  };
  server: {
    port: number;
    host: string;
    maxRequestSize: string;
    timeout: number;
  };
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
    ssl: boolean;
    poolMin: number;
    poolMax: number;
    connectionTimeout: number;
  };
  redis: {
    host: string;
    port: number;
    password?: string;
    db: number;
    ttl: number;
  };
  auth: {
    jwtSecret: string;
    jwtExpiry: string;
    refreshTokenExpiry: string;
    bcryptRounds: number;
    sessionSecret: string;
  };
  email: {
    service: string;
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  sms: {
    provider: string;
    apiKey: string;
    username: string;
  };
  payment: {
    mpesa: {
      consumerKey: string;
      consumerSecret: string;
      environment: string;
      shortCode: string;
      passKey: string;
    };
    stripe: {
      publicKey: string;
      secretKey: string;
      webhookSecret: string;
    };
  };
  storage: {
    provider: string;
    aws: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      bucket: string;
    };
  };
  monitoring: {
    sentryDsn?: string;
    enableMetrics: boolean;
    metricsPort: number;
  };
  blockchain: {
    stellar: {
      network: string;
      horizonUrl: string;
      secretKey: string;
    };
  };
  external: {
    nasa: {
      apiKey: string;
      baseUrl: string;
    };
    weather: {
      apiKey: string;
      baseUrl: string;
    };
  };
}

export const config: Config = {
  app: {
    env: process.env.NODE_ENV || "development",
    name: process.env.APP_NAME || "Savannah Digital Platform",
    version: process.env.APP_VERSION || "1.0.0",
    debug:
      process.env.DEBUG === "true" || process.env.NODE_ENV === "development",
  },
  server: {
    port: parseInt(process.env.PORT || "3001"),
    host: process.env.HOST || "localhost",
    maxRequestSize: process.env.MAX_REQUEST_SIZE || "10mb",
    timeout: parseInt(process.env.SERVER_TIMEOUT || "30000"),
  },
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    name: process.env.DB_NAME || "savannah_platform",
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    ssl: process.env.DB_SSL === "true",
    poolMin: parseInt(process.env.DB_POOL_MIN || "2"),
    poolMax: parseInt(process.env.DB_POOL_MAX || "10"),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || "60000"),
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || "0"),
    ttl: parseInt(process.env.REDIS_TTL || "3600"),
  },
  auth: {
    jwtSecret:
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-in-production",
    jwtExpiry: process.env.JWT_EXPIRY || "24h",
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12"),
    sessionSecret: process.env.SESSION_SECRET || "your-session-secret",
  },
  email: {
    service: process.env.EMAIL_SERVICE || "sendgrid",
    apiKey: process.env.EMAIL_API_KEY || "",
    fromEmail: process.env.FROM_EMAIL || "noreply@savannah.digital",
    fromName: process.env.FROM_NAME || "Savannah Platform",
  },
  sms: {
    provider: process.env.SMS_PROVIDER || "africas_talking",
    apiKey: process.env.SMS_API_KEY || "",
    username: process.env.SMS_USERNAME || "",
  },
  payment: {
    mpesa: {
      consumerKey: process.env.MPESA_CONSUMER_KEY || "",
      consumerSecret: process.env.MPESA_CONSUMER_SECRET || "",
      environment: process.env.MPESA_ENVIRONMENT || "sandbox",
      shortCode: process.env.MPESA_SHORT_CODE || "",
      passKey: process.env.MPESA_PASS_KEY || "",
    },
    stripe: {
      publicKey: process.env.STRIPE_PUBLIC_KEY || "",
      secretKey: process.env.STRIPE_SECRET_KEY || "",
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    },
  },
  storage: {
    provider: process.env.STORAGE_PROVIDER || "aws",
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      region: process.env.AWS_REGION || "us-east-1",
      bucket: process.env.AWS_BUCKET || "savannah-storage",
    },
  },
  monitoring: {
    sentryDsn: process.env.SENTRY_DSN,
    enableMetrics: process.env.ENABLE_METRICS === "true",
    metricsPort: parseInt(process.env.METRICS_PORT || "9090"),
  },
  blockchain: {
    stellar: {
      network: process.env.STELLAR_NETWORK || "testnet",
      horizonUrl:
        process.env.STELLAR_HORIZON_URL ||
        "https://horizon-testnet.stellar.org",
      secretKey: process.env.STELLAR_SECRET_KEY || "",
    },
  },
  external: {
    nasa: {
      apiKey: process.env.NASA_API_KEY || "",
      baseUrl: process.env.NASA_BASE_URL || "https://api.nasa.gov",
    },
    weather: {
      apiKey: process.env.WEATHER_API_KEY || "",
      baseUrl: process.env.WEATHER_BASE_URL || "https://api.openweathermap.org",
    },
  },
};

// Validate required environment variables
const requiredEnvVars = ["JWT_SECRET", "DB_PASSWORD"];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName],
);

if (missingEnvVars.length > 0 && config.app.env === "production") {
  console.error("Missing required environment variables:", missingEnvVars);
  process.exit(1);
}

export default config;
