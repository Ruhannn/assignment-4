import { configDotenv } from "dotenv";
import { env } from "process";

configDotenv({
  quiet: true,
});

const config = {
  NODE_ENV: env.NODE_ENV!,
  PORT: env.PORT!,
  DATABASE_URL: env.DATABASE_URL!,

  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET!,

  STRIPE_SECRET_KEY: env.STRIPE_SECRET_KEY!,
  STRIPE_WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET!,
}

export default config
