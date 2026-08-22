import { config } from "dotenv";

config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  host: process.env.HOST ?? "0.0.0.0",
  port: Number(process.env.PORT) ?? 3000,
  jwtSecret: process.env.JWT_SECRET ?? "",
  name: process.env.DB_NAME ?? "",
  url:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/neighborhood",
};

export const validateEnv = () => {
  if (!env.jwtSecret) throw new Error("JWT_SECRET is not defined in .env");
  if (!env.url) throw new Error("DATABASE_URL is not defined in .env");
};
